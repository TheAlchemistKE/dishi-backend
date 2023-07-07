import bcrypt from 'bcrypt'
import { Request } from 'express'
import jwt from 'jsonwebtoken'
import { VendorPayload } from '../dto'
import { JWT_SECRET } from '../config'
import { AuthPayload } from '../dto/auth.dto'

export const GenerateSalt = async () => {
  return await bcrypt.genSalt()
}

export const GeneratePassword = async (password: string, salt: string) => {
  return await bcrypt.hash(password, salt)
}

export const ValidatePassword = async (
  entered_password: string,
  saved_password: string | any,
  salt: string | any,
) => {
  return (await GeneratePassword(entered_password, salt)) === saved_password
}

export const GenerateSignature = async (payload: VendorPayload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' })
}

export const ValidateSignature = async (req: Request) => {
  const signature = <string>req.get('Authorization')
  if (signature) {
    const payload = (await jwt.verify(
      signature.split(' ')[1],
      JWT_SECRET,
    )) as AuthPayload
    req.user = payload

    return true
  }

  return false
}
