import express, { Request, RequestHandler } from 'express'
import multer from 'multer'
import {
	AddFood,
	CreateOffer,
	CreateVendor,
	EditOffer,
	FetchAllVendors,
	FetchVendorByEmail,
	FetchVendorById,
	GetCurrentOrders,
	GetFoods,
	GetOffers,
	GetOrderDetails,
	ProcessOrder,
	UpdateVendorAvailability,
	UpdateVendorCoverImage,
	UpdateVendorProfile
} from '../api/controllers'
import { Authenticate } from '../api/middlewares'

const router = express.Router()

const MAX_SIZE = 1048576
const image_storage = multer.diskStorage({
	destination: (req: Request, res: Express.Multer.File, cb) => {
		cb(null, 'images')
	},
	filename(req: Request, file: Express.Multer.File, callback) {
		callback(
			null,
			new Date().toISOString() + '_' + String(file.originalname)
		)
	}
})

const images: RequestHandler = multer({
	storage: image_storage,
	limits: {
		fileSize: MAX_SIZE
	}
}).array('images', 10)

router.post('/', CreateVendor)
router.get('/', FetchAllVendors)
router.get('/:id', FetchVendorById)
router.get('/email', FetchVendorByEmail)
router.use(Authenticate)
router.post('/foods', AddFood)
router.post('/cover-image', images, UpdateVendorCoverImage)
router.patch('/profile', UpdateVendorProfile)
router.patch('/service', UpdateVendorAvailability)

router.post('/food', images, AddFood)
router.get('/food', GetFoods)

router.get('/orders', GetCurrentOrders)
router.put('/order/:id/process', ProcessOrder)
router.get('/order/:id', GetOrderDetails)

//Offers
router.get('/offers', GetOffers)
router.post('/offer', CreateOffer)
router.put('/offer/:id', EditOffer)
export { router as VendorRouter }
