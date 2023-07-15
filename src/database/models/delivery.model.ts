import mongoose, { type Document, Schema } from 'mongoose'
import { type VendorDocument } from './vendor.model'
import { type CustomerDocument } from './customer.model'

export interface DeliveryDocument extends Document {
	from: VendorDocument
	to: CustomerDocument
	otp: number
}

const DeliverySchema = new Schema(
	{
		from: { type: Schema.Types.ObjectId, ref: 'vendors' },
		to: { type: Schema.Types.ObjectId, ref: 'customers' },
		deliverer: { type: Schema.Types.ObjectId, ref: 'deliverers' },
		otp: { type: Number }
	},
	{
		toJSON: {
			transform(doc, ret) {
				delete ret.createdAt
				delete ret.updatedAt
				delete ret.__v
			}
		}
	}
)

const Delivery = mongoose.model<DeliveryDocument>('deliveries', DeliverySchema)

export { Delivery }
