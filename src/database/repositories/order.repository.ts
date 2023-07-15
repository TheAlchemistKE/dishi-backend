import { BaseRepository } from '../base'
import { Order, type OrderDocument } from '../models'

export class OrderRepository extends BaseRepository<OrderDocument> {
	constructor() {
		super(Order)
	}
}
