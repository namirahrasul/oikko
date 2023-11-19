const bcrypt = require('bcrypt')

const { v4: uuidv4 } = require('uuid')
// Use 'bcryptjs' to hash and salt passwords
const mysql = require('mysql2/promise') // Use 'mysql2' with promises

// Configure your MySQL connection
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


async function getNotApprovedCampaignsById(campaignId) {
 try {
  const sql = `SELECT id,email,title,city,state,type,tagline, description, campaign_img, campaign_video, feature, feature_img, goal_amount,  DATE_FORMAT(goal_date,  '%d %M %Y')  as goal_d, bsb,account, bkash, rocket, nagad, upay, perk_title, perk_description, perk_img, perk_price, perk_retail_price, perk_date, fb_url,twitter_url,yt_url, website_url,amount_raised,is_prelaunch,is_business,is_personal,is_approved, no_followers,no_donors FROM campaigns WHERE id = ?`
  const [rows, fields] = await pool.execute(
   sql,
   [campaignId]
  )
  if (rows.length === 1) {
   return rows[0]
  } else {
   throw new Error('Campaign not found')
  }
 } catch (error) {
  throw error
 }
}


async function getNotApprovedCampaigns() {
 try {
  const sql = `SELECT campaigns.id,campaigns.email,title,city,state,type,tagline, description, campaign_img, campaign_video, feature, feature_img, goal_amount,  DATE_FORMAT(goal_date, '%d %M %Y')  as goal_d , bsb,account, bkash, rocket, nagad, upay, perk_title, perk_description, perk_img, perk_price, perk_retail_price, perk_date, fb_url,twitter_url,yt_url, website_url,amount_raised,is_prelaunch,is_business,is_personal,is_approved, no_followers,no_donors,nid_front,nid_back,passport,business_plan,project_budget,product_prototype,legal_entity_verification,financial_statements,intellectual_property,permits,contracts,extras FROM campaigns LEFT JOIN docs ON campaigns.id=docs.bid WHERE is_approved=0`

  const [rows, fields] = await pool.execute(sql) // Replace 'campaigns' with your table name
  return rows
 } catch (error) {
  throw error
 }
}

async function getUsers() {
 try {
  const sql = `SELECT * from users where is_admin=0 and email_verified=1`
  const [rows, fields] = await pool.execute(sql) // Replace 'campaigns' with your table name
  return rows
 } catch (error) {
  throw error
 }
}

async function createAdmin(name, email, password) {
 try {
  // Hash and salt the password using bcrypt
  hashedPassword = await bcrypt.hash(password, 10) // 10 is the number of salt rounds
  const sql =
   'INSERT INTO users (name, email, password, email_verified, is_admin) VALUES (?, ?, ?, ?, ?)'
  const [rows, fields] = await pool.execute(sql, [name, email, hashedPassword, 0, 1]);

  return rows.affectedRows; // Return the number of affected rows (1 if successful, 0 if no rows were updated)
 } catch (error) {
  console.error('Error creating admin:', error);
  throw error;
 }
}

async function deleteUser(email) {
 try {
  const sql =
   'DELETE FROM users WHERE email = ?'
  const [rows, fields] = await pool.execute(sql, [email]);

  return rows.affectedRows; // Return the number of affected rows (1 if successful, 0 if no rows were updated)
 } catch (error) {
  console.error('Error deleting user:', error);
  throw error;
 }
}

async function declineCampaign(id) {
 try {
  const sql =
   'DELETE FROM campaigns WHERE id = ?'
  const [rows, fields] = await pool.execute(sql, [id]);

  return rows.affectedRows; // Return the number of affected rows (1 if successful, 0 if no rows were updated)
 } catch (error) {
  console.error('Error declining campaign', error);
  throw error;
 }
}
async function approveCampaign(id) {
 try {
  const sql =
   'UPDATE campaigns set is_approved=1 WHERE id = ?'
  const [rows, fields] = await pool.execute(sql, [id]);

  return rows.affectedRows; // Return the number of affected rows (1 if successful, 0 if no rows were updated)
 } catch (error) {
  console.error('Error declining campaign', error);
  throw error;
 }
}

async function getDocsById(campaignId) {
 try {
  const sql = `SELECT * from docs where bid = ?`
  const [rows, fields] = await pool.execute(sql, [campaignId]) // Replace 'campaigns' with your table name
  return rows
 } catch (error) {
  throw error
 }
}

async function getNotApprovedReports() {
 try {
  const sql = `SELECT
  reports.id as rid,
  campaign_id,
  reports.email,
  reports.title,
  reports.description,
  evidence,
  reports.time,
  users.name,
  is_prelaunch,
  is_personal,
  is_business
FROM
  users
INNER JOIN
  reports ON users.email = reports.email
INNER JOIN
  campaigns ON campaigns.id = reports.campaign_id
WHERE
  reports.is_approved = 0`

  const [rows, fields] = await pool.execute(sql) // Replace 'campaigns' with your table name
  return rows
 } catch (error) {
  throw error
 }
}

async function markCampaignReviewed(id,email) {
 try {
  const sql =
   'UPDATE reports set is_approved=1 WHERE id = ?'
  const [rows, fields] = await pool.execute(sql, [id]);
  const sql2 =
   'INSERT INTO reported_notifs (email,rid) VALUES  (?,?)'
  const [rows2, fields2] = await pool.execute(sql2, [email,id]);
  return rows.affectedRows; // Return the number of affected rows (1 if successful, 0 if no rows were updated)
 } catch (error) {
  console.error('Error declining campaign', error);
  throw error;
 }
}

async function getReportById(id) {
 try {
  const sql = `SELECT * from reports where id = ?`;
  const [rows, fields] = await pool.execute(sql, [id]);
  return rows[0];
 } catch {
  throw error;
 }
}



module.exports = {
 getNotApprovedCampaigns,
 getNotApprovedCampaignsById,
 approveCampaign,
 getUsers,
 createAdmin,
 deleteUser,
 declineCampaign,
 getDocsById,
 getNotApprovedReports,
 markCampaignReviewed,
 getReportById
}
