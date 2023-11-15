const express = require('express')
const router = express.Router()
const donationModel = require('../models/donationModel') // Import the follow model


router.post('/submit', async (req, res) => {
  const data = req.body;
  console.log("data");
  console.log(data); // req.body

  if (!data) {
    return res.status(400).json({ error: 'Invalid data' });
  }
  console.log("email");
  console.log(req.session.user.email);
  console.log("req.body.test");
  console.log(req.body.test);
  const donor = req.session.user.email;
  const cid = req.body.test;


  if (!donor || !cid) {
    console.error('Invalid donor or cid value');
    // Handle the error or return an error response
  }
});


module.exports = router