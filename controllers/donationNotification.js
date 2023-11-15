const express = require('express')

const sessionStore = require('../models/sessionStore') // Import the sessionStore setup
const router= express.Router()

// Controller function to get a specific record by id
const donationModel = require('../models/donationModel')

async function getNotifications (req, res){
    const notif = req.session.user.email;
    console.log(notif);
    try {
      // Get notification details by email using your model function
      const donation_notification = await donationModel.getNotifByDonation(notif);
      console.log(donation_notification);
              if (donation_notification === null) {
            // Handle the case where no notification data is found
            // You can render the page without that information or show a message
            res.render('notification', { user: req.session.user, donation_notification: null });
        } else {
            res.render('notification', { user: req.session.user, donation_notification });
        }
    } catch (error) {
      console.error('Error fetching notification data:', error);
      res.status(500).send('Internal Server Error');
    }
}

async function getBackedCampaignsProfile(req, res) {
  const myDonor = req.session.user.email;
  console.log(myDonor);
  try {
    // Get follow details by email using your model function
    const campaigns = await donationModel.getMyDonation(myDonor);
    console.log(campaigns);
          if (campaigns === null) {
            // Handle the case where no notification data is found
            // You can render the page without that information or show a message
            res.render('DonatedCampaigns', { user: req.session.user, don_campaigns: null});
        } else {
            res.render('DonatedCampaigns', { user: req.session.user, campaigns: campaigns });
        }
    
  } catch (error) {
    console.error('Error fetching donated campaign data:', error);
    res.status(500).send('Internal Server Error');
  }
}


module.exports = {
    getNotifications,
    getBackedCampaignsProfile,
}