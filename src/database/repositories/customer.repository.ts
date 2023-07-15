import { Customer, type CustomerDocument } from '../models'
import { BaseRepository } from '../base'
export class CustomerRepository extends BaseRepository<CustomerDocument> {
  constructor () {
    super(Customer)
  }
}
