import express, { Request, Response, NextFunction } from 'express'
import { CreateVendor } from '../controllers'

const router = express.Router()

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  console.log('Admin routes')
})

export { router as AdminRouter }
