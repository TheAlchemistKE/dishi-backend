import { Types } from 'mongoose'
import { BaseRepository } from '../base'
import { Vendor, type VendorDocument } from '../models'

export class VendorRepository extends BaseRepository<VendorDocument> {
	constructor() {
		super(Vendor)
	}

	async fetchByEmail(email?: string): Promise<VendorDocument | object> {
		try {
			if (email !== undefined) {
				const result = await Vendor.findOne({ email: email })
				if (result !== null) {
					return result
				}
			}
			return {
				message: `Vendor was not found`,
				status: 'error'
			}
		} catch (error) {
			throw new Error(String(error))
		}
	}

	async fetchVendor(id?: Types.ObjectId, email?: string): Promise<any> {
		if (email !== '') {
			return this.fetchByEmail(email)
		} else {
			return this.findOne(id)
		}
	}
}
