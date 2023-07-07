import express from 'express'
import { UpdateVendorProfile, VendorLogin, VendorProfile } from '../controllers'
import { Authenticate } from '../middlewares'

const router = express.Router()

router.post('/login', VendorLogin)

router.use(Authenticate)
router.get('/profile', VendorProfile)
router.patch('/profile', UpdateVendorProfile)

export { router as AuthRouter }
