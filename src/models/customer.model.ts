import mongoose, { Schema, type Document } from 'mongoose'
import { type OrderDocument } from './order.model'

interface CustomerDocument extends Document {
  email: string
  password: string
  salt: string
  first_name: string
  last_name: string
  address: string
  phone: string
  verified: boolean
  otp: number
  otp_expiry: Date
  lat: number
  lng: number
  cart: [any]
  orders: [OrderDocument]
}

const CustomerSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  salt: { type: String, required: true },
  first_name: { type: String },
  last_name: { type: String },
  address: { type: String },
  phone: { type: String, required: true },
  verified: { type: Boolean },
  otp: { type: Number },
  otp_expiry: { type: Date },
  lat: { type: Number },
  lng: { type: Number },
  cart: [
    {
      food: { type: Schema.Types.ObjectId, ref: 'food', require: true },
      unit: { type: Number, require: true }
    }
  ],
  orders: [{
    type: Schema.Types.ObjectId,
    ref: 'order'
  }]

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

const Customer = mongoose.model<CustomerDocument>('customers', CustomerSchema)

export { Customer }
