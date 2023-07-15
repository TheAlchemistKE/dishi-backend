import express from 'express'
import multer from 'multer'
import {
	AddFood,
	CreateVendor,
	FetchAllVendors,
	FetchVendorByEmail,
	FetchVendorById
} from '../api/controllers'
import { Authenticate } from '../api/middlewares'

const router = express.Router()
const image_storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'images')
	},
	filename: function (req, file, cb) {
		cb(null, new Date().toISOString() + '_' + file.originalname)
	}
})

const images = multer({ storage: image_storage }).array('images', 10)

router.post('/', CreateVendor)
router.get('/', FetchAllVendors)
router.get('/:id', FetchVendorById)
router.get('/email', FetchVendorByEmail)
router.use(Authenticate)
router.post('/foods', AddFood)
export { router as VendorRouter }
