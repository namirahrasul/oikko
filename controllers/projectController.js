const express = require('express')

const sessionStore = require('../models/sessionStore')
// Import the sessionStore setup


// Controller function to get a specific record by id
const projectModel = require('../models/projectModel')
const followModel = require('../models/followModel')
const donationModel = require('../models/donationModel')

async function getBrowseCampaigns(req, res) {
    try {
        const campaigns = await projectModel.getCampaignsPersonal()
        //    res.json(campaigns)
        //    const campaigns= JSON.stringify(campaignNotJSON)
        res.render('browse-campaigns', { user: req.session.user, campaigns: campaigns })
    } catch (error) {
        console.error('Error fetching data:', error)
        res.status(500).send('Internal Server Error')
    }
}

async function getPrelaunchCampaign(req, res) {
    const { campaignId } = req.params;
    try {
        // Get campaign details by campaignId using your model function
        const campaign = await projectModel.getPersonalById(campaignId);
        const followState = await followModel.checkIfFollowing(req.session.user.email, campaignId);
        // Render the campaign prelaunch page with campaign data
        res.render('view-prelaunch', { user: req.session.user, campaign, followState })
    } catch (error) {
        console.error('Error fetching prelaunch campaign data:', error);
        res.status(500).send('Internal Server Error');
    }
}

async function getPersonal(req, res) {
    const { campaignId } = req.params;
    try {
        // Get campaign details by campaignId using your model function
        const campaign = await projectModel.getPersonalById(campaignId);
        const followState = await followModel.checkIfFollowing(req.session.user.email, campaignId);
        console.log(followState);
        const donationState = await donationModel.checkIfBacked(req.session.user.email, campaignId);

        res.render('view-campaign', { user: req.session.user, campaign, followState, donationState });

    } catch (error) {
        console.error('Error fetching campaign data:', error);
        res.status(500).send('Internal Server Error');
    }
}

async function previewPrelaunchCampaign(req, res) {
    const { campaignId } = req.params;
    try {
        // Get campaign details by campaignId using your model function
        const campaign = await projectModel.getPersonalEditedById(campaignId);

        // Render the campaign prelaunch page with campaign data
        res.render('preview-prelaunch', { user: req.session.user, campaign })
    } catch (error) {
        console.error('Error fetching prelaunch campaign data:', error);
        res.status(500).send('Internal Server Error');
    }
}

async function previewPersonal(req, res) {
    const { campaignId } = req.params;
    try {
        // Get campaign details by campaignId using your model function
        const campaign = await projectModel.getPersonalEditedById(campaignId);



        // Render the campaign page with campaign data
        res.render('preview-campaign', { user: req.session.user, campaign});

    } catch (error) {
        console.error('Error fetching campaign data:', error);
        res.status(500).send('Internal Server Error');
    }
}



module.exports = {
    // testBrowseCampaigns,
    getBrowseCampaigns,
    getPrelaunchCampaign,
    // getCampaign,
    getPersonal,
    previewPrelaunchCampaign,
    previewPersonal,

}

