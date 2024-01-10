
const adminModel = require('../models/adminModel')
const profileModel = require('../models/profileModel')


async function getUsers(req, res) {
  const email = req.session.user.email;
  console.log(email);
  try {
    // Get notification details by email using your model function
    const users = await adminModel.getUsers(email);
    const profile = await profileModel.getProfileImg(email);
    console.log(users);
    if (users === null) {
      // Handle the case where no notification data is found
      // You can render the page without that information or show a message
      res.render('users', { user: req.session.user, users: null, profile });
    } else {
      res.render('users', { user: req.session.user, users: users , profile});
    }
  } catch (error) {
    console.error('Error fetching notification data:', error);
    res.status(500).send('Internal Server Error');
  }
}

async function getNotApprovedCampaigns(req, res) {
  
  try {
    // Get notification details by email using your model function
    const campaigns = await adminModel.getNotApprovedCampaigns();
    const profile = await profileModel.getProfileImg(req.session.user.email);
    // console.log(campaigns);
    res.render('unapproved-campaigns', { user: req.session.user, campaigns: campaigns, profile });
  }

  catch (error) {
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
  res.render('register-admin', { user: req.session.user });
}
async function getReportForm(req, res) {
  try {
    const campaignId = req.params.campaignId;
    res.render('report-form', { user: req.session.user, campaignId });

  } catch (error) {
    console.error('Error fetching campaign data:', error);
    res.status(500).send('Internal Server Error');
  }
}
async function getAcceptedReport(req, res) {
  res.render('accepted-report', { user: req.session.user });
}

async function getReportedCampaigns(req, res) {

  try {
    // Get notification details by email using your model function
    const reports = await adminModel.getNotApprovedReports();
     const profile = await profileModel.getProfileImg(req.session.user.email);
    // console.log(campaigns);
    res.render('reported-campaigns', { user: req.session.user, reports, profile });
  }

  catch (error) {
    console.error('Error fetching campaign data:', error);
    res.status(500).send('Internal Server Error');
  }
}

async function viewCampaignReport(req, res) {
  const rid = req.params.rid;
  try {
    const reportId = rid;
    const report = await adminModel.getReportById(reportId);
    console.log(report);
    res.render('sent-report', { user: req.session.user, report });

  } catch (error) {
    console.error('Error fetching campaign data:', error);
    res.status(500).send('Internal Server Error');
  }
}
async function getDeleteForm(req, res) {
  try {
    const campaignId = req.params.campaignId;
    res.render('delete-form', { user: req.session.user, campaignId });
  }catch (error) {
    console.error('Error fetching campaign data:', error);
    res.status(500).send('Internal Server Error');
  }
}


async function viewDeleteRequest(req, res) {
  const id = req.params.did;
  try {
    const deleteId = id;
    const request = await adminModel.getDeleteRequestById(deleteId);
    console.log(request);
    res.render('view-delete-reason', { user: req.session.user, request });

  } catch (error) {
    console.error('Error fetching campaign data:', error);
    res.status(500).send('Internal Server Error');
  }
}

async function getAllEditRequests(req, res) {
  try {
    const reports = await adminModel.selectEditRequests();
    const profile = await profileModel.getProfileImg(req.session.user.email);
    res.render('edit-requests', { user: req.session.user, reports, profile });
  } catch (error) {
    console.error('Error fetching campaign data:', error);
    res.status(500).send('Internal Server Error');
  }
}

async function getAllDeleteRequests(req, res) {
  try {
    const request = await adminModel.selectDeleteRequests();
    const profile = await profileModel.getProfileImg(req.session.user.email);
    res.render('delete-requests', { user: req.session.user, request, profile });
  } catch (error) {
    console.error('Error fetching campaign data:', error);
    res.status(500).send('Internal Server Error');
  }
}

async function getUserBlockForm(req, res) {
  const userEmail = req.params.email;
  try {
    console.log(userEmail);
    res.render('block-user-form', { user: req.session.user, userEmail });

  } catch (error) {
    console.error('Error fetching campaign data:', error);
    res.status(500).send('Internal Server Error');
  }
}

async function getAboutPage(req, res) {
 
  try {
    
    res.render('about', { user: req.session.user});

  } catch (error) {
    console.error('Error fetching campaign data:', error);
    res.status(500).send('Internal Server Error');
  }
}
async function getServicesPage(req, res) {

  try {

    res.render('services', { user: req.session.user });

  } catch (error) {
    console.error('Error fetching campaign data:', error);
    res.status(500).send('Internal Server Error');
  }
}


module.exports = {
  AddAdmin,
  getNotApprovedCampaigns,
  getUsers,
  getDocumentsOfCampaign,
  getReportForm,
  getAcceptedReport,
  getReportedCampaigns,
  viewCampaignReport,
  getDeleteForm,
  viewDeleteRequest,
   getAllDeleteRequests,
  getAllEditRequests,
  getUserBlockForm,
  getAboutPage,
  getServicesPage
}