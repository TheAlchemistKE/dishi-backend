import express from 'express'
import { CreateCustomer, FetchAllCustomers } from '../controllers'
import { Authenticate } from '../middlewares'

const router = express.Router()

router.use(Authenticate)

router.post('/', CreateCustomer)
router.get('/', FetchAllCustomers)

export { router as CustomerRouter }
