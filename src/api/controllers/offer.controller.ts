import { Request, Response, NextFunction } from 'express'
import { Types } from 'mongoose'
import { Offer, OfferDocument } from '../../database/models'
import { AuthPayload, CreateOfferInputs } from '../dto'
import { OfferRepository, VendorRepository } from '../../database/repositories'

const offerRepo = new OfferRepository()
const vendorRepo = new VendorRepository()

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

			const vendor = await vendorRepo.fetchVendor(
				new Types.ObjectId(user._id)
			)

			if (vendor !== null) {
				const offer = await offerRepo.create({
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

		if (!user) {
			return res.json({ message: 'Offers Not available' })
		}

		const current_offer = await offerRepo.getCurrentOffers(user)
		return res.status(200).json(current_offer)
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
				const vendor = await vendorRepo.fetchVendor(
					new Types.ObjectId(user?._id)
				)

				if (vendor !== null) {
					current_offer.title = title
					current_offer.description = description
					current_offer.offer_type = offer_type
					current_offer.offer_amount = offer_amount
					current_offer.pincode = pincode
					current_offer.promocode = promocode
					current_offer.promo_type = promo_type
					current_offer.start_validity = start_validity
					current_offer.end_validity = end_validity
					current_offer.bank = bank as any
					current_offer.bins = bins as any
					current_offer.is_active = is_active
					current_offer.min_value = min_value

					const result = (await current_offer.save()) as OfferDocument

					return res.status(200).json(result)
				}
			}
		}
	} catch (e) {
		next(e)
	}
}

export const DeleteOffer = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const offer_id = req.params.id
		const isDeleted = await offerRepo.delete(new Types.ObjectId(offer_id))
		if (isDeleted === true) {
			return {
				status: 'success',
				message: 'Offer deleted successfully'
			}
		}
		return {
			status: 'error',
			message: 'Offer deletion failed'
		}
	} catch (e) {
		next(e)
	}
}
