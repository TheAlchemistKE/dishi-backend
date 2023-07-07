import express, { Request, Response, NextFunction } from 'express'
import { AddFood, CreateVendor, FetchAllVendors, FetchVendorByEmail, FetchVendorById } from '../controllers'
import { Authenticate } from '../middlewares'

const router = express.Router()

router.post('/', CreateVendor)
router.get('/', FetchAllVendors)
router.get('/:id', FetchVendorById)
router.get('/email', FetchVendorByEmail)
router.use(Authenticate)
router.post('/foods', AddFood)
export { router as VendorRouter }

