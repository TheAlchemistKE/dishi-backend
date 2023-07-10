import mongoose, { Schema, type Document } from 'mongoose'

export interface OrderDocument extends Document {

  order_id: string
  vendor_id: string
  items: [any]
  total_amount: number
  paid_amount: number
  order_date: Date
  order_status: string
  remarks: string
  delivery_idd: string
  ready_time: number
}

const OrderSchema = new Schema({
  order_id: { type: String, require: true },
  vendor_id: { type: String, require: true },
  items: [
    {
      food: { type: Schema.Types.ObjectId, ref: 'food', require: true },
      unit: { type: Number, require: true }
    }
  ],
  total_amount: { type: Number, require: true },
  paid_amount: { type: Number, require: true },
  order_date: { type: Date },
  order_status: { type: String },
  remarks: { type: String },
  delivery_id: { type: String },
  ready_time: { type: Number }

}, {
  toJSON: {
    transform (doc, ret) {
      delete ret.__v
      delete ret.createdAt
      delete ret.updatedAt
    }
  },
  timestamps: true
})

const Order = mongoose.model<OrderDocument>('order', OrderSchema)

export { Order }
