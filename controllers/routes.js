const express = require('express')
const fs = require('fs')
const router = express.Router()
const path = require('path')

const authController = require('./authController') // Import the authentication controller
const fileController = require('./fileController')
const projectController = require('./projectController') // Import the file controller
const browseRoutes = require('./browseRoutes') 
const browseController = require('./browseController') 
const userModel = require('../models/userModel') // Import userModel functions
const fileModel = require('../models/fileModel')
const projectModel = require('../models/projectModel')
const followController = require('./followController')
const followRoutes = require('./followRoutes')
const adminController = require('./adminController')
const adminRoutes = require('./adminRoutes')

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

  const error = req.session.error || ''


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



// Serve static files from the 'uploads' directory
router.use('/uploads', express.static(path.join(__dirname, '../uploads')))

router.get('/browse-personal-campaign', projectController.getBrowseCampaigns
)


router.get(
  '/campaign/prelaunch/:campaignId',
  projectController.getPrelaunchCampaign
)
router.get('/campaign/personal/:campaignId', projectController.getPersonal)
// router.get(
//   '/campaign/:campaignId',
//   projectController.getPersonal
// )

// Include authentication routes from authController
router.use('/auth', authController)
router.use('/file', fileController)
router.use('/browse', browseRoutes)
router.use('/follow', followRoutes)
router.use('/admin', adminRoutes)



router.get('/sort/amount', browseController.sortByHighestAmount)
router.get('/sort/followers', browseController.sortByHighestFollowers)
router.get('/sort/backers', browseController.sortByHighestBackers)
router.get('/sort/deadline', browseController.sortByEarliestDeadline)
router.get('/filter', browseController.filterByCategory)

router.get('/notification', followController.getNotifications)
router.get('/MyCampaigns', followController.getMyCampaignsProfile)
router.get('/FollowedCampaigns', followController.getFollowedCampaignsProfile)
router.get('/DonatedCampaigns', followController.getBackedCampaignsProfile)

// testing
router.get('/users', adminController.getUsers)
router.get('/unapprovedCampaigns', adminController.getNotApprovedCampaigns)
// router.get('/approveCampaign/:campaignId', adminController.approveCampaign)


module.exports = router
