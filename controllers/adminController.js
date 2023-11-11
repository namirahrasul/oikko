
const adminModel = require('../models/adminModel')

async function getUsers(req, res) {
 const email = req.session.user.email;
 console.log(email);
 try {
  // Get notification details by email using your model function
  const users = await adminModel.getUsers(email);
  console.log(users);
  if (users === null) {
   // Handle the case where no notification data is found
   // You can render the page without that information or show a message
   res.render('users', { user: req.session.user, users: null });
  } else {
   res.render('users', { user: req.session.user, users: users });
  }
 } catch (error) {
  console.error('Error fetching notification data:', error);
  res.status(500).send('Internal Server Error');
 }
}

async function getNotApprovedCampaigns(req, res) {
 const email = req.session.user.email;
 console.log(email);
 try {
  // Get notification details by email using your model function
  const campaigns = await adminModel.getNotApprovedCampaigns(email);
  // console.log(campaigns);
  if (campaigns === null) {
   // Handle the case where no notification data is found
   // You can render the page without that information or show a message
   res.render('unapproved-campaigns', { user: req.session.user, campaigns: null });
  } else {
   res.render('unapproved-campaigns', { user: req.session.user, campaigns: campaigns });
  }

 } catch (error) {
  console.error('Error fetching campaign data:', error);
  res.status(500).send('Internal Server Error');
 }
}

async function getDocumentsOfCampaign(req, res) {
 const campaignId = req.params.campaignId;
 console.log(campaignId);
 try {
  // Get notification details by email using your model function
  const documents = await adminModel.getDocsById(campaignId);
  console.log(documents);
  if (documents === null) {
   // Handle the case where no notification data is found
   // You can render the page without that information or show a message
   res.render('view-documents', { user: req.session.user, documents: null });
  } else {
   res.render('view-documents', { user: req.session.user, documents: documents });
  }

 } catch (error) {
  console.error('Error fetching campaign data:', error);
  res.status(500).send('Internal Server Error');
 }
}
async function AddAdmin(req, res) {
  res.render('register-admin',{user: req.session.user});
 }




module.exports = {
 AddAdmin,
 getNotApprovedCampaigns,
 getUsers,
 getDocumentsOfCampaign,

}