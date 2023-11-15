const adminModel = require('../models/adminModel')
const userModel = require('../models/userModel')
const authController = require('./authController')
const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcrypt')


router.post('/deleteUser/:userEmail', async (req, res) => {

 const email = req.params.userEmail
 try {
  await adminModel.deleteUser(email);
  res.redirect('/users');

 } catch (error) {
  console.error('Error deleting user:', error);
  res.render('error-page', { error })
 }
})

router.post('/declineCampaign/:campaignId', async (req, res) => {
 const id = req.params.campaignId
 console.log(id)
 try {
  const affectedRows = await adminModel.declineCampaign(id);
  console.log(affectedRows);

  res.redirect('/UnapprovedCampaigns');

 } catch (error) {
  console.error('Error declining campaign:', error);

 }
})

router.post('/approveCampaign/:campaignId', async (req, res) => {
 const id = req.params.campaignId
 console.log(id)
 try {
  const affectedRows = await adminModel.approveCampaign(id);
  console.log(affectedRows);
  // const campaigns = await adminModel.getNotApprovedCampaigns();
  res.redirect('/UnapprovedCampaigns');


 } catch (error) {
  console.error('Error declining campaign:', error);
 }
})

module.exports = router