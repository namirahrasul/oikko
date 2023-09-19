const fs = require('fs') // Import the fs module
const mysql = require('mysql2')
const { v4: uuidv4 } = require('uuid') // Import the UUID library
const path = require('path')
const multer = require('multer')
// const upload = multer({ dest: 'uploads/' });

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'oikko',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

function insertUserWithUniqueImagePath(
  req,
  title,
  city,
  state,
  type,
  description,
  campaign_img,
  campaign_video,
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
  callback
) {
  console.log(req.file)
  console.log(req.body)

  // Get a connection from the pool
  pool.getConnection((connectionErr, connection) => {
    if (connectionErr) {
      callback(connectionErr)
      return
    }

    // SQL query to insert user information and unique image path
    const sql =
      'INSERT INTO personal (title,city,state,type, description,campaign_img,campaign_video, goal_amount,goal_date,bsb,account,bkash,rocket,nagad,upay,perk_title,perk_description,perk_img,perk_price, perk_retail_price, perk_date, nid_front, nid_back,passport) VALUES (?, ?, ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?, ?, ?, ?, ?, ?,?)'

    // Execute the query with user information and unique image path
    connection.query(
      sql,
      [
        title,
        city,
        state,
        type,
        description,
        campaign_img,
        campaign_video,
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
      ],
      (queryErr, result) => {
        // Release the connection whether there was an error or not
        connection.release()

        if (queryErr) {
          callback(queryErr)
          return
        }

        callback(null, result)
      }
    )
  })
}

function insertBusinessCampaign(
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
  business_plan,
  project_budget,
  product_prototype,
  legal_entity_verification,
  financial_statements,
  intellectual_property,
  permits,
  contracts,
  extras,
  callback
) {
  console.log(req.file)
  console.log(req.body)

  // Get a connection from the pool
  pool.getConnection((connectionErr, connection) => {
    if (connectionErr) {
      callback(connectionErr)
      return
    }

    // SQL query to insert user information and unique image path
    const sql =
      'INSERT INTO business ( email, title,city,state,type,tagline,description, campaign_img,campaign_video,feature,feature_img,goal_amount, goal_date,bsb,account,bkash,rocket,nagad,upay,perk_title, perk_description,perk_img,perk_price,perk_retail_price,perk_date,nid_front,nid_back,passport, business_plan,project_budget, product_prototype,legal_entity_verification,financial_statements,intellectual_property, permits, contracts,extras) VALUES (?, ?, ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?, ?, ?, ?, ?, ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'

    // Execute the query with user information and unique image path
    connection.query(
      sql,
      [
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
        business_plan,
        project_budget,
        product_prototype,
        legal_entity_verification,
        financial_statements,
        intellectual_property,
        permits,
        contracts,
        extras,
      ],
      (queryErr, result) => {
        // Release the connection whether there was an error or not
        connection.release()

        if (queryErr) {
          callback(queryErr)
          return
        }

        callback(null, result)
      }
    )
  })
}

function insertPrelaunch(
  req,
  email,
  title,
  city,
  state,
  type,
  description,
  prelaunch_img,
  prelaunch_video,
  feature,
  feature_img,
  fb_url,
  twitter_url,
  yt_url,
  website_url,
  callback
) {
  console.log(req.file)
  console.log(req.body)

  // Get a connection from the pool
  pool.getConnection((connectionErr, connection) => {
    if (connectionErr) {
      callback(connectionErr)
      return
    }
   

    // SQL query to insert user information and unique image path
    const sql2 =
      'INSERT INTO prelaunch ( email, title, city, state, type, description, prelaunch_img,prelaunch_video, feature, feature_img, fb_url, twitter_url, yt_url, website_url) VALUES (?, ?, ?,?,?,?,?,?,?,?,?,?,?,?)'

    // Execute the query with user information and unique image path
    connection.query(
      sql2,
      [
        email,
        title,
        city,
        state,
        type,
        description,
        prelaunch_img,
        prelaunch_video,
        feature,
        feature_img,
        fb_url,
        twitter_url,
        yt_url,
        website_url,
      ],
      (queryErr, result) => {
        // Release the connection whether there was an error or not
        connection.release()
          pool.getConnection((connectionErr, connection) => {
            if (connectionErr) {
              callback(connectionErr)
              return
          }
            prid = result.insertId
            console.log(prid)
            cid=-1

            const sql = 'INSERT INTO project (prid,cid) VALUES (?,?)'
                connection.query(
            sql,
            [
              prid,cid
            ],
                  (queryErr, result) => {
                      connection.release()
                    if (queryErr) {
                      callback(queryErr)
                      return
                    }
                  })
          })

        callback(null, result)
      }
    )
  })
}

module.exports = {
  insertUserWithUniqueImagePath,
  insertPrelaunch,
  insertBusinessCampaign,
}