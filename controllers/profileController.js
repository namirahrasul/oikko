async function editProfile(req, res) {
 res.render('edit-profile', { user: req.session.user });
}

async function deleteCampaign(req, res) {
 const myCamp = req.query.campaignId;
 res.render('delete-campaign', { user: req.session.user, campaignId: myCamp });
}


module.exports = {
 editProfile,
 deleteCampaign,
}
