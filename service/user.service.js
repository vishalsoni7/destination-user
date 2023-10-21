const User = require('../model/user')

const signUp = async (userDetails) => {
  try {
    const user = new User(userDetails)

    const allDetails = user.email && user.password && user.profilePic && user.userName && user.phoneNumber

    if (allDetails) {
      const newUser = await user.save()
      console.log(`${newUser.userName} signup successfully.`);
      return newUser
    } else {
      console.log('Fill all details!')
    }
  } catch (error) {
    console.error('Error while signing', error)
  }
}

const signIn = async (email, password) => {
  console.log('Signin started')

  try {
    const letUserIn = await User.findOne({ email: email });

    if (letUserIn && letUserIn.password === password) {
      console.log(`${letUserIn.userName} signin successfully.`);
      return letUserIn
    } else {
      console.log('No user found or Wrong password!')
    }
  } catch (error) {
    console.error('Error while signing', error)
  }
}

module.exports = { signUp, signIn }