const adminModel = require('../models/adminModel')
const userModel = require('../models/userModel')
const authController = require('./authController')
const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcrypt')




router.post('/declineCampaign/:campaignId', async (req, res) => {
 const id = req.params.campaignId
 console.log(id)
 try {
    const email = await adminModel.getCampaignEmailById(id);
    console.log(email);

  const affectedRows = await adminModel.declineCampaign(id);
  console.log(affectedRows);

    const result = await adminModel.insertRejectData(email,id);
    console.log(result);

  res.redirect('/UnapprovedCampaigns');

 } catch (error) {
  console.error('Error declining campaign:', error);

 }
})

router.post('/approveCampaign/:campaignId', async (req, res) => {
 const id = req.params.campaignId
 console.log(id)
 try {
  // Get the campaign title and creator email using the campaign ID
  const email = await adminModel.getCampaignEmailById(id);
  console.log(email);

  const affectedRows = await adminModel.approveCampaign(id);
  console.log(affectedRows);

  const result = await adminModel.insertApproveData(email, id);
  console.log(result);

  res.redirect('/UnapprovedCampaigns');

 } catch (error) {
  console.error('Error declining campaign:', error);
 }
})

router.post('/review/:rId', async (req, res) => {
 const id = req.params.rId
 console.log(id)
 try {
  const email = req.session.user.email;
  const affectedRows = await adminModel.markCampaignReviewed(id,email);
  console.log(affectedRows);
  // const campaigns = await adminModel.getNotApprovedCampaigns();
  res.redirect('/reported-campaigns');


 } catch (error) {
  console.error('Error declining campaign:', error);
 }
})

router.post('/decline-delete/:campaignId', async (req, res) => {
 const id = req.params.campaignId
 console.log(id)
 try {
  const affectedRows = await adminModel.declineDelete(id);
  console.log(affectedRows);

  res.redirect('/delete-requests');

 } catch (error) {
  console.error('Error declining campaign:', error);

 }
})

router.post('/approve-delete/:campaignId', async (req, res) => {
 const id = req.params.campaignId
 console.log(id)
 try {
  const affectedRows = await adminModel.approveDelete(id);
  console.log(affectedRows);
  // const campaigns = await adminModel.getNotApprovedCampaigns();
  res.redirect('/delete-requests');

 } catch (error) {
  console.error('Error declining campaign:', error);
 }
})

router.post('/decline-edit/:campaignId', async (req, res) => {
 const id = req.params.campaignId
 console.log(id)
 try {
  const affectedRows = await adminModel.declineEdit(id);
  console.log(affectedRows);

  res.redirect('/edit-requests');

 } catch (error) {
  console.error('Error declining campaign:', error);

 }
})

router.post('/approve-edit/:campaignId', async (req, res) => {
 const id = req.params.campaignId
 console.log(id)
 try {
  const affectedRows = await adminModel.approveEdit(id);
  console.log(affectedRows);
  // const campaigns = await adminModel.getNotApprovedCampaigns();
  res.redirect('/edit-requests');


 } catch (error) {
  console.error('Error declining campaign:', error);
 }
})

module.exports = router