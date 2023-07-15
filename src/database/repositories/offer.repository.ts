import { BaseRepository } from '../base'
import { Offer, type OfferDocument } from '../models'

export class OfferRepository extends BaseRepository<OfferDocument> {
	constructor() {
		super(Offer)
	}
}
