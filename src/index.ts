import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import {
	AdminRouter,
	AuthRouter,
	CustomerRouter,
	DeliveryRouter,
	ShoppingRoute,
	VendorRouter
} from './routes'
import { MONGO_URI } from './config'

const app = express()
app.disable('x-powered-by')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/auth', AuthRouter)
app.use('/admin', AdminRouter)
app.use('/customers', CustomerRouter)
app.use('/vendors', VendorRouter)
app.use('/deliveries', DeliveryRouter)
app.use('/shopping', ShoppingRoute)

mongoose
	.connect(MONGO_URI)
	.then(result => {
		console.log('database connected')
		console.log(result.models)
	})
	.catch(err => {
		console.error(err)
	})

app.listen(process.env.PORT || 8000, () => {
	console.log(`listening on port ${process.env.PORT}`)
})
