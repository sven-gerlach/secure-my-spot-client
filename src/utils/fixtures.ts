import * as faker from "faker";
import { IParkingSpot } from "../types";
import { round } from "lodash";


export function parkingSpotFixture(): IParkingSpot {
  return {
    id: faker.datatype.uuid(),
    lat: faker.address.latitude(),
    lng: faker.address.longitude(),
    rate: String(round(faker.datatype.float(), 2)),
    reserved: false
  }
}
