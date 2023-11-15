const mysql = require('mysql2/promise')
const path = require('path')

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

// Async function to insert data into the follow table
async function insertFollowData(follower, cid) {
  try {
    // Define the SQL query
    const sql = 'INSERT INTO follow (follower, cid) VALUES (?, ?)';

    // Execute the SQL query with the provided data using pool.query
    const [rows] = await pool.query(sql, [follower, cid])

    // Return the inserted row
    return rows
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      // Handle duplicate key error
      console.error(`Duplicate key error: ${follower} already exists.`);
      return null; // You can return null or some other value to indicate the error
    }
    console.error('Error inserting data into follow table:', error)
    throw error
}
}

async function deleteFollowData(follower, cid) {
  try {
    // Define the SQL query to delete follow data
    const sql = 'DELETE FROM follow WHERE follower = ? and cid = ?';

    // Execute the SQL query with the provided data using pool.query
    const [rows] = await pool.query(sql, [follower, cid]);

    // Return the result of the deletion operation
    return rows;
  } catch (error) {
    console.error('Error deleting data from follow table:', error);
    throw error;
  }
}

async function updateCampaignFollowersById(id) {
  try {


    // Define the SQL update query
    const sql = 'UPDATE campaigns SET no_followers = no_followers + 1 WHERE id = ?';

    // Execute the update query with the provided uniqueId
    const [rows, fields] = await pool.query(sql, [id]);

    return rows.affectedRows; // Return the number of affected rows (1 if successful, 0 if no rows were updated)
  } catch (error) {
    console.error('Error updating data:', error);
    throw error;
  }
}

async function deleteCampaignFollowersById(id) {
  try {


    // Define the SQL update query
    const sql = 'UPDATE campaigns SET no_followers = no_followers - 1 WHERE id = ?';

    // Execute the update query with the provided uniqueId
    const [rows, fields] = await pool.query(sql, [id]);

    return rows.affectedRows; // Return the number of affected rows (1 if successful, 0 if no rows were updated)
  } catch (error) {
    console.error('Error updating data:', error);
    throw error;
  }
}




// Async function to retrieve data from the tables for notification
async function getNotifById(notif) {
  try {
    const [rows, fields] = await pool.execute(`SELECT
    f.fid,
    u.name,
    b.title,
    b.email,
    TIME(f.ftime) as tt,
    f.is_follow,
    f.is_donate,
    f.amount,
    CONCAT(
      DATE_FORMAT(f.ftime, '%D'), 
      DATE_FORMAT(f.ftime, ' %M')
    ) as dd
  FROM follow as f
  JOIN campaigns as b ON f.cid = b.id
  JOIN users as u ON f.follower = u.email
  where b.email=(?)
  UNION
  SELECT
    d.donationid,
    u.name,
    b.title,
    b.email,
    TIME(d.dtime) as tt,
    d.is_follow,
    d.is_donate,
    d.amount,
    CONCAT(
      DATE_FORMAT(d.dtime, '%D'), 
      DATE_FORMAT(d.dtime, ' %M')
    ) as dd
  FROM donation as d
  JOIN campaigns as b ON d.cid = b.id
  JOIN users as u ON d.donor = u.email
  where b.email=(?)
  ORDER BY tt DESC;`, [notif, notif])
    return rows
  } catch (error) {
    throw error
  }
}

async function getMyCampaign(myCamp) {
  try {
    const sql = `SELECT id,email,title,city,state,type,tagline, description, campaign_img, campaign_video, feature, feature_img, goal_amount,  DATE_FORMAT(goal_date, '%d %M %Y')  as goal_d , bsb,account, bkash, rocket, nagad, upay, perk_title, perk_description, perk_img, perk_price, perk_retail_price, perk_date, fb_url,twitter_url,yt_url, website_url,amount_raised,is_prelaunch,is_business,is_personal,is_approved, no_followers,no_donors FROM campaigns`
    const [rows, fields] = await pool.execute(sql, [myCamp])
    return rows
  } catch (error) {
    throw error
  }
}

async function getMyFollow(myFollow) {
  try {
    const sql = `select f.follower, f.cid, id,email,title,city,state,type,tagline, description, campaign_img, campaign_video, feature, feature_img, goal_amount,  DATE_FORMAT(goal_date, '%d %M %Y')  as goal_d , bsb,account, bkash, rocket, nagad, upay, perk_title, perk_description, perk_img, perk_price, perk_retail_price, perk_date, fb_url,twitter_url,yt_url, website_url,amount_raised,is_prelaunch,is_business,is_personal,is_approved, no_followers,no_donors FROM follow as f join campaigns on f.cid=id where f.follower=(?)`;

    const [rows, fields] = await pool.execute(sql, [myFollow])
    return rows
  } catch (error) {
    throw error
  }
}

async function checkIfFollowing(followerId, campaignId) {
  try {
    const sql = `select count(*) from follow where follower = ? and cid = ?`
    const [rows, fields] = await pool.execute(
      sql,
      [followerId, campaignId]
    )
    // Assuming rows[0].count is the count value returned by the query
    const count = rows[0].count;

    // Return true if count is 1, false otherwise
    return count === 1;
  } catch (error) {
    throw error
  }
}

module.exports = {
  insertFollowData,
  deleteFollowData,
  getNotifById,
  getMyCampaign,
  getMyFollow,
  updateCampaignFollowersById,
  deleteCampaignFollowersById,
  checkIfFollowing
}