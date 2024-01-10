const express = require('express')
const router = express.Router()
const profileModel = require('../models/profileModel.js')
const adminModel = require('../models/adminModel.js')
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
    phone,
    bio_description
   } = req.body
   console.log(new_email, name, phone, bio_description)

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
    phone,
    profile_img,
    bio_description)

   if (updateProfileResult) {
    console.log('updateProfileResult', updateProfileResult)
    res.redirect('/MyCampaigns')
   }
  } catch (error) {
   console.log(error)
   res.status(500).render('error-page', { error }) // Render error view on failure
  }
 }
)

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
  res.redirect('/notification')
 }
}

)

router.post('/delete/:campaignId', async (req, res) => {
 const campaignId = req.params.campaignId
 const { reason } = req.body
 const email = req.session.user.email
 const deleteResult = await profileModel.InsertDelete(campaignId, email, reason);
 if (deleteResult) {
  console.log('deleteResult', deleteResult)
  res.redirect('/notification')
 }
 
}

)


module.exports = router
