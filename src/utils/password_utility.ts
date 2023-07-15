import bcrypt from 'bcrypt'
import { type Request } from 'express'
import jwt from 'jsonwebtoken'
import { type VendorPayload } from '../api/dto'
import { JWT_SECRET } from '../config'
import { type AuthPayload } from '../api/dto/auth.dto'

export const GenerateSalt = async (): Promise<string> => {
	return bcrypt.genSalt()
}

export const GeneratePassword = async (
	password: string,
	salt: string
): Promise<string> => {
	return bcrypt.hash(password, salt)
}

export const ValidatePassword = async (
	enteredPassword: string,
	savedPassword: string,
	salt: string
): Promise<boolean> => {
	return (await GeneratePassword(enteredPassword, salt)) === savedPassword
}

export const GenerateSignature = (payload: VendorPayload): string => {
	return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' })
}

export const ValidateSignature = (req: Request): boolean => {
	const signature = req.get('Authorization') as string
	if (signature !== null) {
		const payload = jwt.verify(
			signature.split(' ')[1],
			JWT_SECRET
		) as AuthPayload
		req.user = payload

		return true
	}

	return false
}
