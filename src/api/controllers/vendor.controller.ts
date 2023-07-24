import { type Request, type Response, type NextFunction } from 'express'
import {
	type UpdateVendorDto,
	type CreateVendorDto,
	LocationDto,
	AuthPayload
} from '../dto'
import { GeneratePassword, GenerateSalt } from '../../utils'
import { VendorRepository } from '../../database/repositories'
import { Types } from 'mongoose'

const repo = new VendorRepository()

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

		const existing_vendor = repo.fetchByEmail(email)

		if (existing_vendor !== null) {
			return res.json({
				status: 'error',
				message: `Vendor already exists`
			})
		}

		const salt = await GenerateSalt()
		const hash = await GeneratePassword(password, salt)

		const created_vendor = await repo.create({
			name,
			owner_name,
			food_type,
			pincode,
			address,
			phone,
			email,
			salt,
			service_available: false,
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
		const vendors = await repo.find()

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

		const vendor = await repo.findOne(new Types.ObjectId(vendor_id))
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

export const FetchVendorByEmail = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { email } = req.params

		const vendor = repo.fetchByEmail(String(email))

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

export const UpdateVendorProfile = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<any> => {
	try {
		const user = req.user as AuthPayload

		const { food_type, address, phone, email } = req.body as UpdateVendorDto

		if (user !== null) {
			const existing_vendor = await repo.findOne(
				new Types.ObjectId(user._id)
			)

			if (existing_vendor !== null) {
				existing_vendor.food_type = food_type
				existing_vendor.address = address
				existing_vendor.phone = phone
				existing_vendor.email = email

				const result = await existing_vendor.save()
				return res.status(200).json(result)
			}
		}
		return res.status(400).json({
			status: 'error',
			message: 'Error updating vendor profile'
		})
	} catch (e) {
		next(e)
	}
}

export const UpdateVendorCoverImage = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const user = req.user as AuthPayload
		if (user !== null) {
			const vendor = await repo.findOne(new Types.ObjectId(user?._id))

			if (vendor !== null) {
				const files = req?.files as [Express.Multer.File]
				const images = files.map(
					(file: Express.Multer.File) => file.filename
				)

				vendor.cover_images.push(...images)

				const result = await vendor.save()

				return res.status(200).json(result)
			}
		}
		return res.status(400).json({
			status: 'error',
			message: 'Error updating cover images'
		})
	} catch (e) {
		next(e)
	}
}

export const UpdateVendorAvailability = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const user = req.user

		const { lat, lng } = req.body as LocationDto

		if (user !== null) {
			const existing_vendor = await repo.findOne(
				new Types.ObjectId(user?._id)
			)
			if (existing_vendor !== null) {
				existing_vendor.service_available =
					!existing_vendor.service_available

				if (lat !== 0 && lng !== 0) {
					existing_vendor.lat = lat
					existing_vendor.lng = lng
				}

				const result = await existing_vendor.save()
				return res.status(200).json(result)
			}
		}
		return res.status(400).json({
			status: 'error',
			message: 'Error updating vendor availability'
		})
	} catch (e) {
		next(e)
	}
}
