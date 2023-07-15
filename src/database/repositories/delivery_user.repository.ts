import { BaseRepository } from '../base'
import { type DelivererDocument, DeliveryUser } from '../models'

export class DelivererRepository extends BaseRepository<DelivererDocument> {
	constructor() {
		super(DeliveryUser)
	}
}
