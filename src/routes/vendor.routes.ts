import express from 'express'
import {
  AddFood,
  CreateVendor,
  FetchAllVendors,
  FetchVendorByEmail,
  FetchVendorById
} from '../api/controllers'
import { Authenticate } from '../api/middlewares'

const router = express.Router()

router.post('/', CreateVendor)
router.get('/', FetchAllVendors)
router.get('/:id', FetchVendorById)
router.get('/email', FetchVendorByEmail)
router.use(Authenticate)
router.post('/foods', AddFood)
export { router as VendorRouter }
