import { type Types } from 'mongoose'

export interface PaginationOptions {
	page?: number
	limit?: number
}
export interface IReader<T> {
	find: (options?: PaginationOptions) => Promise<T[]>
	findOne: (id?: Types.ObjectId) => Promise<T | null>
}
