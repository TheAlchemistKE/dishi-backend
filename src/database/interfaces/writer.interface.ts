import { type Types } from 'mongoose'
export interface IWriter<T> {
  create: (item: T) => Promise<T>
  update: (id: Types.ObjectId, item: Partial<T>) => Promise<T | null>
  delete: (id: Types.ObjectId) => Promise<boolean>
}
