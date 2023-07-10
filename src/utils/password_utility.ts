import bcrypt from 'bcrypt'
import { type Request } from 'express'
import jwt from 'jsonwebtoken'
import { type VendorPayload } from '../dto'
import { JWT_SECRET } from '../config'
import { type AuthPayload } from '../dto/auth.dto'

export const GenerateSalt = async (): Promise<string> => {
  return await bcrypt.genSalt()
}

export const GeneratePassword = async (password: string, salt: string): Promise<string> => {
  return await bcrypt.hash(password, salt)
}

export const ValidatePassword = async (
  enteredPassword: string,
  savedPassword: string | any,
  salt: string | any
): Promise<boolean> => {
  return (await GeneratePassword(enteredPassword, salt)) === savedPassword
}

export const GenerateSignature = async (payload: VendorPayload): Promise<string> => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' })
}

export const ValidateSignature = async (req: Request): Promise<boolean> => {
  const signature = req.get('Authorization') as string
  if (signature !== null) {
    const payload = (jwt.verify(
      signature.split(' ')[1],
      JWT_SECRET
    )) as AuthPayload
    req.user = payload

    return true
  }

  return false
}
