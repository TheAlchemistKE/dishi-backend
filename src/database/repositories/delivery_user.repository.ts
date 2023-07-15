import { DeclarationWithTypeParameterChildren } from 'typescript'
import { BaseRepository } from '../base'
import { type DelivererDocument, Delivery, DeliveryUser } from '../models'

export class DelivererRepository extends BaseRepository<DelivererDocument> {
  constructor () {
    super(DeliveryUser)
  }
}
