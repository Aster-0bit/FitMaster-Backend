import express, { json } from 'express'
import { createUserRouter } from './routes/users.js'
import { createLoginRouter } from './routes/login.js'
import { corsMiddleware } from './middlewares/cors.js'
import { UserModel } from './models/user.js'  // Importar UserModel directamente
import 'dotenv/config'

const app = express()
app.use(json())
app.use(corsMiddleware())
app.disable('x-powered-by')

// Configurar la ruta /users con el modelo importado
app.use('/user', createUserRouter({ userModel: UserModel }))
app.use('/login', createLoginRouter({ userModel: UserModel }))
app.get('/', (req, res) => {
  res.send('Welcome to FitMaster API')
})

const PORT = process.env.PORT || 3000  // Añadir un puerto por defecto para desarrollo

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`) // Mensaje opcional para confirmar que el servidor se ha iniciado
});
