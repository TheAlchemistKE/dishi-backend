import { type Request, type Response, type NextFunction } from 'express'
import { type CreateCustomerPayload, createCustomer } from '../dto/customer.dto'
import { Customer } from '../../database/models'
import { GeneratePassword, GenerateSalt } from '../../utils'

export const CreateCustomer = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const data = req.body as CreateCustomerPayload
	const customer = await createCustomer.validate(data)
	const salt = await GenerateSalt()
	const hash = await GeneratePassword(customer.password, salt)
	const customerPayload = {
		first_name: customer.first_name,
		last_name: customer.last_name,
		email: customer.email,
		password: hash,
		phone: customer.phone,
		salt
	}
	const createdCustomer = await Customer.create(customerPayload)
	if (createdCustomer !== null) {
		return res.status(201).json({
			status: 'success',
			data: createdCustomer
		})
	}

	return res.status(400).json({
		status: 'error',
		message: 'Could not create customer'
	})
}

export const FetchAllCustomers = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const customers = await Customer.find()
	if (customers.length === 0) {
		return res.status(404).json({
			status: 'error',
			message: 'No customer data found'
		})
	}
	return res.status(200).json({
		status: 'success',
		data: customers
	})
}
