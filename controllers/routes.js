const express = require('express')
 const fs = require('fs')
const router = express.Router()
const authController = require('./authController') // Import the authentication controller
const fileController = require('./fileController')
const projectController = require('./projectController')// Import the file controller
const userModel = require('../models/userModel') // Import userModel functions
const fileModel = require('../models/fileModel')

const path = require('path')
// router.use("/uploads", express.static(path.join(__dirname, "../uploads")))

// Home page route
router.get('/', (req, res) => {
  res.render('home', { user: req.session.user }) // Assuming you have a "home.ejs" view file
})
router.get('/register', (req, res) => {
  //const passwordStrengthMessage = '' // Retrieve the message from the query parameters
  res.render('register')
})
router.get('/login', (req, res) => {
  const error = req.session.error || ''
  const success = req.session.success || ''
  res.render('login', { error, success }) // Assuming you have a "home.ejs" view file
})
router.get('/personal-campaign-editor', async (req, res) => {
  res.render('personal-campaign-editor', { user: req.session.user })
})
router.get('/business-campaign-editor', async (req, res) => {
  res.render('business-campaign-editor', { user: req.session.user })
})
router.get('/prelaunch', async (req, res) => {
  res.render('prelaunch', { user: req.session.user })
})
router.get('/verification', async (req, res) => {
  res.render('verification')
})
router.get('/error', async (req, res) => {
  res.render('error-page')
})
router.get('/verify', async (req, res) => {
  const { token } = req.query
  const user = await userModel.verifyUser(token)

  if (user) {
    console.log('verify route user:', user)
    res.redirect('/login')
  } else {
    res.send('Invalid or expired token.')
  }
})
router.get('/changepassword', async (req, res) => {
  const { token } = req.query
  // const user = await userModel.changePassword(emailtoken)
  await userModel.deleteToken(token)
  // if (user) {
  //   console.log('verify route user:', user)
  const error = req.session.error || ''
  //   res.redirect('/login', { error })
  // } else {
  //   res.send('Invalid or expired token.')
  // }
  res.render('forgot-password', { error })
})
router.get('/forgot-password', async (req, res) => {
  const error = req.session.error || ''
  res.render('forgot-password', { error })
})

router.get('/send-token', async (req, res) => {
  const error = req.session.error || ''
  res.render('send-token', { error })
})

router.get('/browse-campaigns', async (req, res) => {
  res.render('browse-campaigns', { user: req.session.user })
})
router.get('/view-campaign', async (req, res) => {
  res.render('view-campaign', { user: req.session.user })
})
router.get('/view-prelaunch', async (req, res) => {
  const content = {title: 'My Campaign', description: 'This is my campaign description', image: ''}
  res.render('view-prelaunch', { user: req.session.user, content: content })
})
router.get('/view-campaign', async (req, res) => {
  const content = {
    title: 'My Campaign',
    description: 'This is my campaign description',
    image: '',
  }
  res.render('view-campaign', { user: req.session.user, content: content })
})

// Serve static files from the 'uploads' directory
router.use('/uploads', express.static(path.join(__dirname, '../uploads')));

router.get('/browse-personal-campaign', projectController.getBrowseCampaigns)
router.get('/browse-business-campaign', projectController.browseBusinessCampaigns)
router.get('/browse-prelaunch', projectController.browsePrelaunches)

router.get('/campaign/prelaunch/:campaignId',
  projectController.getPrelaunchCampaign
)
router.get('/campaign/personal/:campaignId', projectController.getCampaign)
router.get('/campaign/business/:campaignId', projectController.getBusinessCampaign)

// Include authentication routes from authController
router.use('/auth', authController)
router.use('/file', fileController)

module.exports = router
