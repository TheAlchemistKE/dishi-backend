import { AuthPayload } from '../../api/dto'
import { BaseRepository } from '../base'
import { Offer, type OfferDocument } from '../models'

export class OfferRepository extends BaseRepository<OfferDocument> {
	constructor() {
		super(Offer)
	}

	async getCurrentOffers(user: AuthPayload): Promise<any[]> {
		const current_offer: any[] = []
		const offers = await Offer.find().populate('vendors')
	
		if (offers) {
			offers.forEach(item => {
				if (item.vendors) {
					item.vendors.forEach(vendor => {
						if (vendor._id.toString() === user._id) {
							current_offer.push(item)
						}
					})
				}
	
				if (item.offer_type === 'GENERIC') {
					current_offer.push(item)
				}
			})
		}
	
		return current_offer
	}
}
