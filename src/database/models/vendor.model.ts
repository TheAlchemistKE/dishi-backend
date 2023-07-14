import mongoose, { Schema, type Document } from 'mongoose'

export interface VendorDocument extends Document {
  name: string
  owner_name: string
  food_type: [string]
  pincode: string
  address: string
  phone: string
  email: string
  password: string
  salt: string
  service_available: boolean
  cover_images: [string]
  rating: number
  foods: any
}

const VendorSchema = new Schema(
  {
    name: { type: String, required: true },
    owner_name: { type: String, required: true },
    food_type: { type: [String] },
    pincode: { type: String, required: true },
    address: { type: String },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    service_available: { type: Boolean },
    cover_images: { type: [String] },
    rating: { type: Number },
    foods: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'foods'
      }
    ],
    lat: { type: Number },
    lng: { type: Number }
  },
  {
    toJSON: {
      transform (doc, ret) {
        delete ret.password
        delete ret.salt
        delete ret.__v
        delete ret.createdAt
        delete ret.updatedAt
      }
    },
    timestamps: true
  }
)

const Vendor = mongoose.model<VendorDocument>('vendors', VendorSchema)

export { Vendor }
