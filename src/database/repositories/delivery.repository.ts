import { BaseRepository } from '../base'
import { Delivery, type DeliveryDocument } from '../models'

export class DeliveryRepository extends BaseRepository<DeliveryDocument> {
	constructor() {
		super(Delivery)
	}
}
