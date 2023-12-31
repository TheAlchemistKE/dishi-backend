import { Request, Response, NextFunction } from 'express'
import { type AuthPayload, type VendorLoginDto } from '../dto'
import { GenerateSignature, ValidatePassword } from '../../utils'
import { VendorRepository } from '../../database/repositories'
import { Types } from 'mongoose'

const repo = new VendorRepository()

export const VendorLogin = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { email, password } = req.body as VendorLoginDto

		const existing_vendor = repo.fetchByEmail(email)

		if (existing_vendor !== null) {
			const validate = await ValidatePassword(
				password,
				existing_vendor.password as string,
				existing_vendor.salt as string
			)

			if (validate) {
				const signature = GenerateSignature({
					_id: String(existing_vendor._id),
					email: String(existing_vendor.email),
					address: String(existing_vendor.address),
					phone: String(existing_vendor.phone),
					name: String(existing_vendor.name),
					food_type: existing_vendor.food_type,
					rating: Number(existing_vendor.rating)
				})
				return res.json({
					status: 'success',
					token: String(signature)
				})
			} else {
				return res.json({
					status: 'error',
					message: 'Invalid Password'
				})
			}
		}

		return res.json({
			status: 'error',
			message: 'Bad credentials'
		})
	} catch (e) {
		next(e)
	}
}

export const VendorProfile = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { _id } = req.user as AuthPayload
		const vendor = await repo.findOne(new Types.ObjectId(_id))

		if (vendor !== null) {
			return res.json({
				status: 'success',
				user: vendor
			})
		}

		return res.json({
			status: 'error',
			message: 'User not found'
		})
	} catch (e) {
		next(e)
	}
}
