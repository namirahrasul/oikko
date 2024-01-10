const express = require('express')
const router = express.Router()
const fileModel = require('../models/fileModel.js')
const projectModel = require('../models/projectModel.js')
const adminModel = require('../models/adminModel.js')
const multer = require('multer')
const fs = require('fs')
// const upload = multer({ dest: 'uploads/' }); // Specify the destination directory for uploaded files
const path = require('path')

const upload = multer({
  storage: multer.diskStorage({
    destination: 'uploads',
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
      const originalname = file.originalname
      const filenameWithoutExtension = originalname.replace(/\.[^/.]+$/, '') // Remove file extension
      const fileExtension = originalname.split('.').pop() // Get file extension
      const uniqueFilename = `${filenameWithoutExtension}-${uniqueSuffix}.${fileExtension}`
      cb(null, uniqueFilename)
    },
  }),
})


//testing

// Handle form submission
router.post(
  '/submit-business',
  [
    upload.fields([
      { name: 'file1', maxCount: 1 },
      { name: 'file2', maxCount: 1 },
      { name: 'file3', maxCount: 1 },
      { name: 'file4', maxCount: 1 },
      { name: 'file5', maxCount: 1 },
      { name: 'file6', maxCount: 1 },
      { name: 'file7', maxCount: 1 },
      { name: 'file8', maxCount: 1 },
      { name: 'file9', maxCount: 1 },
      { name: 'file10', maxCount: 1 },
      { name: 'file11', maxCount: 1 },
      { name: 'file12', maxCount: 1 },
      { name: 'file13', maxCount: 1 },
      { name: 'file14', maxCount: 1 },
      { name: 'file15', maxCount: 1 },
    ]),
  ],
  async (req, res) => {
    // res.send("Hello World");


    const {
      title,
      city,
      state,
      type,
      tagline,
      description,
      campaign_video,
      feature,
      goal_amount,
      goal_date,
      bsb,
      account,
      bkash,
      rocket,
      nagad,
      upay,
      perk_title,
      perk_description,
      perk_price,
      perk_retail_price,
      perk_date,
      fb_url,
      twitter_url,
      yt_url,
      website_url,

    } = req.body
    const is_prelaunch = false
    const is_personal = false
    const is_business = true
    const email = req.session.user.email
    // Access uploaded files
    const campaign_img = req.files.file1[0].filename
    const feature_img = req.files.file2[0].filename
    const perk_img = req.files.file3[0].filename
    const nid_front = req.files.file4[0].filename
    const nid_back = req.files.file5[0].filename
    const passport = req.files.file6[0].filename
    const business_plan = req.files.file7[0].filename
    const project_budget = req.files.file8[0].filename
    const product_prototype = req.files.file9[0].filename
    const legal_entity_verification = req.files.file10[0].filename
    const financial_statements = req.files.file11[0].filename
    const intellectual_property = req.files.file12[0].filename
    const permits = req.files.file13[0].filename
    const contracts = req.files.file14[0].filename
    const extras = req.files.file15[0].filename
    // const imagePath = req.file.path
    // Insert the data into the MySQL table
    await fileModel.insertCampaign(
      req,
      email,
      title,
      city,
      state,
      type,
      tagline,
      description,
      campaign_img,
      campaign_video,
      feature,
      feature_img,
      goal_amount,
      goal_date,
      bsb,
      account,
      bkash,
      rocket,
      nagad,
      upay,
      perk_title,
      perk_description,
      perk_img,
      perk_price,
      perk_retail_price,
      perk_date,
      nid_front,
      nid_back,
      passport,
      fb_url,
      twitter_url,
      yt_url,
      website_url,
      is_prelaunch,
      is_personal,
      is_business,
      async (err, result) => {
        if (err) {
          console.error('Error inserting data:', err)
          return res.status(500).send('Error submitting the form.')
          console.log('error submitting the form')

        }
        const bid = result.insertId
        await fileModel.insertBusiness(
          req,
          email,
          bid,
          business_plan,
          project_budget,
          product_prototype,
          legal_entity_verification,
          financial_statements,
          intellectual_property,
          permits,
          contracts,
          extras,
          async (err, result) => {
            if (err) {
              console.error('Error inserting data:', err)
              return res.status(500).send('Error submitting the form.')



            }
            console.log("email", email)
            console.log("bid", bid)
            await fileModel.insertNotif(req, email, bid, (err, result) => {
              if (err) {
                console.error('Error inserting data:', err);
                return res.status(500).send('Error submitting the form.');
              }

              console.log('Data inserted successfully:', result);
              res.redirect('/notification');
            });

          }
        )
        // res.redirect('/')
      }
    )
  }
)


router.post(
  '/submit-personal',
  [
    upload.fields([
      { name: 'file1', maxCount: 1 },
      { name: 'file2', maxCount: 1 },
      { name: 'file3', maxCount: 1 },
      { name: 'file4', maxCount: 1 },
      { name: 'file5', maxCount: 1 },
      { name: 'file6', maxCount: 1 },

    ]),
  ],
  (req, res) => {
    // res.send("Hello World");
    console.log(req.body)
    console.log(req.files)
    const {
      title,
      city,
      state,
      type,
      tagline,
      description,
      campaign_video,
      feature,
      goal_amount,
      goal_date,
      bsb,
      account,
      bkash,
      rocket,
      nagad,
      upay,
      perk_title,
      perk_description,
      perk_price,
      perk_retail_price,
      perk_date,
      fb_url,
      twitter_url,
      yt_url,
      website_url,

    } = req.body
    const is_prelaunch = false
    const is_personal = true
    const is_business = false
    const email = req.session.user.email
    // Access uploaded files
    const campaign_img = req.files.file1[0].filename
    const feature_img = req.files.file2[0].filename
    const perk_img = req.files.file3[0].filename
    const nid_front = req.files.file4[0].filename
    const nid_back = req.files.file5[0].filename
    const passport = req.files.file6[0].filename

    // const imagePath = req.file.path
    // Insert the data into the MySQL table
    fileModel.insertCampaign(
      req,
      email,
      title,
      city,
      state,
      type,
      tagline,
      description,
      campaign_img,
      campaign_video,
      feature,
      feature_img,
      goal_amount,
      goal_date,
      bsb,
      account,
      bkash,
      rocket,
      nagad,
      upay,
      perk_title,
      perk_description,
      perk_img,
      perk_price,
      perk_retail_price,
      perk_date,
      nid_front,
      nid_back,
      passport,
      fb_url,
      twitter_url,
      yt_url,
      website_url,
      is_prelaunch,
      is_personal,
      is_business,
      (err, result) => {
        if (err) {
          console.error('Error inserting data:', err)
          return res.status(500).send('Error submitting the form.')
          console.log('error submitting the form')

        }
        const bid = result.insertId
        fileModel.insertNotif(req, email, bid, (err, result) => {
          if (err) {
            console.error('Error inserting data:', err)
            return res.status(500).send('Error submitting the form.')


          }
          console.log('Data inserted successfully:', result)
          res.redirect('/notification')
        })
      }
    )
  }
)

router.post(
  '/submit-prelaunch',
  [
    upload.fields([
      { name: 'file1', maxCount: 1 },
      { name: 'file2', maxCount: 1 },
      // { name: 'file3', maxCount: 1 },
      // { name: 'file4', maxCount: 1 },
      // { name: 'file5', maxCount: 1 },
      // { name: 'file6', maxCount: 1 },

    ]),
  ],
  (req, res) => {
    // res.send("Hello World");
    console.log(req.body)
    console.log(req.files)

    const {
      title,
      city,
      state,
      type,
      tagline,
      description,
      campaign_video,
      feature,

      fb_url,
      twitter_url,
      yt_url,
      website_url,

    } = req.body
    console.log(req.body)
    const goal_amount = null;
    const goal_date = null;
    const bsb = null;
    const account = null;
    const bkash = null;
    const rocket = null;
    const nagad = null;
    const upay = null;
    const perk_title = null;
    const perk_description = null;
    const perk_price = null;
    const perk_retail_price = null;
    const perk_date = null;
    const is_prelaunch = true
    const is_personal = false
    const is_business = false
    const email = req.session.user.email
    // Access uploaded files
    const campaign_img = req.files.file1[0].filename
    const feature_img = req.files.file2[0].filename
    const perk_img = null
    const nid_front = null
    const nid_back = null
    const passport = null

    // const imagePath = req.file.path
    // Insert the data into the MySQL table
    fileModel.insertCampaign(
      req,
      email,
      title,
      city,
      state,
      type,
      tagline,
      description,
      campaign_img,
      campaign_video,
      feature,
      feature_img,
      goal_amount,
      goal_date,
      bsb,
      account,
      bkash,
      rocket,
      nagad,
      upay,
      perk_title,
      perk_description,
      perk_img,
      perk_price,
      perk_retail_price,
      perk_date,
      nid_front,
      nid_back,
      passport,
      fb_url,
      twitter_url,
      yt_url,
      website_url,
      is_prelaunch,
      is_personal,
      is_business,
      (err, result) => {
        if (err) {
          console.error('Error inserting data:', err)
          return res.status(500).send('Error submitting the form.')
          console.log('error submitting the form')

        }
        const bid = result.insertId
        fileModel.insertNotif(req, email, bid, (err, result) => {
          if (err) {
            console.error('Error inserting data:', err)
            return res.status(500).send('Error submitting the form.')


          }
          console.log('Data inserted successfully:', result)
          res.redirect('/notification')
        })
      }
    )
  }
)

router.post(
  '/edit-prelaunch/:campaignId',
  [
    upload.fields([
      { name: 'file1', maxCount: 1 },
      { name: 'file2', maxCount: 1 },
    ]),
  ],
  async (req, res) => {
    try {
      console.log(req.body);
      console.log(req.files);
      const { campaignId } = req.params;
      const {
        title,
        city,
        state,
        type,
        tagline,
        description,
        campaign_video,
        feature,

        fb_url,
        twitter_url,
        yt_url,
        website_url,
      } = req.body;
      const existingCampaign = await projectModel.getPersonalById(campaignId)
      console.log("existing campaign", existingCampaign);
      // const email = req.session.user.email;

      // Access uploaded files
      const campaign_img = req.files.file1 ? req.files.file1[0].filename : existingCampaign.campaign_img;
      const feature_img = req.files.file2 ? req.files.file2[0].filename : existingCampaign.feature_img;

      const insertFields = [
        'title', 'city', 'state', 'type', 'tagline', 'description', 'campaign_img',
        'campaign_video', 'feature', 'feature_img', 'fb_url', 'twitter_url', 'yt_url', 'website_url', 'amount_raised', 'is_approved', 'is_prelaunch', 'is_personal', 'is_business', 'no_followers', 'no_donors', 'old_id'
      ];

      const insertValues = [
        title || existingCampaign.title || null,
        city || existingCampaign.city || null,
        state || existingCampaign.state || null,
        type || existingCampaign.type || null,
        tagline || existingCampaign.tagline || null,
        description || existingCampaign.description || null,
        campaign_img || null,
        campaign_video || existingCampaign.campaign_video || null,
        feature || existingCampaign.feature || null,
        feature_img || null,
        fb_url || existingCampaign.fb_url || null,
        twitter_url || existingCampaign.twitter_url || null,
        yt_url || existingCampaign.yt_url || null,
        website_url || existingCampaign.website_url || null,
        existingCampaign.amount_raised || 0,
        0,
        existingCampaign.is_prelaunch || 0,
        existingCampaign.is_personal || 0,
        existingCampaign.is_business || 0,
        existingCampaign.no_followers || 0,
        existingCampaign.no_donors || 0,
        campaignId
      ];

      // Build the SQL query for inserting into edit_campaigns
      const insertSql = `INSERT INTO edit_campaigns (${insertFields.join(', ')}) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      // Insert the data into the edit_campaigns table
      const insertResult = await projectModel.insertEditCampaign(insertSql, insertValues, campaignId, req.session.user.email);
      if (insertResult) {

        console.log('Data updated successfully:', insertResult);
        res.redirect('/notification');
      }
    }
    catch (error) {
      console.log(error)
    }

  });

router.post(
  '/edit-personal/:campaignId',
  [
    upload.fields([
      { name: 'file1', maxCount: 1 },
      { name: 'file2', maxCount: 1 },
      { name: 'file3', maxCount: 1 },
      { name: 'file4', maxCount: 1 },
      { name: 'file5', maxCount: 1 },
      { name: 'file6', maxCount: 1 },
    ]),
  ],
  async (req, res) => {
    try {
      console.log(req.body);
      console.log(req.files);
      const { campaignId } = req.params;
      const {
        title,
        city,
        state,
        type,
        tagline,
        description,
        campaign_video,
        feature,
        goal_amount,
        goal_date,
        bsb,
        account,
        bkash,
        rocket,
        nagad,
        upay,
        perk_title,
        perk_description,
        perk_price,
        perk_retail_price,
        perk_date,
        fb_url,
        twitter_url,
        yt_url,
        website_url,
      } = req.body;
      const existingCampaign = await projectModel.getSingleCampaignById(campaignId)
      console.log("existing campaign", existingCampaign);
      // const email = req.session.user.email;

      // Access uploaded files
      const campaign_img = req.files.file1 !== undefined ? req.files.file1[0].filename : existingCampaign.campaign_img;
      const feature_img = req.files.file2 !== undefined ? req.files.file2[0].filename : existingCampaign.feature_img;
      const perk_img = req.files.file3 !== undefined ? req.files.file3[0].filename : existingCampaign.perk_img;
      const nid_front = req.files.file4 !== undefined ? req.files.file4[0].filename : existingCampaign.nid_front;
      const nid_back = req.files.file5 !== undefined ? req.files.file5[0].filename : existingCampaign.nid_back;
      const passport = req.files.file6 !== undefined ? req.files.file6[0].filename : existingCampaign.passport;



      const insertFields = [
        'title', 'email', 'city', 'state', 'type', 'tagline', 'description',
        'campaign_img', 'campaign_video', 'feature', 'feature_img', 'goal_amount', 'goal_date', 'bsb', 'account', 'bkash', 'rocket', 'nagad', 'upay', 'perk_title', 'perk_description', 'perk_img', 'perk_price', 'perk_retail_price', 'perk_date', 'nid_front', 'nid_back', 'passport', 'fb_url', 'twitter_url', 'yt_url', 'website_url', 'amount_raised', 'is_approved', 'is_prelaunch', 'is_personal', 'is_business', 'no_followers', 'no_donors', 'old_id'
      ];

      const insertValues = [
        title || existingCampaign.title || null,
        req.session.user.email,
        city || existingCampaign.city || null,
        state || existingCampaign.state || null,
        type || existingCampaign.type || null,
        tagline || existingCampaign.tagline || null,
        description || existingCampaign.description || null,
        campaign_img || null,
        campaign_video || existingCampaign.campaign_video || null,
        feature || existingCampaign.feature || null,
        feature_img || null,
        goal_amount || existingCampaign.goal_amount || null,
        goal_date || existingCampaign.goal_date || null,
        bsb || existingCampaign.bsb || null,
        account || existingCampaign.account || null,
        bkash || existingCampaign.bkash || null,
        rocket || existingCampaign.rocket || null,
        nagad || existingCampaign.nagad || null,
        upay || existingCampaign.upay || null,
        perk_title || existingCampaign.perk_title || null,
        perk_description || existingCampaign.perk_description || null,
        perk_img || null,
        perk_price || existingCampaign.perk_price || null,
        perk_retail_price || existingCampaign.perk_retail_price || null,
        perk_date || existingCampaign.perk_date || null,
        nid_front || null,
        nid_back || null,
        passport || null,
        fb_url || existingCampaign.fb_url || null,
        twitter_url || existingCampaign.twitter_url || null,
        yt_url || existingCampaign.yt_url || null,
        website_url || existingCampaign.website_url || null,
        existingCampaign.amount_raised,
        0,
        existingCampaign.is_prelaunch,
        existingCampaign.is_personal,
        existingCampaign.is_business,
        existingCampaign.no_followers,
        existingCampaign.no_donors,
        campaignId
      ];

      // Build the SQL query for inserting into edit_campaigns
      const insertSql = `INSERT INTO edit_campaigns (${insertFields}) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?  )`;
      console.log("insertFields length", insertFields.length);
      console.log("insertValues length", insertValues.length);
      // console.log("Insertvalues", insertValues);
      // console.log("insertSql", insertSql);
      if (insertFields.length !== insertValues.length) {
        console.error('Number of fields and values do not match.');
      } else {
        // Insert the data into the edit_campaigns table
        const insertResult = await projectModel.insertEditCampaign(insertSql, insertValues, campaignId, req.session.user.email);
        if (insertResult) {

          console.log('Data updated successfully:', insertResult);
          res.redirect('/notification');
        }
      }
    }
    catch (error) {
      console.log(error)
    }

  });

router.post(
  '/edit-business/:campaignId',
  [
    upload.fields([
      { name: 'file1', maxCount: 1 },
      { name: 'file2', maxCount: 1 },
      { name: 'file3', maxCount: 1 },
      { name: 'file4', maxCount: 1 },
      { name: 'file5', maxCount: 1 },
      { name: 'file6', maxCount: 1 },
      { name: 'file7', maxCount: 1 },
      { name: 'file8', maxCount: 1 },
      { name: 'file9', maxCount: 1 },
      { name: 'file10', maxCount: 1 },
      { name: 'file11', maxCount: 1 },
      { name: 'file12', maxCount: 1 },
      { name: 'file13', maxCount: 1 },
      { name: 'file14', maxCount: 1 },
      { name: 'file15', maxCount: 1 },
    ]),
  ],
  async (req, res) => {
    try {
      console.log(req.body);
      console.log(req.files);
      const { campaignId } = req.params;
      const {
        title,
        city,
        state,
        type,
        tagline,
        description,
        campaign_video,
        feature,
        goal_amount,
        goal_date,
        bsb,
        account,
        bkash,
        rocket,
        nagad,
        upay,
        perk_title,
        perk_description,
        perk_price,
        perk_retail_price,
        perk_date,
        fb_url,
        twitter_url,
        yt_url,
        website_url,
      } = req.body;
      const existingCampaign = await projectModel.getSingleCampaignById(campaignId)
      console.log("existing campaign", existingCampaign);
      // const email = req.session.user.email;
      const existingDoc = await adminModel.getDocsById(campaignId)
      console.log("existing doc", existingDoc);
      // Access uploaded files
      const campaign_img = req.files.file1 !== undefined ? req.files.file1[0].filename : existingCampaign.campaign_img;
      const feature_img = req.files.file2 !== undefined ? req.files.file2[0].filename : existingCampaign.feature_img;
      const perk_img = req.files.file3 !== undefined ? req.files.file3[0].filename : existingCampaign.perk_img;
      const nid_front = req.files.file4 !== undefined ? req.files.file4[0].filename : existingCampaign.nid_front;
      const nid_back = req.files.file5 !== undefined ? req.files.file5[0].filename : existingCampaign.nid_back;
      const passport = req.files.file6 !== undefined ? req.files.file6[0].filename : existingCampaign.passport;
      const business_plan = req.files.file7 !== undefined ? req.files.file7[0].filename : existingDoc.business_plan;
      const project_budget = req.files.file8 !== undefined ? req.files.file8[0].filename : existingDoc.project_budget;
      const product_prototype = req.files.file9 !== undefined ? req.files.file9[0].filename : existingDoc.product_prototype;
      const legal_entity_verification = req.files.file10 !== undefined ? req.files.file10[0].filename : existingDoc.legal_entity_verification;
      const financial_statements = req.files.file11 !== undefined ? req.files.file11[0].filename : existingDoc.financial_statements;
      const intellectual_property = req.files.file12 !== undefined ? req.files.file12[0].filename : existingDoc.intellectual_property;
      const permits = req.files.file13 !== undefined ? req.files.file13[0].filename : existingDoc.permits;
      const contracts = req.files.file14 !== undefined ? req.files.file14[0].filename : existingDoc.contracts;
      const extras = req.files.file15 !== undefined ? req.files.file15[0].filename : existingDoc.extras;




      const insertFields = [
        'title', 'email', 'city', 'state', 'type', 'tagline', 'description',
        'campaign_img', 'campaign_video', 'feature', 'feature_img', 'goal_amount', 'goal_date', 'bsb', 'account', 'bkash', 'rocket', 'nagad', 'upay', 'perk_title', 'perk_description', 'perk_img', 'perk_price', 'perk_retail_price', 'perk_date', 'nid_front', 'nid_back', 'passport', 'fb_url', 'twitter_url', 'yt_url', 'website_url', 'amount_raised', 'is_approved', 'is_prelaunch', 'is_personal', 'is_business', 'no_followers', 'no_donors', 'old_id'
      ];

      const insertFieldsDocs = ['email', 'bid', 'business_plan', 'project_budget', 'product_prototype', 'legal_entity_verification', 'financial_statements', 'intellectual_property', 'permits', 'contracts', 'extras', 'old_id'];

      const insertValues = [
        title || existingCampaign.title || null,
        req.session.user.email,
        city || existingCampaign.city || null,
        state || existingCampaign.state || null,
        type || existingCampaign.type || null,
        tagline || existingCampaign.tagline || null,
        description || existingCampaign.description || null,
        campaign_img || null,
        campaign_video || existingCampaign.campaign_video || null,
        feature || existingCampaign.feature || null,
        feature_img || null,
        goal_amount || existingCampaign.goal_amount || null,
        goal_date || existingCampaign.goal_date || null,
        bsb || existingCampaign.bsb || null,
        account || existingCampaign.account || null,
        bkash || existingCampaign.bkash || null,
        rocket || existingCampaign.rocket || null,
        nagad || existingCampaign.nagad || null,
        upay || existingCampaign.upay || null,
        perk_title || existingCampaign.perk_title || null,
        perk_description || existingCampaign.perk_description || null,
        perk_img || null,
        perk_price || existingCampaign.perk_price || null,
        perk_retail_price || existingCampaign.perk_retail_price || null,
        perk_date || existingCampaign.perk_date || null,
        nid_front || null,
        nid_back || null,
        passport || null,
        fb_url || existingCampaign.fb_url || null,
        twitter_url || existingCampaign.twitter_url || null,
        yt_url || existingCampaign.yt_url || null,
        website_url || existingCampaign.website_url || null,
        existingCampaign.amount_raised,
        0,
        existingCampaign.is_prelaunch,
        existingCampaign.is_personal,
        existingCampaign.is_business,
        existingCampaign.no_followers,
        existingCampaign.no_donors,
        campaignId
      ];



      // Build the SQL query for inserting into edit_campaigns
      const insertSql = `INSERT INTO edit_campaigns (${insertFields}) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?  )`;
      console.log("insertFields length", insertFields.length);
      console.log("insertValues length", insertValues.length);
      // console.log("Insertvalues", insertValues);
      // console.log("insertSql", insertSql);
      if (insertFields.length !== insertValues.length) {
        console.error('Number of fields and values do not match.');
      } else {
        // Insert the data into the edit_campaigns table
        const insertResult = await projectModel.insertEditCampaign(insertSql, insertValues, campaignId, req.session.user.email);
        console.log("insertResult", insertResult);
        console.log("edit_docs.old_id", existingDoc[0].id)
        if (insertResult) {
          const insertValuesDocs = [

            req.session.user.email,
            insertResult,
            business_plan || null,
            project_budget || null,
            product_prototype || null,
            legal_entity_verification || null,
            financial_statements || null,
            intellectual_property || null,
            permits || null,
            contracts || null,
            extras || null,
            existingDoc[0].id,
          ];
          console.log(insertValuesDocs)
          const insertSqlDocs = `INSERT INTO edit_docs (${insertFieldsDocs}) VALUES
          (? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,?)`;
          const insertResultDocs = await projectModel.insertEditDocs(insertSqlDocs, insertValuesDocs);
          if (insertResultDocs) {
            console.log('Data updated successfully:', insertResultDocs);
            res.redirect('/notification');
          }
          else {
            console.log("error inserting docs")
            res.render('error', { error: "Error inserting docs" })
          }
        }
      }
    }
    catch (error) {
      console.log(error)
    }

  });

module.exports = router
