export interface IParkingSpot {
  id: string,
  lat: string,
  lng: string,
  rate: string,
  reserved: boolean,
  created_at?: string,
  updated_at?: string,
}

export interface IAlert {
  variant: string,
  heading: string,
  message: string,
}

export interface IReservation {
  id: number,
  user?: number,
  email: string,
  parking_spot: number,
  rate: string,
  paid: boolean,
  start_time: string,
  end_time: string
}
