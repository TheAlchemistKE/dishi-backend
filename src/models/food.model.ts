import mongoose, { Schema, Document, Model } from 'mongoose'

interface FoodDocument extends Document {
  name: string
  description: string
  category: string
  food_type: string
  ready_time: number
  price: number
  rating: number
  vendor_id: string
  images: [string]
}

const FoodSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    food_type: { type: String, required: true },
    ready_time: { type: Number, required: true },
    price: { type: Number, required: true },
    rating: { type: Number },
    vendor_id: { type: String },
    images: { type: [String] },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.createdAt, delete ret.updatedAt
      },
    },
    timestamps: true,
  },
)

const Food = mongoose.model('food', FoodSchema)

export { Food }
