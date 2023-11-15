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

async function updateProfile(req, email, new_email, name, profile_img, bio_description) {
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
  return rows.affectedRows; // This will contain information about the affected rows
 } catch (error) {
  throw error;
 }
}



module.exports = {
 updateProfile,
 deleteCampaign,
 InsertReport
};
