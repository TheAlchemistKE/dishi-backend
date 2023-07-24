import { Types } from 'mongoose'
import { BaseRepository } from '../base'
import { Vendor, type VendorDocument } from '../models'

export class VendorRepository extends BaseRepository<VendorDocument> {
	constructor() {
		super(Vendor)
	}

	fetchByEmail(email: string): VendorDocument {
		try {
			const result = Vendor.findOne({
				email: email
			}) as unknown as VendorDocument
			return result
		} catch (error) {
			throw new Error(String(error))
		}
	}

	async fetchVendor(id: Types.ObjectId, email: string): Promise<any> {
		if (email !== '') {
			return this.fetchByEmail(email)
		} else {
			return this.findOne(id)
		}
	}
}
