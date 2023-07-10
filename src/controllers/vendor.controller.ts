import { type Request, type Response, type NextFunction } from 'express'
import { type CreateFoodDto, type CreateVendorDto } from '../dto'
import { Vendor } from '../models'
import { GeneratePassword, GenerateSalt } from '../utils'
import { Food } from '../models/food.model'

export const FetchVendor = async (id: string | undefined, email?: string) => {
  if (email) {
    return await Vendor.findOne({ email })
  } else {
    return await Vendor.findById(id)
  }
}

export const CreateVendor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    name,
    owner_name,
    food_type,
    pincode,
    address,
    phone,
    email,
    password
  } = req.body as CreateVendorDto

  const existing_vendor = await FetchVendor('', email)

  if (existing_vendor !== null) {
    return res.json({
      status: 'error',
      message: `Vendor with email ${existing_vendor.email} already exists`
    })
  }

  const salt = await GenerateSalt()
  const hash = await GeneratePassword(password, salt)

  const created_vendor = await Vendor.create({
    name,
    owner_name,
    food_type,
    pincode,
    address,
    phone,
    email,
    salt,
    service_available: false,
    cover_images: [],
    rating: 0,
    password: hash,
    foods: []
  })

  return res.json({ status: 'success', data: created_vendor })
}

export const FetchAllVendors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vendors = await Vendor.find()

  if (vendors !== null) {
    return res.json({ status: 'success', data: vendors })
  }

  return res.json({ status: 'info', data: 'Vendors not found' })
}

export const FetchVendorById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const vendor_id = req.params.id

  const vendor = await FetchVendor(vendor_id, '')
  if (vendor === null) {
    res.json({ status: 'error', message: 'vendor does not exist' })
  }

  return res.json({
    status: 'success',
    data: vendor
  })
}

export const FetchVendorByEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body

  const vendor = await FetchVendor('', String(email))

  if (vendor === null) {
    return res.json({ status: 'error', message: 'vendor does not exist' })
  }

  return res.json({ status: 'success', data: vendor })
}

export const AddFood = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user

  const { name, description, category, food_type, ready_time, price } =
    req.body as CreateFoodDto

  const created_food = await Food.create({
    name,
    description,
    category,
    food_type,
    ready_time,
    price,
    vendor_id: user?._id
  })

  return res.json({
    status: 'success',
    data: created_food
  })
}
