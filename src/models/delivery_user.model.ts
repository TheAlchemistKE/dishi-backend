import mongoose, { Schema, type Document } from 'mongoose'

interface DeliveryUserDocument extends Document {
  email: string
  password: string
  salt: string
  first_name: string
  last_name: string
  address: string
  phone: string
  pincode: string
  verified: boolean
  otp: number
  otp_expiry: Date
  lat: number
  lng: number
  is_available: boolean
}

const DeliveryUserSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  salt: { type: String, required: true },
  first_name: { type: String },
  last_name: { type: String },
  address: { type: String },
  phone: { type: String, required: true },
  pincode: { type: String },
  verified: { type: Boolean },
  otp: { type: Number },
  otp_expiry: { type: Date },
  lat: { type: Number },
  lng: { type: Number },
  is_available: { type: Boolean, default: false }

}, {
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
})

const DeliveryUser = mongoose.model<DeliveryUserDocument>('deliveryUser', DeliveryUserSchema)

export { DeliveryUser }
