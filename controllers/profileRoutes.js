const express = require('express')
const router = express.Router()
const profileModel = require('../models/profileModel.js')
const multer = require('multer')
const fs = require('fs')
// const upload = multer({ dest: 'uploads/' }); // Specify the destination directory for uploaded files
const path = require('path')

const upload = multer({
 storage: multer.diskStorage({
  destination: 'uploads',
  filename: (req, file, cb) => {
   const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
   const originalname = file.originalname
   const filenameWithoutExtension = originalname.replace(/\.[^/.]+$/, '') // Remove file extension
   const fileExtension = originalname.split('.').pop() // Get file extension
   const uniqueFilename = `${filenameWithoutExtension}-${uniqueSuffix}.${fileExtension}`
   cb(null, uniqueFilename)
  },
 }),
})

router.post(
 '/submit',
 [
  upload.fields([
   { name: 'file1', maxCount: 1 },
  ]),
 ],
 async (req, res) => {
  // res.send("Hello World");
  console.log(req.body)
  console.log(req.files)
  try {
   const {
    new_email,
    name,
    bio_description
   } = req.body
   console.log(new_email, name, bio_description)

   const email = req.session.user.email
   var profile_img;

   if (req.files.file1 === undefined) {
    profile_img = null
   }
   else {
    profile_img = req.files.file1[0].filename
   }



   console.log('profile_img', profile_img)
   
   const updateProfileResult = await profileModel.updateProfile(
    req,
    email,
    new_email,
    name,
    profile_img,
    bio_description)

   if (updateProfileResult) {
    console.log('updateProfileResult', updateProfileResult)
    res.redirect('/')
   }
  } catch (error) {
   console.log(error)
   res.status(500).render('error-page', { error }) // Render error view on failure
  }
 }
)

router.post('/delete', async (req, res) => {
 const {cid}=req.body
 const deleteCampaignResult = await profileModel.deleteCampaign(cid)
 if (deleteCampaignResult) {
  console.log('deleteCampaignResult', deleteCampaignResult)
  res.redirect('/MyCampaigns')
 }
}
)

router.get('/edit/prelaunch/:campaignId', async (req, res) => {
 const campaignId = req.params.campaignId
 const campaign = await profileModel.editPrelaunchById(campaignId)
 if (campaign) {
  console.log('campaign', campaign)
  res.redirect('/prelaunch')
 }
})

router.post('/report/:campaignId', [
 upload.fields([
  { name: 'file1', maxCount: 1 },
 ]),
], async (req, res) => {
 const campaignId = req.params.campaignId
 const { title, description } = req.body
 const email = req.session.user.email
 var evidence;

 if (req.files.file1 === undefined) {
  evidence = null
 }
 else {
  evidence = req.files.file1[0].filename
 }
 const reportResult = await profileModel.InsertReport(campaignId, email, title, description, evidence)
 if (reportResult) {
  console.log('reportResult', reportResult)
  res.redirect('/accepted-report')
 }
}

)


module.exports = router
