import { type Request, type Response, type NextFunction } from 'express'
import {
	type UpdateVendorDto,
	type CreateFoodDto,
	type CreateVendorDto,
	LocationDto,
	ProcessOrderDto,
	AuthPayload
} from '../dto'
import { Order, Vendor, VendorDocument, Food } from '../../database/models'
import { GeneratePassword, GenerateSalt } from '../../utils'

export const FetchVendor = async (
	id?: string,
	email?: string
): Promise<any> => {
	if (email !== '') {
		return Vendor.findOne({ email }).populate('foods')
	} else {
		return Vendor.findById(id).populate('foods')
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
			message: `Vendor already exists`
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

export const UpdateVendorProfile = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<any> => {
	const user = req.user as AuthPayload

	const { food_type, address, phone, email } = req.body as UpdateVendorDto

	if (user !== null) {
		const existing_vendor = await FetchVendor(user._id)

		if (existing_vendor !== null) {
			existing_vendor.food_type = food_type
			existing_vendor.address = address
			existing_vendor.phone = phone
			existing_vendor.email = email

			const result = (await existing_vendor.save()) as VendorDocument
			return res.status(200).json(result)
		}
	}
	return res.status(400).json({
		status: 'error',
		message: 'Error updating vendor profile'
	})
}

export const UpdateVendorCoverImage = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const user = req.user as AuthPayload
	if (user !== null) {
		const vendor = await FetchVendor(user?._id)

		if (vendor !== null) {
			const files = req?.files as [Express.Multer.File]
			const images = files.map(
				(file: Express.Multer.File) => file.filename
			)

			vendor.cover_images.push(...images) as string[]

			const result = (await vendor.save()) as VendorDocument

			return res.status(200).json(result)
		}
	}
	return res.status(400).json({
		status: 'error',
		message: 'Error updating cover images'
	})
}

export const UpdateVendorAvailability = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const user = req.user

	const { lat, lng } = req.body as LocationDto

	if (user !== null) {
		const existing_vendor = await FetchVendor(user?._id)
		if (existing_vendor !== null) {
			existing_vendor.service_available =
				!existing_vendor.service_available

			if (lat !== 0 && lng !== 0) {
				existing_vendor.lat = lat
				existing_vendor.lng = lng
			}

			const result = (await existing_vendor.save()) as VendorDocument
			return res.status(200).json(result)
		}
	}
	return res.status(400).json({
		status: 'error',
		message: 'Error updating vendor availability'
	})
}

export const GetFoods = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const user = req.user

	if (user !== null) {
		const foods = await Food.find({
			vendor_id: user?._id
		})
		if (foods.length > 0) {
			return res.status(200).json(foods)
		}
	}
}

export const GetCurrentOrders = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const user = req.user as AuthPayload

	if (user !== null) {
		const current_orders = await Order.find({
			vendor_id: user._id
		}).populate('items.food')

		if (current_orders !== null) {
			res.status(200).json(current_orders)
		}
	}
	return res.json({ message: 'Orders Not found' })
}

export const GetOrderDetails = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const order_id = req.params.id

	if (order_id !== null) {
		const order = await Order.findById(order_id).populate('items.food')

		if (order !== null) {
			return res.status(200).json(order)
		}
	}
	return res.json({ message: 'Order Not found' })
}

export const ProcessOrder = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const order_id: string = req.params.id

	const { status, remarks, ready_time } = req.body as ProcessOrderDto

	if (order_id !== null) {
		const order = await Order.findById(order_id).populate('foods')

		if (order !== null) {
			order.order_status = status
			order.remarks = remarks

			if (ready_time !== null) {
				order.ready_time = ready_time
			}

			const result = await order.save()
			return res.status(200).json(result)
		}
	}
	return res.status(400).json({ message: 'Error Processing Order' })
}
