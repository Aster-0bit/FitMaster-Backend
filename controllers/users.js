import { validateUser, validatePartialUser } from '../schemas/users.js'
import { sendResetPasswordEmail } from '../middlewares/auth.js'
import jwt from 'jsonwebtoken'

export class UserController {
  constructor({ userModel }) {
    this.userModel = userModel
  }

  getAll = async (req, res) => {
    const users = await this.userModel.getAll()
    res.json(users)
  }

  create = async (req, res) => {
    const result = validateUser(req.body)

    if(!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message)})
    }

    try {
      const newUser = await this.userModel.create({ input: result.data })

      res.status(201).json(newUser);
    } catch (e) {
      if (e.message.includes("ER_DUP_ENTRY")) {
        return res.status(409).json({ error: "Email already exists." });
      } else {
          res.status(500).json({ error: "Internal Server Error. Please try again later." });
      }
    }
  }

  getUserByID = async (req, res) => {
    console.log(req.user)
    const userId = req.user.id

    try{
      const user = await this.userModel.getUserById({ id: userId })
      if (!user) {
        return res.status(404).json({"message": "Invalid session, pleasy try again later."})
      }
      res.json(user)
    }catch(e){
      console.error("Error fetching user:", e);
      res.status(500).json({ error: "Internal Server Error. Please try again later." })
    }
  }

  getFavoritesById = async (req, res) => {
    const userId = req.user.id

    try{
      const user = await this.userModel.getFavoritesById({ id: userId })
      console.log(user)
      if (!user) {
        return res.status(404).json({"message": "Not Favourites found"})
      }
      res.json(user)
    }catch(e){

      res.status(500).json({ error: "Internal Server Error. Please try again later." })
    }
  }

  updateUser = async (req, res) => {

    const result = validatePartialUser(req.body)

    if(!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message)})
    }

    console.log('Me llego: ' + req.user.id)
    const user = await this.userModel.updateUser({input: {...result.data, id: req.user.id}})

    if (user.error) {
      return res.status(404).json({ error: user.error })
    }
    console.log(JSON.stringify(user))
    res.status(200).json({ ...user})
  }

  getRoutineByDay = async (req, res) => {
    try {
      const routine = await this.userModel.getRoutine( { day_id: req.params.day, user_id: req.user.id } )
      
      res.json(routine)

    }catch(e) {
      res.status(500).json({ error: "Something went wrong. Please try again later." })
    }
  }

  forgotPassword = async (req, res) => {
    const { email } = req.body

    try {
      const result = await this.userModel.findByEmail({ email })
      
      if (!result) {
        return res.status(404).json({ message: "Check your email for further instructions." })
      }

      const token = jwt.sign({ id: result.user_id, email: result.email }, process.env.REFRESH_SECRET, { expiresIn: '15m' })

      await sendResetPasswordEmail({ email, token })
      res.status(200).json({ message: "Reset password email sent successfully." })  
    }catch(e) {
      res.status(500).json({ error: "Internal Server Error. Please try again later." })
    }
  }

  resetPassword = async (req, res) => {
    const { password } = req.body
    const token = req.params.token

    try {
      const decoded = jwt.verify(token, process.env.REFRESH_SECRET)
      const result = await this.userModel.resetPassword({ input: { id: decoded.id, password }})

      if (!result) {
        return res.status(404).json({ message: "Invalid session. Please try again later." })
      }

      res.status(200).json({ message: "Password reset successfully." })
    }catch(e) {
      res.status(500).json({ error: "Internal Server Error. Please try again later." })
    }
  }
}