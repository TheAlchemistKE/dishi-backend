import { type Request, type Response, type NextFunction } from 'express'
import { type CreateFoodDto, type CreateVendorDto } from '../dto'
import { Vendor } from '../../database/models'
import { GeneratePassword, GenerateSalt } from '../../utils'
import { Food } from '../../database/models/food.model'
import { Pagination } from '../../interfaces'

export const FetchVendor = async (
	id?: string,
	email?: string
): Promise<any> => {
	if (email !== '') {
		return await Vendor.findOne({ email }).populate('foods')
	} else {
		return await Vendor.findById(id).populate('foods')
	}
}

export const CreateVendor = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<any> => {
	const {
		name,
		owner_name,
		food_type,
		pincode,
		address,
		phone,
		email,
		password
	} = req.body as CreateVendorDto

	const existing_vendor = await FetchVendor('', email)

	if (existing_vendor !== null) {
		return res.json({
			status: 'error',
			message: `Vendor with email ${existing_vendor.email} already exists`
		})
	}

	const salt = await GenerateSalt()
	const hash = await GeneratePassword(password, salt)

	const created_vendor = await Vendor.create({
		name,
		owner_name,
		food_type,
		pincode,
		address,
		phone,
		email,
		salt,
		service_available: false,
		cover_images: [],
		rating: 0,
		password: hash,
		foods: []
	})

	return res.json({ status: 'success', vendor: created_vendor })
}

export const FetchAllVendors = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<any> => {
	const vendors = await Vendor.find().populate('foods')

	if (vendors !== null) {
		return res.json({ status: 'success', vendors })
	}

	return res.json({ status: 'info', data: 'Vendors not found' })
}

export const FetchVendorById = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<any> => {
	const vendor_id = req.params.id

	const vendor = await FetchVendor(vendor_id, '')
	if (vendor === null) {
		res.json({ status: 'error', message: 'vendor does not exist' })
	}

	return res.json({
		status: 'success',
		vendor
	})
}

export const FetchVendorByEmail = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<any> => {
	const { email } = req.body

	const vendor = await FetchVendor('', String(email))

	if (vendor === null) {
		return res.json({ status: 'error', message: 'vendor does not exist' })
	}

	return res.json({ status: 'success', data: vendor })
}

export const AddFood = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<any> => {
	const user = req.user

	const { name, description, category, food_type, ready_time, price } =
		req.body as CreateFoodDto

	const vendor = await FetchVendor(user?._id, '')

	const created_food = await Food.create({
		name,
		description,
		category,
		food_type,
		ready_time,
		price,
		vendor_id: vendor
	})

	vendor.foods.push(created_food)
	vendor.save()

	return res.json({
		status: 'success',
		food: created_food
	})
}

export const CreateOffer = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<any> => {
	// const {} = req.body as
}
