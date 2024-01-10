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
// Async function to insert data into the follownotif table
async function insertFollowData2(follower, cid) {
  try {
    // Define the SQL query
    const sql = 'INSERT INTO follownotif (follower, cid) VALUES (?, ?)';

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
//Async function to insert data into the goaldate table
async function insertGoalDatedata(mail, cid) {
  try {
    // Define the SQL query
    const sql = 'INSERT INTO goaldate (mail, cid) VALUES (?, ?)';

    // Execute the SQL query with the provided data using pool.query
    const [rows] = await pool.query(sql, [mail, cid])

    // Return the inserted row
    return rows
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      // Handle duplicate key error
      console.error(`Campaign already exists.`);
      return null; // You can return null or some other value to indicate the error
    }
    console.error('Error inserting data into follow table:', error)
    throw error
  }
}

// Async function to insert data into the goalamt table
async function insertGoalAmtdata(mail, cid) {
  try {
    // Define the SQL query
    const sql = 'INSERT INTO goalamt (mail, cid) VALUES (?, ?)';

    // Execute the SQL query with the provided data using pool.query
    const [rows] = await pool.query(sql, [mail, cid])

    // Return the inserted row
    return rows
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      // Handle duplicate key error
      console.error(`Campaign already exists.`);
      return null; // You can return null or some other value to indicate the error
    }
    console.error('Error inserting data into follow table:', error)
    throw error
  }
}


async function checkAndInsertData() {
  try {
    // Define the SQL query to check if the current date is greater than or equal to goal_date
    const checkSql = 'SELECT id,email FROM campaigns WHERE goal_date <= CURDATE() and is_approved=1';

    // Execute the SQL query with the provided data using pool.query
    const [rows] = await pool.query(checkSql);

    // Check if there are rows to insert
    if (rows.length > 0) {
      // Iterate through rows and call insertGoalDatedata function
      for (const row of rows) {
        const { email, id } = row;
        await insertGoalDatedata(email, id);
      }
    }
  } catch (error) {
    console.error('Error checking and inserting data:', error);
    throw error;
  }
}


async function checkAndInsertGoalAmtData() {
  try {
    // Define the SQL query to check if the current date is greater than or equal to goal_date
    const checkSql = 'SELECT id,email FROM campaigns WHERE amount_raised >= goal_amount and is_approved=1';

    // Execute the SQL query with the provided data using pool.query
    const [rows] = await pool.query(checkSql);

    // Check if there are rows to insert
    if (rows.length > 0) {
      // Iterate through rows and call insertGoalDatedata function
      for (const row of rows) {
        const { email, id } = row;
        await insertGoalAmtdata(email, id);
      }
    }
  } catch (error) {
    console.error('Error checking and inserting data:', error);
    throw error;
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

async function IncreaseCampaignFollowersById(id) {
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

async function DecreaseCampaignFollowersById(id) {
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
  FROM follownotif as f
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
  ORDER BY tt DESC`, [notif, notif])
    return rows
  } catch (error) {
    throw error
  }
}

async function getMyCampaign(myCamp) {
  try {
    const sql = `SELECT id,email,title,city,state,type,tagline, description, campaign_img, campaign_video, feature, feature_img, goal_amount,  DATE_FORMAT(goal_date, '%d %M %Y')  as goal_d , bsb,account, bkash, rocket, nagad, upay, perk_title, perk_description, perk_img, perk_price, perk_retail_price, perk_date, fb_url,twitter_url,yt_url, website_url,amount_raised,is_prelaunch,is_business,is_personal,is_approved, no_followers,no_donors FROM campaigns where email=(?) and is_approved=1`
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
    const sql = `select count(*) as count from follow where follower = ? and cid = ? `
    const [rows, fields] = await pool.execute(
      sql,
      [followerId, campaignId]
    )
    // Assuming rows[0].count is the count value returned by the query
    return rows;

    // Return true if count is 1, false otherwise
    
  } catch (error) {
    throw error
  }
}

async function getGoalDateNotif(notif) {
  try {
    const [rows, fields] = await pool.execute(`SELECT
    g.dtid,
    u.name,
    b.title,
    b.email,
    TIME(g.dt_time) as tt,
    g.is_follow,
    g.is_donate,
    g.amount,
    g.is_goaldate_reached,
    CONCAT(
      DATE_FORMAT(g.dt_time, '%D'), 
      DATE_FORMAT(g.dt_time, ' %M')
    ) as dd
  FROM goaldate as g
  JOIN campaigns as b ON g.cid = b.id
  JOIN users as u ON g.mail = u.email
  where b.email=(?)
  ORDER BY tt DESC`, [notif])
    return rows
  } catch (error) {
    throw error
  }
}

async function getGoalAmtNotif(notif) {
  try {
    const [rows, fields] = await pool.execute(`SELECT
    gm.amtid,
    u.name,
    b.title,
    b.email,
    TIME(amttime) as tt,
    gm.is_follow,
    gm.is_donate,
    gm.amount,
    gm.is_goalAmt_reached,
    CONCAT(
      DATE_FORMAT(gm.amttime, '%D'), 
      DATE_FORMAT(gm.amttime, ' %M')
    ) as dd
  FROM goalamt as gm
  JOIN campaigns as b ON gm.cid = b.id
  JOIN users as u ON gm.mail = u.email
  where b.email=(?)
  ORDER BY tt DESC`, [notif])
    return rows
  } catch (error) {
    throw error
  }
}

async function getAdminNotifs(email) {
  try {
    const sql = `SELECT campaigns.title,admin_notifs.id,admin_notifs.is_approved,admin_notifs.is_edit,admin_notifs.is_delete,admin_notifs.is_create,admin_notifs.is_report FROM admin_notifs  INNER JOIN campaigns ON admin_notifs.cid=campaigns.id where campaigns.email=?`;
    const [rows, fields] = await pool.execute(sql, [email])
    return rows;
  }
  catch (error) {

    console.log("failed to fetch from admin notifs")
    throw error;
  }
}

async function getReportNotifs(email) {
  try {
    const sql = `SELECT campaigns.title,reports.is_approved FROM reported_notifs INNER JOIN reports on reported_notifs.rid=reports.id INNER JOIN campaigns ON reports.campaign_id=campaigns.id where reports.email=?`;
    const [rows, fields] = await pool.execute(sql, [email])
    return rows;
  }
  catch (error) {

    console.log("failed to fetch from report review notifs")
    throw error;
  }
}

async function getCampaignCreatorReportNotifs(email) {
  try {
    const sql = `SELECT campaigns.title, reports.is_approved FROM reports INNER JOIN campaigns ON reports.campaign_id=campaigns.id where campaigns.email=?`;
    const [rows, fields] = await pool.execute(sql, [email])
    return rows;
  }
  catch (error) {

    console.log("failed to fetch from report campaign creator notifs")
    throw error;
  }
}

module.exports = {
  insertFollowData,
  deleteFollowData,
  getNotifById,
  getMyCampaign,
  getMyFollow,
  IncreaseCampaignFollowersById,
  deleteCampaignFollowersById,
  checkIfFollowing,
  insertFollowData2,
  checkAndInsertData,
  checkAndInsertGoalAmtData,
  getGoalDateNotif,
  getGoalAmtNotif,
  insertGoalDatedata,
  insertGoalAmtdata,
  getAdminNotifs,
  getCampaignCreatorReportNotifs,
  getReportNotifs,
  DecreaseCampaignFollowersById

}