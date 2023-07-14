import express from 'express'
import { CreateCustomer, FetchAllCustomers } from '../api/controllers'
import { Authenticate } from '../api/middlewares'

const router = express.Router()

router.use(Authenticate)

router.post('/', CreateCustomer)
router.get('/', FetchAllCustomers)

export { router as CustomerRouter }
