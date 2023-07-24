import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import path from 'path'
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
const imagePath = path.join(__dirname, '../images')
app.use('/images', express.static(imagePath))

const routers = [
	{ url: '/auth', router: AuthRouter },
	{ url: '/admin', router: AdminRouter },
	{ url: '/customers', router: CustomerRouter },
	{ url: '/vendors', router: VendorRouter },
	{ url: '/deliveries', router: DeliveryRouter },
	{ url: '/shopping', router: ShoppingRoute }
]

routers.forEach(({ url, router }) => {
	app.use(url, router)
})

mongoose
	.connect(MONGO_URI)
	.then(result => {
		console.log('database connected')
		console.log(result.models)
	})
	.catch(err => {
		console.error(err)
	})

const PORT = process.env.PORT || 8082

app.listen(PORT, () => {
	console.log(`listening on port ${PORT}`)
})
