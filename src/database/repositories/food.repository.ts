import { BaseRepository } from '../base'
import { Food, FoodDocument } from '../models'

export class FoodRepository extends BaseRepository<FoodDocument> {
	constructor() {
		super(Food)
	}
}
