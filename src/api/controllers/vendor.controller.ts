import { type Request, type Response, type NextFunction } from 'express'
import {
	type UpdateVendorDto,
	type CreateFoodDto,
	type CreateVendorDto,
	LocationDto,
	ProcessOrderDto,
	AuthPayload,
	CreateOfferInputs
} from '../dto'
import {
	Order,
	Vendor,
	VendorDocument,
	Food,
	Offer, OfferDocument
} from '../../database/models'
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
	try {
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
	} catch (e) {
		next(e)
	}
}

export const FetchAllVendors = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<any> => {
	try {
		const vendors = await Vendor.find().populate('foods')

		if (vendors !== null) {
			return res.json({ status: 'success', vendors })
		}

		return res.json({ status: 'info', data: 'Vendors not found' })
	} catch (e) {
		next(e)
	}
}

export const FetchVendorById = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<any> => {
	try {
		const vendor_id = req.params.id

		const vendor = await FetchVendor(vendor_id, '')
		if (vendor === null) {
			res.json({ status: 'error', message: 'vendor does not exist' })
		}

		return res.json({
			status: 'success',
			vendor
		})
	} catch (e) {
		next(e)
	}
}

export const FetchVendorByEmail = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<any> => {
	try {
		const { email } = req.body

		const vendor = await FetchVendor('', String(email))

		if (vendor === null) {
			return res.json({
				status: 'error',
				message: 'vendor does not exist'
			})
		}

		return res.json({ status: 'success', data: vendor })
	} catch (e) {
		next(e)
	}
}

export const AddFood = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<any> => {
	try {
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
	} catch (e) {
		next(e)
	}
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

export const CreateOffer = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const user = req.user as AuthPayload

		if (user !== null) {
			const {
				title,
				description,
				offer_type,
				offer_amount,
				pincode,
				promocode,
				promo_type,
				start_validity,
				end_validity,
				bank,
				bins,
				min_value,
				is_active
			} = req.body as CreateOfferInputs

			const vendor = await FetchVendor(user._id)

			if (vendor !== null) {
				const offer = await Offer.create({
					title,
					description,
					offer_type,
					offer_amount,
					pincode,
					promo_type,
					promocode,
					start_validity,
					end_validity,
					bank,
					bins,
					is_active,
					min_value,
					vendor: [vendor]
				})
				return res.status(201).json(offer)
			}
		}
		return res.status(400).json({
			message: 'Error creating offer',
			status: 'error'
		})
	} catch (e) {
		next(e)
	}
}

export const GetOffers = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const user = req.user as AuthPayload
		if (user) {
			const current_offer = [] as any

			const offers = await Offer.find().populate('vendors')

			if (offers) {
				offers.map(item => {
					if (item.vendors) {
						item.vendors.map(vendor => {
							if (vendor._id.toString() === user._id) {
								current_offer.push(item)
							}
						})
					}

					if (item.offer_type === 'GENERIC') {
						current_offer.push(item)
					}
				})
			}

			return res.status(200).json(current_offer)
		}

		return res.json({ message: 'Offers Not available' })
	} catch (e) {
		next(e)
	}
}

export const EditOffer = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const user = req.user
		const offer_id = req.params.id
		if (user !== null) {
			const {
				title,
				description,
				offer_type,
				offer_amount,
				pincode,
				promocode,
				promo_type,
				start_validity,
				end_validity,
				bank,
				bins,
				min_value,
				is_active
			} = <CreateOfferInputs>req.body

			const current_offer = await Offer.findById(offer_id)
			if (current_offer) {
				const vendor = await FetchVendor(user?._id)

				if (vendor !== null) {
					current_offer.title = title
					current_offer.description = description
					current_offer.offer_type = offer_type
					current_offer.offer_amount = offer_amount
					current_offer.pincode = pincode
					current_offer.promo_type = promo_type
					current_offer.start_validity = start_validity
					current_offer.end_validity = end_validity
					current_offer.bank = bank as any
					current_offer.bins = bins as any
					current_offer.is_active = is_active
					current_offer.min_value = min_value

					const result = await current_offer.save() as OfferDocument

					return res.status(200).json(result)
				}
			}
		}
	} catch (e) {
		next(e)
	}
}
