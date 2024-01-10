const mysql = require('mysql2/promise');

const pool = mysql.createPool({
 host: 'localhost',
 user: 'root',
 password: 'root',
 database: 'oikko',
 port: 3306,
 waitForConnections: true,
 connectionLimit: 10,
 queueLimit: 0,
});

async function updateProfile(req, email, new_email, name, phone, profile_img, bio_description) {
 let sql = 'UPDATE users SET ';
 let values = [];

 if (new_email) {
  sql += 'email = ?, ';
  values.push(new_email);
 }
 if (name) {
  sql += 'name = ?, ';
  values.push(name);
 }
 if (phone) {
  sql += 'phone = ?, ';
  values.push(phone);
 }
 if (profile_img) {
  sql += 'profile_img = ?, ';
  values.push(profile_img);
 }


 if (bio_description) {
  sql += 'bio_description = ?, ';
  values.push(bio_description);
 }


 // Remove the trailing comma and space if there were any updates
 if (values.length > 0) {
  sql = sql.slice(0, -2); // Remove last two characters
 }

 sql += ' WHERE email = ?';
 values.push(email);

 try {
  const [rows, fields] = await pool.execute(sql, values);
  return rows.affectedRows; // This will contain information about the affected rows
 } catch (error) {
  throw error;
 }
}

async function deleteCampaign(campaignId) {
 try {
  const sql1 = `SELECT * FROM campaigns WHERE id = ?`;
  const [rows1, fields1] = await pool.execute(sql1, [campaignId]);
  const type = rows1[0].is_prelaunch
  const sql = `DELETE FROM campaigns WHERE id = ?`;
  if (!type) {
   const sql2 = `DELETE FROM docs WHERE bid = ?`;
   await pool.execute(sql2, [campaignId]);
  }
  const [rows, fields] = await pool.execute(sql, [campaignId]);
  return rows.affectedRows; // This will contain information about the affected rows
 } catch (error) {
  throw error;
 }
}

async function InsertReport(campaignId, email, title, description, evidence) {

 try {
  const sql = `INSERT INTO reports (campaign_id, email, title, description, evidence) VALUES (?, ?, ?, ?, ?)`;
  const [rows, fields] = await pool.execute(sql, [campaignId, email, title, description, evidence]);
  const sql2 = 'INSERT INTO admin_notifs (cid,email,is_report) VALUES (?, ?, ?)';
  const [rows2, fields2] = await pool.execute(sql2, [campaignId, email, 1]);
  return rows2.affectedRows; // This will contain information about the affected rows
 } catch (error) {
  throw error;
 }
}

async function InsertDelete(campaignId, email, reason) {
 console.log(campaignId, email, reason);
 try {
  const sql = `INSERT INTO delete_campaign (cid,reason) VALUES (?, ?)`;
  const [rows, fields] = await pool.execute(sql, [campaignId, reason]);
  const sql2 = 'INSERT INTO admin_notifs (cid,email,is_delete) VALUES (?, ?, ?)';
  const [rows2, fields2] = await pool.execute(sql2, [campaignId, email, 1]);
  return rows2.affectedRows;
  // This will contain information about the affected rows
 } catch (error) {
  throw error;
 }
}



async function getUserByEmail(email) {
 try {
  const sql = `SELECT * FROM users WHERE email = ?`;
  const [rows, fields] = await pool.execute(sql, [email]);
  return rows[0]; // This will contain information about the affected rows

 }
 catch (error) {
  throw error;

 }
}

async function getProfileImg(email) {
 try {
  const sql = `SELECT profile_img FROM users WHERE email = ?`;
  const [rows, fields] = await pool.execute(sql, [email]);
  return rows[0]; // This will contain information about the affected rows

 }
 catch (error) {
  throw error;

 }
}

async function getCountOfFollowedCampaigns(email) {

 try {
  const sql = `SELECT COUNT(*) AS count FROM follow WHERE follower = ? `;
  const [rows, fields] = await pool.execute(sql, [email]);
  return rows[0]; // This will contain information about the affected rows
 }
 catch (error) {
  throw error;
 }
}

async function getCountOfCreatedCampaigns(email) {

 try {
  const sql = `SELECT COUNT(*) AS count FROM campaigns WHERE email = ? and is_approved = 1 and is_deleted=0`;
  const [rows, fields] = await pool.execute(sql, [email]);
  return rows[0]; // This will contain information about the affected rows
 }
 catch (error) {
  throw error;
 }
}
async function getCountOfBackedCampaigns(email) {

 try {
  const sql = `SELECT COUNT(*) AS count FROM donation WHERE donor = ?  `;
  const [rows, fields] = await pool.execute(sql, [email]);
  return rows[0]; // This will contain information about the affected rows
 }
 catch (error) {
  throw error;
 }
}




module.exports = {
 updateProfile,
 deleteCampaign,
 InsertReport,
 getUserByEmail,
 getProfileImg,
 getCountOfFollowedCampaigns,
 getCountOfCreatedCampaigns,
 getCountOfBackedCampaigns,
 InsertDelete,
};
