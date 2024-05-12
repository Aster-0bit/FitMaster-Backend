import { validateUser } from '../schemas/users.js'

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

  getRoutineByDay = async (req, res) => {
    try {
      const routine = await this.userModel.getRoutine( { day_id: req.params.day, user_id: req.user.id } )
      
      res.json(routine)

    }catch(e) {
      res.status(500).json({ error: "Something went wrong. Please try again later." })
    }
  }
}