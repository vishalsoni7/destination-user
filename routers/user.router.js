const express = require('express');
const userRouter = express.Router();

const { signIn, signUp } = require('../service/user.service');

userRouter.use(express.json());

userRouter.post('/signup', async (req, res) => {
  try {
    const savedUser = await signUp(req.body)

    if (savedUser) {
      res.status(200).json(savedUser)
    } else {
      res.status(401).json({ message: 'fill all details!' })
    }
  } catch (error) {
    res.status(500).json({ message: 'could not signup', error })
  }
})

userRouter.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await signIn(email, password)

    if (user) {
      res.status(200).json(user)
    } else {
      res.status(401).json({ error: 'Invalid credentials!' })
    }
  } catch (error) {
    res.status(500).json({ message: 'could not signin', error })
  }
})

module.exports = userRouter