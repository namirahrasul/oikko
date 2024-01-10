const express = require('express')

const sessionStore = require('../models/sessionStore')
// Import the sessionStore setup
const router = express.Router()
const cron = require('node-cron');

// Controller function to get a specific record by id
const followModel = require('../models/followModel')
const profileModel = require('../models/profileModel')
const adminModel = require('../models/adminModel');

cron.schedule('* * * * *', async () => {
  await followModel.checkAndInsertData();
  await followModel.checkAndInsertGoalAmtData();
  console.log('Check done');
});




async function getNotifications(req, res) {
  const notif = req.session.user.email;
  console.log(notif);
  try {
    // Get notification details by email using your model function
    const notification = await followModel.getNotifById(notif);
    const date_notif = await followModel.getGoalDateNotif(notif);
    const approve_notification = await adminModel.getNotif(notif);
    const amt_notif = await followModel.getGoalAmtNotif(notif);
    const admin_notif = await followModel.getAdminNotifs(notif);
    const report_notif = await followModel.getReportNotifs(notif);
    const campaign_reported_notif = await followModel.getCampaignCreatorReportNotifs(notif);
    const profile = await profileModel.getProfileImg(notif);
    // console.log(notification);
    // console.log(approve_notification);
    // console.log(date_notif);
    // console.log(amt_notif);
    if (notification === null) {
      // Handle the case where no notification data is found
      // You can render the page without that information or show a message
      res.render('notification', { user: req.session.user, notification: null ,profile});
    } else {
      res.render('notification', { user: req.session.user, notification, approve_notification, date_notif, amt_notif ,admin_notif, report_notif, campaign_reported_notif, profile });
    }
  } catch (error) {
    console.error('Error fetching notification data:', error);
    res.status(500).send('Internal Server Error');
  }
}
  
async function getMyCampaignsProfile(req, res) {
    const myCamp = req.session.user.email;
    console.log(myCamp);
    try {
      // Get notification details by email using your model function
      const campaigns = await followModel.getMyCampaign(myCamp);
      const profile = await profileModel.getProfileImg(myCamp);
      //console.log(campaigns);
      const plainCampaigns = campaigns.map(campaign => JSON.parse(JSON.stringify(campaign)))
            res.render('MyCampaigns', { user: req.session.user, campaigns:campaigns, campaignsJSON: plainCampaigns ,profile });
        
     
    } catch (error) {
      console.error('Error fetching campaign data:', error);
      res.status(500).send('Internal Server Error');
    }
}
  
async function getFollowedCampaignsProfile(req, res){
  const myFollow = req.session.user.email;
  console.log(myFollow);
  try {
    // Get follow details by email using your model function
    const campaigns = await followModel.getMyFollow(myFollow);
    const profile = await profileModel.getProfileImg(myFollow);
    console.log(campaigns);
          if (campaigns === null) {
            // Handle the case where no notification data is found
            // You can render the page without that information or show a message
            res.render('FollowedCampaigns', { user: req.session.user, campaigns: null, profile});
        } else {
            res.render('FollowedCampaigns', { user: req.session.user, campaigns: campaigns ,profile});
        }
    
  } catch (error) {
    console.error('Error fetching followed campaign data:', error);
    res.status(500).send('Internal Server Error');
  }
}




module.exports = {
  getNotifications,
  getMyCampaignsProfile,
  getFollowedCampaignsProfile,

  }