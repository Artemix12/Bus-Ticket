export type Booking = {
  _id: string
  passengerCount: number
  seatNumber: number
  isUsed: boolean
  totalPrice: number
  createdAt: string
  trip:
  {
  origin: string
  destination: string
  departureDate: string
  departureTime: string
  price: number
  }
 
  
}

export type Trip = {
  _id?: string
  from: string
  to: string
  departureDate: string
  departureTime: string
  price: number
  remainingSeat: number
  status: string
  totalSeat: number
}

export type User = {
  id: string
  name: string | null
  email: string | null
  image?: string | null
}
