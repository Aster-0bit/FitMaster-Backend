import express, { json } from 'express'
import { createUserRouter } from './routes/users.js'
import { corsMiddleware } from './middlewares/cors.js'
import 'dotenv/config'

export const createApp = ( { userModel} ) => {
    const app = express()
    app.use(json())
    app.use(corsMiddleware())
    app.disable('x-powered-by')

    app.use('/users', createUserRouter({ userModel }))

    const PORT = process.env.PORT

    app.listen(PORT)
}