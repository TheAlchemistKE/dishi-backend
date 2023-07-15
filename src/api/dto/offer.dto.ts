import { object, string, number, array, date } from 'yup'

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
