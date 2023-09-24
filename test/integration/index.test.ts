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
          }
        }`,
        variables: { data: { limit: 1, offset: 0 } },
      });

    expect(response.status).toBe(200);
    expect(response.body.data.suitablePlanets[0].id).toBeDefined();

    const planetId = response.body.data.suitablePlanets[0].id;

    // Install station in a planet
    const stationResponse = await request(res.url)
      .post("/")
      .send({
        query: `mutation InstallStation($data: InstallStationInput!) {
        installStation(data: $data) {
            id
            name
        }
      }`,
        variables: { data: { name: "spacex", planetId } },
      });

    expect(stationResponse.status).toBe(200);
    expect(stationResponse.body.data.installStation.id).toBeDefined();
    expect(stationResponse.body.data.installStation.name).toBe("spacex");

    const stationId = stationResponse.body.data.installStation.id;

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
  });
});
