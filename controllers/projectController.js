const express = require('express')

const sessionStore = require('../models/sessionStore') // Import the sessionStore setup


// Controller function to get a specific record by id
const projectModel = require('../models/projectModel')
 async function getBrowseCampaigns(req, res){
   try {
     const campaigns = await projectModel.getCampaigns()
     console.log(campaigns)
     res.render('browse-personal-campaigns', { user:req.session.user,campaigns:campaigns })
   } catch (error) {
     console.error('Error fetching data:', error)
     res.status(500).send('Internal Server Error')
   }
}
 
 async function browsePrelaunches(req, res) {
   try {
     const campaigns = await projectModel.getPrelaunches()
     console.log(campaigns)
     res.render('browse-prelaunches', {
       user: req.session.user,
       campaigns: campaigns,
     })
   } catch (error) {
     console.error('Error fetching data:', error)
     res.status(500).send('Internal Server Error')
   }
}
 
 async function browseBusinessCampaigns(req, res) {
   try {
     const campaigns = await projectModel.getBusinessCampaigns()
     console.log(campaigns)
     res.render('browse-business-campaigns', {
       user: req.session.user,
       campaigns: campaigns,
     })
   } catch (error) {
     console.error('Error fetching data:', error)
     res.status(500).send('Internal Server Error')
   }
 }
    async function getPrelaunchCampaign(req, res){
        const { campaignId } = req.params;
        try {
            // Get campaign details by campaignId using your model function
            const campaign = await projectModel.getPrelaunchById(campaignId);

            // Render the campaign prelaunch page with campaign data
            res.render('view-prelaunch', { user: req.session.user, campaign })
        } catch (error) {
            console.error('Error fetching prelaunch campaign data:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    async function getCampaign(req, res) {
        const { campaignId } = req.params;
        try {
            // Get campaign details by campaignId using your model function
            const campaign = await projectModel.getCampaignById(campaignId);

            // Render the campaign page with campaign data
            res.render('view-campaign', { user: req.session.user,campaign });
        } catch (error) {
            console.error('Error fetching campaign data:', error);
            res.status(500).send('Internal Server Error');
        }
}
        async function getBusinessCampaign(req, res) {
          const { campaignId } = req.params
          try {
            // Get campaign details by campaignId using your model function
            const campaign = await projectModel.getBusinessCampaignById(campaignId)

            // Render the campaign page with campaign data
            res.render('view-campaign', { user: req.session.user, campaign })
          } catch (error) {
            console.error('Error fetching campaign data:', error)
            res.status(500).send('Internal Server Error')
          }
        }
  module.exports = {
    getBrowseCampaigns,
    getPrelaunchCampaign,
    getCampaign,
    browsePrelaunches,
    browseBusinessCampaigns,
    getBusinessCampaign,
   }
