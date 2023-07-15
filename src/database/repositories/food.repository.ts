import { BaseRepository } from '../base'
import { Food, type FoodDocument } from '../models'

export class FoodRepository extends BaseRepository<FoodDocument> {
  constructor () {
    super(Food)
  }
}
