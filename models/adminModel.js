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
    const sql = `SELECT campaigns.id,campaigns.email,title,city,state,type,tagline, description, campaign_img, campaign_video, feature, feature_img, goal_amount,  DATE_FORMAT(goal_date, '%d %M %Y')  as goal_d , bsb,account, bkash, rocket, nagad, upay, perk_title, perk_description, perk_img, perk_price, perk_retail_price, perk_date, fb_url,twitter_url,yt_url, website_url,amount_raised,is_prelaunch,is_business,is_personal,is_approved, no_followers,no_donors,nid_front,nid_back,passport,business_plan,project_budget,product_prototype,legal_entity_verification,financial_statements,intellectual_property,permits,contracts,extras FROM campaigns LEFT JOIN docs ON campaigns.id=docs.bid WHERE is_approved=0 and is_deleted=0`

    const [rows, fields] = await pool.execute(sql) // Replace 'campaigns' with your table name
    return rows
  } catch (error) {
    throw error
  }
}


async function getUsers() {
  try {
    const sql = `SELECT * from users where is_admin=0 and email_verified=1 and is_blocked=0`
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

async function blockUser(email,reason) {
  try {
    const sql =
      'update users set email_verified=0, is_blocked = 1 WHERE email = ?'
    const [rows, fields] = await pool.execute(sql, [email]);
    const sql2 = `insert into blocked_users (email,reason) values (?,?)`
    const [rows2, fields2] = await pool.execute(sql2, [email, reason]);
    return rows2.affectedRows; // Return the number of affected rows (1 if successful, 0 if no rows were updated)
  } catch (error) {
    console.error('Error blocking user:', error);
    throw error;
  }
}

async function declineCampaign(id) {
  try {
    const sql =
      'UPDATE campaigns set is_deleted=1 WHERE id = ?'
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
async function requestDelete(id, reason,email) {
  try {
    console.log("id ", id)
    console.log("reason ", reason)
    const sql = `INSERT INTO delete_campaign (cid,reason) VALUES (?,?)`
    const [rows, fields] = await pool.execute(sql, [id, reason]);
    const sql2 = `INSERT INTO admin_notifs (cid,is_delete,email) VALUES (?,?,?)`
    const [rows2, fields2] = await pool.execute(sql2, [id, 1, email]);
    return rows2.affectedRows; // Return the number of affected rows (1 if successful, 0 if no rows were updated)
  } catch (error) {
    console.error('Error inserting into delete', error);
    throw error;
  }
}

async function declineEdit(id) {
  try {
    const sql2 = 'SELECT * from edit_campaigns where id = ?'
    const [rows2, fields2] = await pool.execute(sql2, [id]);
    const old_id = rows2[0].old_id;
    const sql =
      'UPDATE edit_campaigns set is_approved=1 WHERE id = ?'
    const [rows, fields] = await pool.execute(sql, [id]);
    const sql3 = 'UPDATE campaigns set is_approved=1 WHERE id = ?'
    const [rows3, fields3] = await pool.execute(sql3, [old_id]);
    // const getEmail = `SELECT email FROM edit_campaigns WHERE id = ?`
    // const sql2 = 'INSERT INTO admin_notifs (cid,email,is_delete,is_edit,is_approved) VALUES  (?,?,?,?,?)'
    // const [rows2, fields2] = await pool.execute(sql2, [id, getEmail[0].email, 0, 1, 0]);

    return rows3.affectedRows; // Return the number of affected rows (1 if successful, 0 if no rows were updated)
  } catch (error) {
    console.error('Error declining campaign', error);
    throw error;
  }
}
async function approveEdit(id) {
  console.log("id ", id)
  try {
    const sql =
      'UPDATE edit_campaigns set is_approved=1 WHERE id = ?'

    const [rows, fields] = await pool.execute(sql, [id]);
    const newCampaign = `SELECT * FROM edit_campaigns WHERE id = ?`
    const newDoc = `SELECT * FROM edit_docs WHERE bid = ?`
    const updateOldCampaign =
      'UPDATE campaigns set title=?,city=?,state=?,type=?,tagline=?,description=?,campaign_img=?, campaign_video=?, feature=?, feature_img=?, goal_date=?,goal_amount=?,bsb=?,account=?,bkash=?,rocket=?,nagad=?,upay=?,perk_title=?,perk_description=?,perk_img=?,perk_price=?,perk_retail_price=?,perk_date=?,nid_front=?,nid_back=?,passport=?,fb_url=? , twitter_url=?,yt_url=?, website_url=? ,is_approved=1 WHERE id = ?'
    const [rows2, fields2] = await pool.execute(newCampaign, [id]);
    console.log("SELECT * FROM edit_campaigns WHERE id = ? ", rows2);
    const [rows4, fields4] = await pool.execute(updateOldCampaign, [rows2[0].title, rows2[0].city, rows2[0].state, rows2[0].type, rows2[0].tagline, rows2[0].description, rows2[0].campaign_img, rows2[0].campaign_video, rows2[0].feature, rows2[0].feature_img, rows2[0].goal_date, rows2[0].goal_amount, rows2[0].bsb, rows2[0].account, rows2[0].bkash, rows2[0].rocket, rows2[0].nagad, rows2[0].upay, rows2[0].perk_title, rows2[0].perk_description, rows2[0].perk_img, rows2[0].perk_price, rows2[0].perk_retail_price, rows2[0].perk_date, rows2[0].nid_front, rows2[0].nid_back, rows2[0].passport, rows2[0].fb_url, rows2[0].twitter_url, rows2[0].yt_url, rows2[0].website_url, rows2[0].old_id]);
    if (rows2[0].is_business === 1) {
      const [rows3, fields3] = await pool.execute(newDoc, [id]);
      console.log("SELECT * FROM edit_docs WHERE bid = ?", rows3);

      const updateOldDoc =
        'UPDATE docs set business_plan=?,project_budget=?,product_prototype=?,legal_entity_verification=?,financial_statements=?,intellectual_property=?,permits=?,contracts=?,extras=? WHERE bid = ?'
      const [rows5, fields5] = await pool.execute(updateOldDoc, [rows3[0].business_plan, rows3[0].project_budget, rows3[0].product_prototype, rows3[0].legal_entity_verification, rows3[0].financial_statements, rows3[0].intellectual_property, rows3[0].permits, rows3[0].contracts, rows3[0].extras, rows2[0].old_id]);
    }
    console.log("rows2[0].old_id ", rows2[0].old_id)
    console.log("rows2[0].email ", rows2[0].email)
    const insert = 'INSERT INTO admin_notifs (cid,email,is_edit,is_approved) VALUES  (?,?,?,?)'
    const [rows6, fields6] = await pool.execute(insert, [rows2[0].old_id, rows2[0].email, 1, 1]);
    return rows6.affectedRows; // Return the number of affected rows (1 if successful, 0 if no rows were updated)
  } catch (error) {
    console.error('Error declining campaign', error);
    throw error;
  }
}
async function declineDelete(id) {
  try {
    const sql = 'UPDATE delete_campaign set is_approved=1 WHERE cid = ?'
    const [rows, fields] = await pool.execute(sql, [id])
    const getEmail = `SELECT email FROM campaigns WHERE id = ?`
    const [rows2, fields2] = await pool.execute(getEmail, [id])
    // const insert = 'INSERT INTO admin_notifs (cid,email,is_delete,is_edit,is_approved) VALUES  (?,?,?,?,?)'
    // const [rows6, fields6] = await pool.execute(insert, [id, rows2[0].email, 1, 0, 0]);
    return rows2.affectedRows; // Return the number of affected rows (1 if successful, 0 if no rows were updated)
  } catch (error) {
    console.error('Error declining campaign', error);
    throw error;
  }
}
async function approveDelete(id) {
  try {
    const sql = 'UPDATE campaigns set is_approved=0 and is_deleted=1 WHERE id = ?'
    const [rows, fields] = await pool.execute(sql, [id])
    const getEmail = `SELECT email FROM campaigns WHERE id = ?`
    const [rows2, fields2] = await pool.execute(getEmail, [id])
    const insert = 'INSERT INTO admin_notifs (cid,email,is_delete,is_approved) VALUES  (?,?,?,?)'
    const [rows6, fields6] = await pool.execute(insert, [id, rows2[0].email, 1, 1]);

    return rows6.affectedRows; // Return the number of affected rows (1 if successful, 0 if no rows were updated)

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

async function insertRejectData(email, cid) {
  try {
    const sql = `INSERT INTO reject (email,cid) VALUES (?,?)`;
    const [rows, fields] = await pool.execute(sql, [email, cid]) // Replace 'campaigns' with your table name
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

async function markCampaignReviewed(id, email) {
  try {
    const sql =
      'UPDATE reports set is_approved=1 WHERE id = ?'
    const [rows, fields] = await pool.execute(sql, [id]);
    const sql2 =
      'INSERT INTO reported_notifs (email,rid) VALUES  (?,?)'
    const [rows2, fields2] = await pool.execute(sql2, [email, id]);
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

async function selectEditRequests() {
  try {
    const sql = `SELECT
    campaigns.id AS o_id,
    campaigns.email AS o_email,
    campaigns.title AS o_title,
    campaigns.city AS o_city,
    campaigns.state AS o_state,
    campaigns.type AS o_type,
    campaigns.tagline AS o_tagline,
    campaigns.description AS o_description,
    campaigns.campaign_img AS o_campaign_img,
    campaigns.campaign_video AS o_campaign_video,
    campaigns.feature AS o_feature,
    campaigns.feature_img AS o_feature_img,
    campaigns.goal_amount AS o_goal_amount,
    DATE_FORMAT(campaigns.goal_date, '%d %M %Y') AS o_goal_d,
    campaigns.bsb AS o_bsb,
    campaigns.account AS o_account,
    campaigns.bkash AS o_bkash,
    campaigns.rocket AS o_rocket,
    campaigns.nagad AS o_nagad,
    campaigns.upay AS o_upay,
    campaigns.perk_title AS o_perk_title,
    campaigns.perk_description AS o_perk_description,
    campaigns.perk_img AS o_perk_img,
    campaigns.perk_price AS o_perk_price,
    campaigns.perk_retail_price AS o_perk_retail_price,
    campaigns.perk_date AS o_perk_date,
    campaigns.fb_url AS o_fb_url,
    campaigns.twitter_url AS o_twitter_url,
    campaigns.yt_url AS o_yt_url,
    campaigns.website_url AS o_website_url,
    campaigns.amount_raised AS o_amount_raised,
    campaigns.is_prelaunch AS o_is_prelaunch,
    campaigns.is_business AS o_is_business,
    campaigns.is_personal AS o_is_personal,
    campaigns.is_approved AS o_is_approved,
    campaigns.no_followers AS o_no_followers,
    campaigns.no_donors AS o_no_donors,
    campaigns.nid_front AS o_nid_front,
    campaigns.nid_back AS o_nid_back,
    campaigns.passport AS o_passport,
    docs.business_plan AS o_business_plan,
    docs.project_budget AS o_project_budget,
    docs.product_prototype AS o_product_prototype,
    docs.legal_entity_verification AS o_legal_entity_verification,
    docs.financial_statements AS o_financial_statements,
    docs.intellectual_property AS o_intellectual_property,
    docs.permits AS o_permits,
    docs.contracts AS o_contracts,
    docs.extras AS o_extras,
    edit_campaigns.id AS n_id,
    edit_campaigns.email AS n_email,
    edit_campaigns.title AS n_title,
    edit_campaigns.city AS n_city,
    edit_campaigns.state AS n_state,
    edit_campaigns.type AS n_type,
    edit_campaigns.tagline AS n_tagline,
    edit_campaigns.description AS n_description,
    edit_campaigns.campaign_img AS n_campaign_img,
    edit_campaigns.campaign_video AS n_campaign_video,
    edit_campaigns.feature AS n_feature,
    edit_campaigns.feature_img AS n_feature_img,
    edit_campaigns.goal_amount AS n_goal_amount,
    DATE_FORMAT(campaigns.goal_date, '%d %M %Y') AS n_goal_d,
    edit_campaigns.bsb AS n_bsb,
    edit_campaigns.account AS n_account,
    edit_campaigns.bkash AS n_bkash,
    edit_campaigns.rocket AS n_rocket,
    edit_campaigns.nagad AS n_nagad,
    edit_campaigns.upay AS n_upay,
    edit_campaigns.perk_title AS n_perk_title,
    edit_campaigns.perk_description AS n_perk_description,
    edit_campaigns.perk_img AS n_perk_img,
    edit_campaigns.perk_price AS n_perk_price,
    edit_campaigns.perk_retail_price AS n_perk_retail_price,
    edit_campaigns.perk_date AS n_perk_date,
    edit_campaigns.fb_url AS n_fb_url,
    edit_campaigns.twitter_url AS n_twitter_url,
    edit_campaigns.yt_url AS n_yt_url,
    edit_campaigns.website_url AS n_website_url,
    edit_campaigns.amount_raised AS n_amount_raised,
    edit_campaigns.is_prelaunch AS n_is_prelaunch,
    edit_campaigns.is_business AS n_is_business,
    edit_campaigns.is_personal AS n_is_personal,
    edit_campaigns.is_approved AS n_is_approved,
    edit_campaigns.no_followers AS n_no_followers,
    edit_campaigns.no_donors AS n_no_donors,
    edit_campaigns.nid_front AS n_nid_front,
    edit_campaigns.nid_back AS n_nid_back,
    edit_campaigns.passport AS n_passport,
    edit_docs.business_plan AS n_business_plan,
    edit_docs.project_budget AS n_project_budget,
    edit_docs.product_prototype AS n_product_prototype,
    edit_docs.legal_entity_verification AS n_legal_entity_verification,
    edit_docs.financial_statements AS n_financial_statements,
    edit_docs.intellectual_property AS n_intellectual_property,
    edit_docs.permits AS n_permits,
    edit_docs.contracts AS n_contracts,
    edit_docs.extras AS n_extras
FROM
    campaigns
INNER JOIN
    edit_campaigns ON campaigns.id = edit_campaigns.old_id
LEFT JOIN
    docs ON campaigns.id = docs.bid
LEFT JOIN
    edit_docs ON edit_campaigns.id = edit_docs.bid
    where edit_campaigns.is_approved=0
    `

    const [rows, fields] = await pool.execute(sql)
    return rows;
  } catch (error) {
    throw error;
  }

}
async function getCampaignEmailById(campaignId) {
  try {
    const sql = `SELECT email FROM campaigns WHERE id = ?`;
    const [rows, fields] = await pool.execute(sql, [campaignId]) // Replace 'campaigns' with your table name
    //  return rows
    if (rows.length > 0) {
      return rows[0].email;
    } else {
      return null; // Or handle the case when there is no matching campaign ID
    }
  } catch (error) {
    throw error
  }
}

async function insertApproveData(email, cid) {
  try {
    const sql = `INSERT INTO approve (email,cid) VALUES (?,?)`;
    const [rows, fields] = await pool.execute(sql, [email, cid]) // Replace 'campaigns' with your table name
    return rows
  } catch (error) {
    throw error
  }
}



async function getNotif(notif) {
  try {
    const [rows, fields] = await pool.execute(`SELECT
      a.aid,
      u.name,
      b.title,
      b.email,
      TIME(a.atime) as tt,
      a.is_follow,
      a.is_donate,
      a.amount,
      a.is_approve,
      CONCAT(
        DATE_FORMAT(a.atime, '%D'), 
        DATE_FORMAT(a.atime, ' %M')
      ) as dd
    FROM approve as a
    JOIN campaigns as b ON a.cid = b.id
    JOIN users as u ON a.email = u.email
    where b.email=(?)
    UNION
    SELECT
    r.rid,
    u.name,
    b.title,
    b.email,
    TIME(r.rtime) as tt,
    r.is_follow,
    r.is_donate,
    r.amount,
    r.is_approve,
    CONCAT(
      DATE_FORMAT(r.rtime, '%D'), 
      DATE_FORMAT(r.rtime, ' %M')
    ) as dd
  FROM reject as r
  JOIN campaigns as b ON r.cid = b.id
  JOIN users as u ON r.email = u.email
  where b.email=(?) and b.is_deleted= 1
    ORDER BY tt DESC`, [notif, notif])
    return rows
  } catch (error) {
    throw error
  }
}
async function selectDeleteRequests() {
  try {
    const sql = `SELECT  delete_campaign.id as did, cid, reason, campaigns.email, campaigns.is_prelaunch, campaigns.is_business, campaigns.is_personal from delete_campaign INNER JOIN campaigns ON delete_campaign.cid=campaigns.id where delete_campaign.is_approved=0 order by time desc`;
    const [rows, fields] = await pool.execute(sql);
    return rows;
  } catch (error) {
    throw error;
  }
}
async function getDeleteRequestById(id) {
  try {
    const sql = `SELECT campaigns.title,delete_campaign.reason from delete_campaign INNER join campaigns on delete_campaign.cid=campaigns.id where delete_campaign.id = ?`;
    const [rows, fields] = await pool.execute(sql, [id]);
    return rows[0];
  } catch (error){
    throw error;
  }
}


module.exports = {
  getNotApprovedCampaigns,
  getNotApprovedCampaignsById,
  approveCampaign,
  getUsers,
  createAdmin,
  blockUser,
  declineCampaign,
  getDocsById,
  getNotApprovedReports,
  markCampaignReviewed,
  getReportById,

  declineEdit,
  approveEdit,
  declineDelete,
  approveDelete,
  requestDelete,
  selectEditRequests,
  getCampaignEmailById,
  insertApproveData,
  insertRejectData,
  getNotif,
  selectDeleteRequests,
  getDeleteRequestById,

}
