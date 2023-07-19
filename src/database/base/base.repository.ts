import { type Types, type Model } from 'mongoose'
import {
	type IReader,
	type IWriter,
	type PaginationOptions
} from '../interfaces'

export class BaseRepository<T> implements IWriter<T>, IReader<T> {
	protected readonly _model: Model<T>

	constructor(model: Model<T>) {
		this._model = model
	}

	async create(item: any): Promise<T> {
		return this._model.create(item)
	}

	async update(id: Types.ObjectId, item: Partial<T>): Promise<T | null> {
		return this._model.findByIdAndUpdate(id, item, { new: true }).exec()
	}

	async delete(id: Types.ObjectId): Promise<boolean> {
		const result = await this._model.deleteOne({ _id: id }).exec()
		return result.deletedCount !== undefined && result.deletedCount > 0
	}

	async find(options?: PaginationOptions): Promise<T[]> {
		const { page = 1, limit = 10 } = options as PaginationOptions
		const skip: number = (page - 1) * limit

		return this._model.find().skip(skip).limit(limit).exec()
	}

	async findOne(id?: Types.ObjectId): Promise<T | null> {
		return this._model.findById(id)
	}
}
