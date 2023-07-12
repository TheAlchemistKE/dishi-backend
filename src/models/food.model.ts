import mongoose, { Schema, type Document } from 'mongoose'
import { mongoosePagination, Pagination } from 'mongoose-paginate-ts'

export interface FoodDocument extends Document {
  vendor_id: string
  name: string
  description: string
  category: string
  food_type: string
  ready_time: number
  price: number
  rating: number
  images: [string]
}

const FoodSchema = new Schema(
  {
    vendor_id: { type: mongoose.SchemaTypes.ObjectId, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String },
    food_type: { type: String, required: true },
    ready_time: { type: Number },
    price: { type: Number },
    rating: { type: Number },
    images: { type: [String] },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v
        delete ret.createdAt
        delete ret.updatedAt
        delete ret.vendor_id
      },
    },
    timestamps: true,
  },
)

const Food = mongoose.model<FoodDocument>('foods', FoodSchema)

export { Food }
