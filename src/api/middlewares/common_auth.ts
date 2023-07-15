import { type Request, type Response, type NextFunction } from 'express'
import { type AuthPayload } from '../dto'
import { ValidateSignature } from '../../utils'

declare global {
	namespace Express {
		interface Request {
			user?: AuthPayload
		}
	}
}

export const Authenticate = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const signature = ValidateSignature(req)
	if (signature) {
		next()
	} else {
		return res.json({ message: 'User Not authorised' })
	}
}
