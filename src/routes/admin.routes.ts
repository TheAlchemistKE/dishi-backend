import express, {
  type Request,
  type Response,
  type NextFunction
} from 'express'

const router = express.Router()

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  console.log('Admin routes')
})

export { router as AdminRouter }
