import express from 'express'
import {
  UpdateVendorProfile,
  VendorLogin,
  VendorProfile
} from '../api/controllers'
import { Authenticate } from '../api/middlewares'

const router = express.Router()

router.post('/login', VendorLogin)

router.use(Authenticate)
router.get('/profile', VendorProfile)
router.patch('/profile', UpdateVendorProfile)

export { router as AuthRouter }
