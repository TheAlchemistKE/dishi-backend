import { Request, Response, NextFunction } from 'express'
import { AuthPayload, UpdateVendorProfileDto, VendorLoginDto } from '../dto'
import { FetchVendor } from './vendor.controller'
import { GenerateSignature, ValidatePassword } from '../utils'

export const VendorLogin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email, password } = <VendorLoginDto>req.body

  const existing_vendor = await FetchVendor('', email)

  if (existing_vendor !== null) {
    const validate = await ValidatePassword(
      password,
      existing_vendor.password,
      existing_vendor.salt,
    )

    if (validate) {
      const signature = await GenerateSignature({
        _id: String(existing_vendor._id),
        email: String(existing_vendor.email),
        address: String(existing_vendor.address),
        phone: String(existing_vendor.phone),
        name: String(existing_vendor.name),
        food_type: existing_vendor.food_type,
        rating: Number(existing_vendor.rating),
      })
      return res.json({
        status: 'success',
        token: String(signature),
      })
    } else {
      return res.json({
        status: 'error',
        message: 'Invalid Password',
      })
    }
  }

  return res.json({
    status: 'error',
    message: 'Bad credentials',
  })
}

export const VendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { _id } = <AuthPayload>req.user
  const vendor = await FetchVendor(_id, '')

  if (vendor !== null) {
    return res.json({
      status: 'success',
      user: vendor,
    })
  }

  return res.json({
    status: 'error',
    message: 'User not found',
  })
}

export const UpdateVendorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name, address, phone, food_type } = <UpdateVendorProfileDto>req.body
  const user = req.user

  if (user) {
    const existing_vendor = await FetchVendor(user._id)

    if (existing_vendor !== null) {
      existing_vendor.name = name
      existing_vendor.address = address
      existing_vendor.phone = phone
      existing_vendor.food_type = food_type

      const result = await existing_vendor.save()
      return res.json(result)
    }
    
  }
  return res.json({ message: 'Vendor profile not found' }).status(404)
}
