import { Request, Response, NextFunction } from 'express'
import { AuthPayload, ProcessOrderDto } from '../dto'
import { OrderRepository } from '../../database/repositories'
import { Types } from 'mongoose'

const orderRepo = new OrderRepository()

export const GetCurrentOrders = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const user = req.user as AuthPayload

		if (user !== null) {
			const current_orders = await orderRepo.getVendorCurrentOrders(
				new Types.ObjectId(user?._id)
			)

			if (current_orders !== null) {
				res.status(200).json(current_orders)
			}
		}
		return res.json({ message: 'Orders Not found' })
	} catch (e) {
		next(e)
	}
}

export const GetOrderDetails = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const order_id = req.params.id

		if (order_id !== null) {
			const order = await orderRepo.getOrderDetails(
				new Types.ObjectId(order_id)
			)

			if (order !== null) {
				return res.status(200).json(order)
			}
		}
		return res.json({ message: 'Order Not found' })
	} catch (e) {
		next(e)
	}
}

export const ProcessOrder = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const order_id: string = req.params.id

		const { status, remarks, ready_time } = req.body as ProcessOrderDto

		if (order_id !== null) {
			const order = await orderRepo.getOrderFoodItems(
				new Types.ObjectId(order_id)
			)

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
	} catch (e) {
		next(e)
	}
}
