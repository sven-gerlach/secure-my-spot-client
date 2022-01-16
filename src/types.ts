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
  parkingSpot: number,
  rate: string,
  paid: boolean,
  startTime: string,
  endTime: string,
  stripePaymentIntentId: string,
}
