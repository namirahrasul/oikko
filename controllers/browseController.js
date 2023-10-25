const express = require('express')

const sessionStore = require('../models/sessionStore') // Import the sessionStore setup
const router= express.Router()

// Controller function to get a specific record by id
const projectModel = require('../models/projectModel')

async function sortByHighestAmount(req, res){
  try {
        
      
    const campaigns = await projectModel.sortCampaignAmount();
    res.render('browse-campaigns', {
      user: req.session.user,
      campaigns: campaigns,
      // lastSearch: inputData
    })
    // console.log("campaigns", campaigns)
  } catch (error) {
    console.error('Error fetching data:', error)
    res.status(500).send('Internal Server Error')
  }
}
async function sortByHighestFollowers(req, res){
  try {
        

      
    const campaigns = await projectModel.sortCampaignFollowers();
    res.render('browse-campaigns', {
      user: req.session.user,
      campaigns: campaigns,
      // lastSearch: inputData
    })
    // console.log("campaigns", campaigns)
  } catch (error) {
    console.error('Error fetching data:', error)
    res.status(500).send('Internal Server Error')
  }
}
async function sortByHighestBackers(req, res) {
  try {
        

    const campaigns = await projectModel.sortCampaignBackers();
    res.render('browse-campaigns', {
      user: req.session.user,
      campaigns: campaigns,
      // lastSearch: inputData
    })
    // console.log("campaigns", campaigns)
  } catch (error) {
    console.error('Error fetching data:', error)
    res.status(500).send('Internal Server Error')
  }
}
async function sortByEarliestDeadline(req, res){
  try {
        
    // const inputData = req.query.data;
    // console.log(inputData)
      
    const campaigns = await projectModel.sortCampaignDeadline();
    res.render('browse-campaigns', {
      user: req.session.user,
      campaigns: campaigns,
      // lastSearch: inputData
    })
    // console.log("campaigns", campaigns)
  } catch (error) {
    console.error('Error fetching data:', error)
    res.status(500).send('Internal Server Error')
  }
}
async function filterByCategory(req, res) {
  try {
    console.log("req.query",req.query)
  const inputData = req.query.inputData;
  console.log("inputData",inputData)
    const type = req.query.type;
    console.log("type",type)
    var is_business;
    var is_personal;
    var is_prelaunch;
  if (type === 'prelaunch') {
    is_business = false;
    is_personal = false;
    is_prelaunch = true;
  }
  else if (type === 'personal') {
    is_business = false;
    is_personal = true;
    is_prelaunch = false;
  }
  else if (type === 'business') {
    is_business = true;
    is_personal = false;
    is_prelaunch = false;
  }
  else {
    is_business = true;
    is_personal = true;
    is_prelaunch = true;
  }
     

    // Convert radio button values to variables
    var minFollowers = parseInt(req.query.followers);
    var minAmountRaised = parseInt(req.query.amount);
    var minBackers = parseInt(req.query.backers);
    var maxFollowers;
    var maxAmountRaised;
    var maxBackers;
    const maxFollowersResult = await projectModel.getMaxFollowers();
    const maxAmountRaisedResult = await projectModel.getMaxAmountRaised();
    const maxBackersResult = await projectModel.getMaxBackers();
    // console.log("maxFollowerResult ", maxFollowersResult, " maxAmountRaisedResult ",maxAmountRaisedResult," maxBackersResult ",maxBackersResult)
    // Handle "Below 500" and "Above 1000" options differently
    if (minFollowers === 0) {
        maxFollowers = 99;
    } else if (minFollowers === 100) {
        maxFollowers = 500;
    } else if (minFollowers === 501) {
         // Adjust minimum for "Above 1000"
        maxFollowers = maxFollowersResult[0][0]['MAX(no_followers)']// No maximum for "Above 1000"
    } else {
        minFollowers = 0; // Adjust minimum for "Below 500"
        maxFollowers = maxFollowersResult[0][0]['MAX(no_followers)']// No maximum for "Below 100"
    }

    if (minAmountRaised === 0) {
        maxAmountRaised = 4999;
    } else if (minAmountRaised === 5000) {
        maxAmountRaised = 10000; // No maximum for "Above 10000"
    }else if (minAmountRaised === 10001) {
        maxAmountRaised = maxAmountRaisedResult[0][0]['MAX(amount_raised)']// No maximum for "Above 10000"
    } else {
       minAmountRaised = 0; // Adjust minimum for "Below 5000"
        maxAmountRaised = maxAmountRaisedResult[0][0]['MAX(amount_raised)'] // No maximum for "Below 5000"
    }

    if (minBackers === 0) {
        maxBackers = 499;
    } else if (minBackers === 500) {
        maxBackers = 1000; // No maximum for "Above 1000"
    } else if (minBackers === 1001) {
        maxBackers =maxBackersResult[0][0]['MAX(no_donors)']// No maximum for "Above 1000"
    } else {
        minBackers = 0; // Adjust minimum for "Below 500"
        maxBackers = maxBackersResult[0][0]['MAX(no_donors)'] // No maximum for "Below 500"
    }
    console.log("minFollowers:", minFollowers, "maxFollowers:", maxFollowers, "minAmountRaised:", minAmountRaised, "maxAmountRaised:", maxAmountRaised, "minBackers:", minBackers, "maxBackers:", maxBackers);
    // var campaigns;
    // if (is_business && is_personal && is_prelaunch)
    //   campaigns = await projectModel.filterAllCategory(minFollowers, maxFollowers, minAmountRaised, maxAmountRaised, minBackers, maxBackers)
    // else
    const campaigns = await projectModel.filterCampaignCategory(is_prelaunch, is_personal, is_business, minFollowers, maxFollowers, minAmountRaised, maxAmountRaised, minBackers, maxBackers);
   console.log("campaigns", campaigns)
    res.render('browse-campaigns', {
      user: req.session.user,
      campaigns: campaigns,
      // lastSearch: inputData
    })
    // console.log("campaigns", campaigns)
  } catch (error) {
    console.error('Error fetching data:', error)
    res.status(500).send('Internal Server Error')
  }
}

module.exports = {
    sortByHighestAmount,
    sortByHighestFollowers,
    sortByHighestBackers,
    sortByEarliestDeadline,
    filterByCategory,
}