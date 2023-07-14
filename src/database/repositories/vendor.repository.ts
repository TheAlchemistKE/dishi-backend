import { BaseRepository } from '../base'
import { Vendor, VendorDocument } from '../models'

export class VendorRepository extends BaseRepository<VendorDocument> {
	constructor() {
		super(Vendor)
	}
}
