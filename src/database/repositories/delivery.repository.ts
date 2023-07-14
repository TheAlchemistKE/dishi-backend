import { BaseRepository } from '../base'
import { Delivery, DeliveryDocument } from '../models'

export class DeliveryRepository extends BaseRepository<DeliveryDocument> {
	constructor() {
		super(Delivery)
	}
}
