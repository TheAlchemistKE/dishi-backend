import { BaseRepository } from '../base'
import { Offer, OfferDocument } from '../models'

export class OfferRepository extends BaseRepository<OfferDocument> {
	constructor() {
		super(Offer)
	}
}
