import express, { Request, Response, NextFunction } from 'express'
import { CreateVendor, FetchAllVendors, FetchVendorByEmail, FetchVendorById } from '../controllers'

const router = express.Router()

router.post('/', CreateVendor)
router.get('/', FetchAllVendors)
router.get('/:id', FetchVendorById)
router.get('/email', FetchVendorByEmail)
export { router as VendorRouter }

