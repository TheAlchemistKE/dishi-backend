export interface CreateVendorDto {
  name: string
  owner_name: string
  food_type: [string]
  pincode: string
  address: string
  phone: string
  email: string
  password: string
}

export interface VendorLoginDto {
  email: string
  password: string
}

export interface VendorPayload {
  _id: string
  email: string
  address: string
  phone: string
  name: string
  food_type: any
  rating: number
}

export interface UpdateVendorProfileDto {
  name: string
  address: string
  phone: string
  food_type: [string]
}
