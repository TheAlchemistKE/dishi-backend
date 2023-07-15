import { object, string, number, array, date } from 'yup'

export interface CreateOfferInputs {
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

export const OfferSchema = object({
	offer_type: string().required(),
	vendor: array().default([]),
	title: string().required(),
	description: string()
		.default('Offer description')
		.required('description is required'),
	min_value: number().required().min(1),
	offer_amount: number().required(),
	start_date: date()
})
