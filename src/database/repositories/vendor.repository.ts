import { BaseRepository } from '../base'
import { Vendor, type VendorDocument } from '../models'

export class VendorRepository extends BaseRepository<VendorDocument> {
  constructor () {
    super(Vendor)
  }
}
