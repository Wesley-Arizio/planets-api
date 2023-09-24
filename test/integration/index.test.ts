import { ApolloServer, BaseContext } from "@apollo/server";
import { main } from "../../src/index";
import { execSync } from "child_process";

import request from "supertest";

const RealDate = Date.now;

const setupDb = () => {
  execSync("npx prisma db push --force-reset && npm run seed");
};

describe("Workflow", () => {
  let res: { server: ApolloServer<BaseContext>; url: string };
  beforeAll(async () => {
    res = await main();
    setupDb();
    // Reset database and run seed to populate planets table
    global.Date.now = jest.fn(() => new Date("2023-04-11T07:00:00Z").getTime());
  });

  afterAll(async () => {
    await res.server.stop();

    global.Date.now = RealDate;
  });

  it("Reservation workflow", async () => {
    // List suitable planets
    const response = await request(res.url)
      .post("/")
      .send({
        query: `query ListPlanets($data: PaginationInput!) {
          suitablePlanets(data: $data) {
            id
            name
            mass
          }
        }`,
        variables: { data: { limit: 1, offset: 0 } },
      });

    expect(response.status).toBe(200);
    expect(response.body.data.suitablePlanets[0].id).toBeDefined();
    expect(response.body.data.suitablePlanets[0].name).toBe("Kepler-37 b");
    expect(response.body.data.suitablePlanets[0].mass).toBe(10);

    const planetId = response.body.data.suitablePlanets[0].id;

    // Install station in a planet
    const stationResponse = await request(res.url)
      .post("/")
      .send({
        query: `mutation InstallStation($data: InstallStationInput!) {
        installStation(data: $data) {
            id
            name
            planet {
              id
              name
              mass
            }
        }
      }`,
        variables: { data: { name: "spacex", planetId } },
      });

    expect(stationResponse.status).toBe(200);
    expect(stationResponse.body.data.installStation.id).toBeDefined();
    expect(stationResponse.body.data.installStation.name).toBe("spacex");
    expect(stationResponse.body.data.installStation.planet.id).toBe(planetId);
    expect(stationResponse.body.data.installStation.planet.name).toBe(
      "Kepler-37 b"
    );
    expect(stationResponse.body.data.installStation.planet.mass).toBe(10);

    const stationId = stationResponse.body.data.installStation.id;

    // Stations from a planet
    const stationsResponse = await request(res.url)
      .post("/")
      .send({
        query: `query ListStations($data: StationsInput!) {
          stations(data: $data) {
            id
            name
          }
        }
        `,
        variables: { data: { planetId, offset: 0, limit: 5 } },
      });

    expect(stationsResponse.status).toBe(200);
    expect(stationsResponse.body.data.stations.length).toBe(1);
    expect(stationsResponse.body.data.stations[0].id).toBe(stationId);
    expect(stationsResponse.body.data.stations[0].name).toBe("spacex");

    // Create a new user
    const userResponse = await request(res.url)
      .post("/")
      .send({
        query: `mutation CreateUser($data: CreateUserInput!) {
            createUser(data: $data) {
                id
                email
                password
            }
          }`,
        variables: {
          data: { email: "test@gmail.com", password: "123456" },
        },
      });

    expect(userResponse.status).toBe(200);
    expect(userResponse.body.data.createUser.id).toBeDefined();
    expect(userResponse.body.data.createUser.email).toBe("test@gmail.com");
    expect(userResponse.body.data.createUser.password).toBe("123456");

    let startsAt = "2023-04-11T08:00:00.000Z";
    let endsAt = "2023-04-11T09:00:00.000Z";
    const userId1 = userResponse.body.data.createUser.id;

    const userReservation1 = await request(res.url)
      .post("/")
      .send({
        query: `mutation CreateReservation($data: RervateStationInput!) {
            reservateStation(data: $data) {
              id
              startsAt
              endsAt
              station {
                id
                name
                planet {
                  name
                }
              }
          }
        }`,
        variables: {
          data: {
            startsAt,
            endsAt,
            userId: userId1,
            stationId,
          },
        },
      });

    expect(userReservation1.status).toBe(200);
    expect(userReservation1.body.data.reservateStation.id).toBeDefined();
    expect(userReservation1.body.data.reservateStation.startsAt).toBe(startsAt);
    expect(userReservation1.body.data.reservateStation.endsAt).toBe(endsAt);
    expect(userReservation1.body.data.reservateStation.station.id).toBe(
      stationId
    );
    expect(userReservation1.body.data.reservateStation.station.name).toBe(
      "spacex"
    );
    expect(
      userReservation1.body.data.reservateStation.station.planet.name
    ).toBe("Kepler-37 b");

    const userResponse2 = await request(res.url)
      .post("/")
      .send({
        query: `mutation CreateUser($data: CreateUserInput!) {
            createUser(data: $data) {
                id
                email
                password
            }
          }`,
        variables: {
          data: { email: "test2@gmail.com", password: "123456" },
        },
      });

    expect(userResponse2.status).toBe(200);
    expect(userResponse2.body.data.createUser.id).toBeDefined();
    expect(userResponse2.body.data.createUser.email).toBe("test2@gmail.com");
    expect(userResponse2.body.data.createUser.password).toBe("123456");

    const userId2 = userResponse2.body.data.createUser.id;

    // Another user tries to make a reservation in a range within the first reservation
    startsAt = "2023-04-11T08:10:00.000Z";
    endsAt = "2023-04-11T08:40:00.000Z";

    const userReservation2 = await request(res.url)
      .post("/")
      .send({
        query: `mutation CreateReservation($data: RervateStationInput!) {
          reservateStation(data: $data) {
            id
            startsAt
            endsAt
        }
      }`,
        variables: {
          data: {
            startsAt,
            endsAt,
            userId: userId2,
            stationId,
          },
        },
      });

    expect(userReservation2.status).toBe(200);
    expect(userReservation2.body.errors[0].message).toBe(
      "The selected station is already occupied"
    );

    // Another user tries to make a reservation in a range that starts before the first reservation but the entsAt is in the middle of the first reservation
    startsAt = "2023-04-11T07:30:00.000Z";
    endsAt = "2023-04-11T08:40:00.000Z";

    const userReservation3 = await request(res.url)
      .post("/")
      .send({
        query: `mutation CreateReservation($data: RervateStationInput!) {
          reservateStation(data: $data) {
            id
            startsAt
            endsAt
        }
      }`,
        variables: {
          data: {
            startsAt,
            endsAt,
            userId: userId2,
            stationId,
          },
        },
      });

    expect(userReservation3.status).toBe(200);
    expect(userReservation3.body.errors[0].message).toBe(
      "The selected station is already occupied"
    );

    // Another user tries to make a reservation in a rage that starts in the middle of the first reservation but the endsAt is out of the range of the first reservation
    startsAt = "2023-04-11T08:30:00.000Z";
    endsAt = "2023-04-11T09:40:00.000Z";

    const userReservation4 = await request(res.url)
      .post("/")
      .send({
        query: `mutation CreateReservation($data: RervateStationInput!) {
          reservateStation(data: $data) {
            id
            startsAt
            endsAt
        }
      }`,
        variables: {
          data: {
            startsAt,
            endsAt,
            userId: userId2,
            stationId,
          },
        },
      });

    expect(userReservation4.status).toBe(200);
    expect(userReservation4.body.errors[0].message).toBe(
      "The selected station is already occupied"
    );

    // User tries to make another reservation that ends within it's own previous reservation
    startsAt = "2023-04-11T08:30:00.000Z";
    endsAt = "2023-04-11T08:50:00.000Z";

    const userReservation5 = await request(res.url)
      .post("/")
      .send({
        query: `mutation CreateReservation($data: RervateStationInput!) {
          reservateStation(data: $data) {
            id
            startsAt
            endsAt
        }
      }`,
        variables: {
          data: {
            startsAt,
            endsAt,
            userId: userId1,
            stationId,
          },
        },
      });

    expect(userReservation5.status).toBe(200);
    expect(userReservation5.body.errors[0].message).toBe(
      "User already have an ongoing reservation"
    );

    // User can make a reservation in the future even if he already have one
    startsAt = "2023-04-11T11:30:00.000Z";
    endsAt = "2023-04-11T12:00:00.000Z";

    const userReservation6 = await request(res.url)
      .post("/")
      .send({
        query: `mutation CreateReservation($data: RervateStationInput!) {
              reservateStation(data: $data) {
                id
                startsAt
                endsAt
            }
          }`,
        variables: {
          data: {
            startsAt,
            endsAt,
            userId: userId1,
            stationId,
          },
        },
      });

    expect(userReservation6.status).toBe(200);
    expect(userReservation6.body.errors).toBeUndefined();
    expect(userReservation6.body.data.reservateStation.id).toBeDefined();
    expect(userReservation6.body.data.reservateStation.startsAt).toBe(startsAt);
    expect(userReservation6.body.data.reservateStation.endsAt).toBe(endsAt);

    // User tries to make a reservation for a time in the past
    startsAt = "2023-04-10T08:30:00.000Z";
    endsAt = "2023-04-10T08:50:00.000Z";

    const userReservation7 = await request(res.url)
      .post("/")
      .send({
        query: `mutation CreateReservation($data: RervateStationInput!) {
          reservateStation(data: $data) {
            id
            startsAt
            endsAt
        }
      }`,
        variables: {
          data: {
            startsAt,
            endsAt,
            userId: userId2,
            stationId,
          },
        },
      });

    expect(userReservation7.status).toBe(200);
    expect(userReservation7.body.errors[0].message).toBe(
      "startsAt cannot be in the past"
    );

    // User tries to make a reservation in a station that does not exist
    startsAt = "2023-04-12T14:30:00.000Z";
    endsAt = "2023-04-12T19:50:00.000Z";

    const userReservation8 = await request(res.url)
      .post("/")
      .send({
        query: `mutation CreateReservation($data: RervateStationInput!) {
              reservateStation(data: $data) {
                id
                startsAt
                endsAt
            }
          }`,
        variables: {
          data: {
            startsAt,
            endsAt,
            userId: userId2,
            stationId: "da2f20ff-cb66-49ac-8344-d1d13f6796fc",
          },
        },
      });

    expect(userReservation8.status).toBe(200);
    expect(userReservation8.body.errors[0].message).toBe("Station not found");

    // Second user make a reservation right after the first user
    startsAt = "2023-04-11T09:00:01.000Z";
    endsAt = "2023-04-11T10:00:00.000Z";

    const userReservation9 = await request(res.url)
      .post("/")
      .send({
        query: `mutation CreateReservation($data: RervateStationInput!) {
            reservateStation(data: $data) {
              id
              startsAt
              endsAt
              station {
                id
                name
                planet {
                  name
                }
              }
          }
        }`,
        variables: {
          data: {
            startsAt,
            endsAt,
            userId: userId2,
            stationId,
          },
        },
      });

    expect(userReservation9.status).toBe(200);
    expect(userReservation9.body.data.reservateStation.id).toBeDefined();
    expect(userReservation9.body.data.reservateStation.startsAt).toBe(startsAt);
    expect(userReservation9.body.data.reservateStation.endsAt).toBe(endsAt);
    expect(userReservation9.body.data.reservateStation.station.id).toBe(
      stationId
    );
    expect(userReservation9.body.data.reservateStation.station.name).toBe(
      "spacex"
    );
    expect(
      userReservation9.body.data.reservateStation.station.planet.name
    ).toBe("Kepler-37 b");
  });
});
