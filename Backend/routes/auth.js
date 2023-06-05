const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');


const JWT_SECRET = 'Saurabhisagoodb$oy';

// ROUTE-1: create a user using: POST " api/auth/createuser". - no login required
router.post('/createuser', [
   body('name', 'enter a valid name').isLength({ min: 3 }),
   body('email', 'enter a valid name').isEmail(),
   body('password', 'password must be atleast 5 characters').isLength({ min: 5 })
], async (req, res) => {

   const result = validationResult(req);
   let success = false;

   // if there are no errors
   if (result.isEmpty()) {
      //   check weather the user is exists
      try {
         let user = await User.findOne({success, email: req.body.email });


         if (user) {
            return res.status(400).json({success, error: " sorry this email is already exits" })
         }
         
         const salt = await bcrypt.genSaltSync(10);
         const secPass = await bcrypt.hash(req.body.password, salt);
         // create a new user
         user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass
         });
         
         const data = {
            user: user.id
         }
         const authtoken = jwt.sign(data, JWT_SECRET);
         success = true;
         console.log(authtoken);
         return res.json({success, authtoken});
         
         // return res.json(user);
         


      } catch (error) {
         console.error(error.message);
         res.status(500).send("Internal Server Error");
      }

   }

   res.status(400).send({ errors: result.array() });



})



// ROUTE-2: authenticate a user using: POST " api/auth/login". - no login required
router.post('/login', [
   body('email', 'enter a valid name').isEmail(),
   body('password', 'password must not be blank').exists()
], async (req, res) => {
   let success = false;
   const result = validationResult(req);
   
   //  if there are no errror
   if(result.isEmpty){
      const {email, password} = req.body;
      try {
         let user = await User.findOne({email});
         if(!user){
            return res.status(400).json({success, error: "Invalid credentials"})
         }
         const passwordCompare = await bcrypt.compare(password, user.password);
         
         if(!passwordCompare){
            return res.status(400).json({success, error: "Invalid username or password"});
         }
         const data = {
            user: user.id
         }
         const authtoken = jwt.sign(data, JWT_SECRET);
         success = true;
         return res.json({success, authtoken});

      } catch (error) {
         console.error(error.message);
         res.status(500).send("Some Error Occured");
      }
   }

   // if there are error
   res.status(400).send({ errors: result.array() });
})



// ROUTE-3: get login data of a user using: POST " api/auth/getuser". - login required
router.post('/getuser', fetchuser,  async (req, res) => {

   try {
     const userId = req.user;
     const user = await User.findById(userId).select("-password")
     res.send(user)
   } catch (error) {
     console.error(error.message);
     res.status(500).send("Internal Server Error");
   }
 })
 module.exports = router