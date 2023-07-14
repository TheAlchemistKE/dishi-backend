import { BaseRepository } from '../base'
import { Order, OrderDocument } from '../models'

export class OrderRepository extends BaseRepository<OrderDocument> {
	constructor() {
		super(Order)
	}
}
