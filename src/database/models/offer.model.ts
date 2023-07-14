import mongoose, { Schema, type Document } from 'mongoose'

export interface OfferDocument extends Document {
  offer_type: string
  vendors: [any]
  title: string
  description: string
  min_value: number
  offer_amount: number
  start_validity: Date
  end_validity: Date
  promocode: string
  promo_type: string
  bank: [any]
  bins: [any]
  pincode: string
  is_active: boolean
}

const OfferSchema = new Schema({

  offer_type: { type: String, require: true },
  vendors: [
    { type: Schema.Types.ObjectId, ref: 'vendors' }
  ],
  title: { type: String, require: true },
  description: { type: String },
  min_value: { type: Number, require: true },
  offer_amount: { type: Number, require: true },
  start_validity: Date,
  end_validity: Date,
  promocode: { type: String, require: true },
  promo_type: { type: String, require: true },
  bank: [{ type: String }],
  bins: [{ type: Number }],
  pincode: { type: String, require: true },
  is_active: Boolean

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

const Offer = mongoose.model<OfferDocument>('offers', OfferSchema)

export { Offer }
