const express = require('express')
const fs = require('fs')
const router = express.Router()
const path = require('path')
const bodyParser = require('body-parser');

const authController = require('./authController') // Import the authentication controller
const fileController = require('./fileController')
const projectController = require('./projectController') // Import the file controller
const browseRoutes = require('./browseRoutes')
const browseController = require('./browseController')
const userModel = require('../models/userModel') // Import userModel functions
const donationController = require('./donationController')
const donationRoutes = require('./donationRoutes')
const donationModel = require('../models/donationModel')
const donationNotification = require('./donationNotification')
const followController = require('./followController')
const followRoutes = require('./followRoutes')
const adminController = require('./adminController')
const adminRoutes = require('./adminRoutes')
const profileRoutes = require('./profileRoutes')
const profileController = require('./profileController')
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
router.get(
  '/campaign/preview-prelaunch/:campaignId',
  projectController.previewPrelaunchCampaign
)
router.get('/campaign/preview-personal/:campaignId', projectController.previewPersonal)

// Include authentication routes from authController
router.use('/auth', authController)
router.use('/file', fileController)
router.use('/browse', browseRoutes)
router.use('/follow', followRoutes)
router.use('/admin', adminRoutes)
router.use('/donation', donationController)
router.use('/donation2', donationRoutes)
router.use('/profile', profileRoutes)

router.get('/donation', async (req, res) => {
  console.log("campaignId", req.query.campaignId);
  res.render('donation', { user: req.session.user, campaignId: req.query.campaignId });
})
router.get('/success', async (req, res) => {

  res.render('success');
})
router.post("/ssl-payment/success/:tranId/:cid/:donation/:mail", async (req, res) => {
  const tranId = req.params.tranId;
  console.log(tranId);

  const cid = req.params.cid;
  console.log(cid);

  const donation = req.params.donation;
  console.log(donation);

  const mail = req.params.mail;
  console.log(mail);

  if (!mail || !cid) {
    console.error('Invalid donor or cid value');
    // Handle the error or return an error response
  }
  else {
    const result = await donationModel.insertDonationData(mail, cid, donation);
    const result2 = await donationModel.updateCampaignDonorsById(cid);
    const result3 = await donationModel.increaseAmountRaised(cid);
    console.log("result");
    console.log(result)
    console.log("result2", result2);
    console.log("result3");
    console.log(result3);
  }
  res.render('Success', { user: req.session.user });
});


router.post("/ssl-payment/failure", async (req, res) => {
  res.render('Failure', { user: req.session.user });
});


router.get('/sort/amount', browseController.sortByHighestAmount)
router.get('/sort/followers', browseController.sortByHighestFollowers)
router.get('/sort/backers', browseController.sortByHighestBackers)
router.get('/sort/deadline', browseController.sortByEarliestDeadline)
router.get('/filter', browseController.filterByCategory)

router.get('/notification', followController.getNotifications)
router.get('/MyCampaigns', followController.getMyCampaignsProfile)
router.get('/FollowedCampaigns', followController.getFollowedCampaignsProfile)
router.get('/DonatedCampaigns', donationNotification.getBackedCampaignsProfile)


router.get('/users', adminController.getUsers)
router.get('/unapprovedCampaigns', adminController.getNotApprovedCampaigns)
router.get('/documents/:campaignId', adminController.getDocumentsOfCampaign)
router.get('/register-admin', adminController.AddAdmin)



router.get('/report/:campaignId', adminController.getReportForm)
router.get('/accepted-report', adminController.getAcceptedReport)
router.get('/reported-campaigns', adminController.getReportedCampaigns)
router.get('/view-report/:rid', adminController.viewCampaignReport)
router.get('/edit-prelaunch/:campaignId', profileController.getEditPrelaunchForm)
router.get('/edit-personal-campaign/:campaignId', profileController.getEditPersonalCampaignForm)
router.get('/edit-business-campaign/:campaignId', profileController.getEditBusinessCampaignForm)
router.get('/edit-profile', profileController.editProfile)
router.get('/user/:email', profileController.getUserProfileByEmail)
router.get('/delete-form/:campaignId', adminController.getDeleteForm)
router.get('/delete-requests', adminController.getAllDeleteRequests)
router.get('/edit-requests', adminController.getAllEditRequests)
router.get('/delete-request/:did', adminController.viewDeleteRequest)
router.get('/block-user/:email', adminController.getUserBlockForm)
router.get('/about', adminController.getAboutPage)
router.get('/services', adminController.getServicesPage)




module.exports = router
