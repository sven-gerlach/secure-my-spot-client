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
