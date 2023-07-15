import { type Request, type Response, type NextFunction } from 'express'
import {
	type FoodDocument,
	Vendor,
	Offer,
	VendorDocument
} from '../../database/models'

export const GetFoodAvailability = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const pincode = req.params.pincodef

	const result = await Vendor.find({ pincode, service_available: true })
		.sort([['rating', 'descending']])
		.populate('foods')

	if (result.length > 0) {
		return res.status(200).json(result)
	}

	return res.status(404).json({ msg: 'data Not found!' })
}

export const GetTopRestaurants = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const pincode = req.params.pincode

	const result = await Vendor.find({ pincode, service_available: true })
		.sort([['rating', 'descending']])
		.limit(10)

	if (result.length > 0) {
		return res.status(200).json(result)
	}

	return res.status(404).json({ msg: 'data Not found!' })
}

export const GetFoodsIn30Min = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const pincode = req.params.pincode
	console.log(`Pincode: ${pincode}`)

	const result = await Vendor.find({
		pincode,
		service_available: true
	})
		.sort([['rating', 'descending']])
		.populate('foods')

	console.log(result)

	if (result.length > 0) {
		const foodResult: any = []
		result.map(vendor => {
			const foods = vendor.foods as [FoodDocument]
			foodResult.push(...foods.filter(food => food.ready_time <= 30))
		})
		return res.status(200).json(foodResult)
	}

	return res.status(404).json({ msg: 'data Not found!' })
}

export const SearchFoods = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const pincode = req.params.pincode
	const result = await Vendor.find({
		pincode,
		serviceAvailable: true
	}).populate('foods')

	if (result.length > 0) {
		const foodResult: any = []
		result.map(item => foodResult.push(...item.foods))
		return res.status(200).json(foodResult)
	}
	return res.status(404).json({ msg: 'data Not found!' })
}

export const RestaurantById = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const id = req.params.id

	const result = await Vendor.findById(id).populate('foods')

	if (result != null) {
		return res.status(200).json(result)
	}

	return res.status(404).json({ msg: 'data Not found!' })
}

export const GetAvailableOffers = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const pincode = req.params.pincode

	const offers = await Offer.find({ pincode, isActive: true })

	if (offers) {
		return res.status(200).json(offers)
	}

	return res.json({ message: 'Offers not Found!' })
}
