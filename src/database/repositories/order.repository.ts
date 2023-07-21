import { Types } from 'mongoose'
import { BaseRepository } from '../base'
import { Order, type OrderDocument } from '../models'

export class OrderRepository extends BaseRepository<OrderDocument> {
	constructor() {
		super(Order)
	}

	async getVendorCurrentOrders(vendor_id?: Types.ObjectId) {
		const current_orders = Order.find({ vendor_id }).populate('items.food')
		return current_orders
	}

	async getCustomerOrders(customer_id?: Types.ObjectId) {
		const customer_orders = Order.find({ customer_id }).populate(
			'items.food'
		)
		return customer_orders
	}

	async getOrderDetails(order_id?: Types.ObjectId) {
		const order = Order.findById(order_id).populate('items.food')
		return order
	}

	async getOrderFoodItems(order_id?: Types.ObjectId) {
		const order = Order.findById(order_id).populate('foods')
		return order
	}
}
