const profileModel = require('../models/profileModel');
const adminModel = require('../models/adminModel');

async function editProfile(req, res) {
 res.render('edit-profile', { user: req.session.user });
}

async function deleteCampaign(req, res) {
 const myCamp = req.query.campaignId;
 res.render('delete-campaign', { user: req.session.user, campaignId: myCamp });
}

async function getEditPrelaunchForm(req, res) {
 const { campaignId } = req.params;
 try {
  // Get campaign details by campaignId using your model function
  res.render('edit-prelaunch', { user: req.session.user, campaignId })
 } catch (error) {
  console.error('Error fetching prelaunch campaign data:', error);
  res.status(500).send('Internal Server Error');
 }
}

async function getEditPersonalCampaignForm(req, res) {
 const { campaignId } = req.params;
 try {
  // Get campaign details by campaignId using your model function
  res.render('edit-personal-campaign', { user: req.session.user, campaignId })
 } catch (error) {
  console.error('Error fetching personal campaign data:', error);
  res.status(500).send('Internal Server Error');
 }
}

async function getEditBusinessCampaignForm(req, res) {
 const { campaignId } = req.params;
 try {
  // Get campaign details by campaignId using your model function
  res.render('edit-business-campaign', { user: req.session.user, campaignId })
 } catch (error) {
  console.error('Error fetching business campaign data:', error);
  res.status(500).send('Internal Server Error');
 }
}

async function getUserProfileByEmail(req, res) {
 const email = req.params.email;
 console.log(req.params)
 console.log(req.query)
 console.log(req.body)
 try {
  const profile = await profileModel.getUserByEmail(email);
  const count_followed = await profileModel.getCountOfFollowedCampaigns(email);
  const count_created = await profileModel.getCountOfCreatedCampaigns(email);
  const count_backed = await profileModel.getCountOfBackedCampaigns(email);
  res.render('outside-profile', { user: req.session.user, profile: profile , followed: count_followed, created: count_created, backed: count_backed})
 }
 catch (error) {
  console.error('Error fetching user profile:', error);
  res.status(500).send('Internal Server Error');
 }
}





module.exports = {
 editProfile,
 deleteCampaign,
 getEditPrelaunchForm,
 getEditPersonalCampaignForm,
 getEditBusinessCampaignForm,
 getUserProfileByEmail,

}
