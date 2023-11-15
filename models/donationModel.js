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

// Async function to insert data into the donation table
async function insertDonationData(donor, cid, amount) {
    try {
        // Define the SQL query
        const sql = 'INSERT INTO donation (donor, cid, amount) VALUES (?, ?, ?)';

        // Execute the SQL query with the provided data using pool.query
        const [rows] = await pool.query(sql, [donor, cid, amount])

        // Return the inserted row
        return rows
    } catch (error) {
        console.error('Error inserting data into follow table:', error)
        throw error
    }
}


async function updateCampaignDonorsById(id) {
  try {


    // Define the SQL update query
    const sql = 'UPDATE campaigns SET no_donors = no_donors + 1 WHERE id = ?';

    // Execute the update query with the provided uniqueId
    const [rows, fields] = await pool.query(sql, [id]);

    return rows.affectedRows; // Return the number of affected rows (1 if successful, 0 if no rows were updated)
  } catch (error) {
    console.error('Error updating data:', error);
    throw error;
  }
}


async function getNotifByDonation(notif) {
  try {
    const [rows, fields] = await pool.execute(`SELECT
    d.donationid,
    u.name,
    b.title,
    b.email,
    TIME(d.dtime) as tt,
    CONCAT(
      DATE_FORMAT(d.dtime, '%D'), 
      DATE_FORMAT(d.dtime, ' %M')
    ) as dd
  FROM donation as d
  JOIN campaigns as b ON d.cid = b.id
  JOIN users as u ON d.donor = u.email
  where b.email=(?)
  ORDER BY dtime`,[notif]) 
    return rows
  } catch (error) {
    throw error
  }
}

async function getMyDonation(myCamp){
  try {
    const sql = `select d.donor, d.donationid, id,email,title,city,state,type,tagline, description, campaign_img, campaign_video, feature, feature_img, goal_amount,  DATE_FORMAT(goal_date, '%d %M %Y')  as goal_d , bsb,account, bkash, rocket, nagad, upay, perk_title, perk_description, perk_img, perk_price, perk_retail_price, perk_date, fb_url,twitter_url,yt_url, website_url,amount_raised,is_prelaunch,is_business,is_personal,is_approved, no_followers,no_donors FROM donation as d join campaigns on d.cid=id where d.donor=(?)`;

    const [rows, fields] = await pool.execute(sql,[myCamp]) 
    return rows
  } catch (error) {
    throw error
  }
}

async function increaseAmountRaised(id){
  try {
    // Define the SQL update query
    const sql = `UPDATE campaigns
    SET amount_raised = amount_raised + (SELECT SUM(amount) FROM donation WHERE id = (?))
    WHERE id = (?)`;

    // Execute the update query with the provided uniqueId
    const [rows, fields] = await pool.query(sql, [id,id]);

    return rows.affectedRows; // Return the number of affected rows (1 if successful, 0 if no rows were updated)
  } catch (error) {
    console.error('Error updating data:', error);
    throw error;
  }
}
async function checkIfBacked(backerId, campaignId,) {
  try {
    const sql = `select count(*) from donation where donor = ? and cid = ?`
    const [rows, fields] = await pool.execute(
      sql,
      [backerId, campaignId]
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
    insertDonationData,
    getNotifByDonation,
    getMyDonation,
    updateCampaignDonorsById,
  increaseAmountRaised,
  checkIfBacked
}