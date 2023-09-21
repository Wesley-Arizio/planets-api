export interface Reservation {
  id: string;
  userId: string;
  stationId: string;
  startsAt: Date;
  endsAt: Date;
}
