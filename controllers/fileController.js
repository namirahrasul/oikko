const express = require('express')
const router = express.Router()
const fileModel = require('../models/fileModel.js')
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

// Handle form submission
router.post(
  '/submit',
  [
    upload.fields([
      { name: 'file1', maxCount: 1 },
      { name: 'file2', maxCount: 1 },
      { name: 'file3', maxCount: 1 },
      { name: 'file4', maxCount: 1 },
      { name: 'file5', maxCount: 1 },
    ]),
  ],
  (req, res) => {
    // res.send("Hello World");
    console.log(req.body)
    console.log(req.files)

    const {
      title,
      city,
      state,
      type,
      description,
      campaign_video,
      goal_amount,
      goal_date,
      bsb,
      account,
      bkash,
      rocket,
      nagad,
      upay,
      perk_title,
      perk_description,
      perk_price,
      perk_retail_price,
      perk_date,
    } = req.body

    // Access uploaded files
    const campaign_img = req.files.file1[0].filename
    const perk_img = req.files.file2[0].filename
    const nid_front = req.files.file3[0].filename
    const nid_back = req.files.file4[0].filename
    const passport = req.files.file5[0].filename

    // const imagePath = req.file.path
    // Insert the data into the MySQL table
    fileModel.insertUserWithUniqueImagePath(
      req,
      title,
      city,
      state,
      type,
      description,
      campaign_img,
      campaign_video,
      goal_amount,
      goal_date,
      bsb,
      account,
      bkash,
      rocket,
      nagad,
      upay,
      perk_title,
      perk_description,
      perk_img,
      perk_price,
      perk_retail_price,
      perk_date,
      nid_front,
      nid_back,
      passport,
      (err, result) => {
        if (err) {
          console.error('Error inserting data:', err)
          res.status(500).send('Error submitting the form.')
          console.log('error submitting the form')
          return
        }

        console.log('Data inserted successfully:', result)
        res.render('home', { user: req.session.user })
      }
    )
  }
)
// Handle form submission
router.post(
  '/prelaunch-submit',
  [
    upload.fields([
      { name: 'file1', maxCount: 1 },
      { name: 'file2', maxCount: 1 },
      // { name: 'file3', maxCount: 1 },
      // { name: 'file4', maxCount: 1 },
      // { name: 'file5', maxCount: 1 },
    ]),
  ],
  (req, res) => {
    // res.send("Hello World");
    console.log(req.body)
    console.log(req.files)

    const {
      title,
      city,
      state,
      type,
      description,
      prelaunch_video,
      feature,
      fb_url,
      twitter_url,
      yt_url,
      website_url,
    } = req.body
    const email = req.session.user.email
    // Access uploaded files
    const prelaunch_img = req.files.file1[0].filename
    const feature_img = req.files.file2[0].filename
    // const nid_front = req.files.file3[0].filename
    // const nid_back = req.files.file4[0].filename
    // const passport = req.files.file5[0].filename

    // const imagePath = req.file.path
    // Insert the data into the MySQL table
    console.log('req.body', req.body)
    fileModel.insertPrelaunch(
      req,
      email,
      title,
      city,
      state,
      type,
      description,
      prelaunch_img,
      prelaunch_video,
      feature,
      feature_img,
      fb_url,
      twitter_url,
      yt_url,
      website_url,
      (err, result) => {
        if (err) {
          console.error('Error inserting data:', err)
          res.status(500).send('Error submitting the form.')
          console.log('error submitting the form')
          return
        }

        console.log('Data inserted successfully:', result)
        res.render('home', { user: req.session.user })
      }
    )
    // res.redirect('/');
  }
)
// Handle form submission
router.post(
  '/submit2',
  [
    upload.fields([
      { name: 'file1', maxCount: 1 },
      { name: 'file2', maxCount: 1 },
      { name: 'file3', maxCount: 1 },
      { name: 'file4', maxCount: 1 },
      { name: 'file5', maxCount: 1 },
      { name: 'file6', maxCount: 1 },
      { name: 'file7', maxCount: 1 },
      { name: 'file8', maxCount: 1 },
      { name: 'file9', maxCount: 1 },
      { name: 'file10', maxCount: 1 },
      { name: 'file11', maxCount: 1 },
      { name: 'file12', maxCount: 1 },
      { name: 'file13', maxCount: 1 },
      { name: 'file14', maxCount: 1 },
      { name: 'file15', maxCount: 1 },
    ]),
  ],
  (req, res) => {
    // res.send("Hello World");
    console.log(req.body)
    console.log(req.files)

    const {
      title,
      city,
      state,
      type,
      tagline,
      description,
      campaign_video,
      feature,
      goal_amount,
      goal_date,
      bsb,
      account,
      bkash,
      rocket,
      nagad,
      upay,
      perk_title,
      perk_description,
      perk_price,
      perk_retail_price,
      perk_date,
    } = req.body
    const email = req.session.user.email
    // Access uploaded files
    const campaign_img = req.files.file1[0].filename
    const feature_img = req.files.file2[0].filename
    const perk_img = req.files.file3[0].filename
    const nid_front = req.files.file4[0].filename
    const nid_back = req.files.file5[0].filename
    const passport = req.files.file6[0].filename
    const business_plan = req.files.file7[0].filename
    const project_budget = req.files.file8[0].filename
    const product_prototype = req.files.file9[0].filename
    const legal_entity_verification = req.files.file10[0].filename
    const financial_statements = req.files.file11[0].filename
    const intellectual_property = req.files.file12[0].filename
    const permits = req.files.file13[0].filename
    const contracts = req.files.file14[0].filename
    const extras = req.files.file15[0].filename
    // const imagePath = req.file.path
    // Insert the data into the MySQL table
    fileModel.insertBusinessCampaign(
      req,
      email,
      title,
      city,
      state,
      type,
      tagline,
      description,
      campaign_img,
      campaign_video,
      feature,
      feature_img,
      goal_amount,
      goal_date,
      bsb,
      account,
      bkash,
      rocket,
      nagad,
      upay,
      perk_title,
      perk_description,
      perk_img,
      perk_price,
      perk_retail_price,
      perk_date,
      nid_front,
      nid_back,
      passport,
      business_plan,
      project_budget,
      product_prototype,
      legal_entity_verification,
      financial_statements,
      intellectual_property,
      permits,
      contracts,
      extras,
      (err, result) => {
        if (err) {
          console.error('Error inserting data:', err)
          res.status(500).send('Error submitting the form.')
          console.log('error submitting the form')
          return
        }

        console.log('Data inserted successfully:', result)
        res.render('home', { user: req.session.user })
      }
    )
    // res.redirect('/')
  }
)
module.exports = router
