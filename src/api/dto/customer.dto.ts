import { object, string } from 'yup'

export interface CreateCustomerPayload {
	first_name: string
	last_name: string
	email: string
	password: string
	phone: string
}

export const createCustomer = object({
	first_name: string().required('first_name is required'),
	last_name: string().required('last_name is required'),
	email: string().email().required('email is required'),
	password: string().required('password is required'),
	phone: string().required('phone is required')
})
