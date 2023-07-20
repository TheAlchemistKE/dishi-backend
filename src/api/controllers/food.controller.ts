import { Request, Response, NextFunction } from 'express'
import { Types } from 'mongoose'
import { Food } from '../../database/models'
import { CreateFoodDto } from '../dto'
import { FoodRepository, VendorRepository } from '../../database/repositories'

const vendorRepo = new VendorRepository()
const foodRepo = new FoodRepository()

export const AddFood = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<any> => {
	try {
		const user = req.user

		const { name, description, category, food_type, ready_time, price } =
			req.body as CreateFoodDto

		const vendor = await vendorRepo.fetchVendor(
			new Types.ObjectId(user?._id),
			''
		)

		const created_food = await foodRepo.create({
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

export const GetFoods = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const user = req.user

		if (user !== null) {
			const foods = await foodRepo.find()
			if (foods.length > 0) {
				return res.status(200).json(foods)
			}
		}
	} catch (e) {
		next(e)
	}
}
