// models/campaignModel.js
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


async function getCampaignById(campaignId) {
  try {
    const [rows, fields] = await pool.execute(
      'SELECT * FROM personal WHERE pid = ?',
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

async function getBusinessCampaignById(campaignId) {
  try {
    const [rows, fields] = await pool.execute(
      'SELECT * FROM business WHERE bid = ?',
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

async function getPrelaunchById(campaignId) {
  try {
    const [rows, fields] = await pool.execute(
      'SELECT * FROM prelaunch WHERE prid = ?',
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

async function getCampaigns() {
  try {
    const [rows, fields] = await pool.execute('SELECT * FROM personal') // Replace 'campaigns' with your table name
    return rows
  } catch (error) {
    throw error
  }
}
async function getBusinessCampaigns() {
  try {
    const [rows, fields] = await pool.execute('SELECT * FROM business') // Replace 'campaigns' with your table name
    return rows
  } catch (error) {
    throw error
  }
}
async function getPrelaunches() {
  try {
    const [rows, fields] = await pool.execute('SELECT * FROM prelaunch') // Replace 'campaigns' with your table name
    return rows
  } catch (error) {
    throw error
  }
}

module.exports = {
  getCampaignById,
  getCampaigns,
  getBusinessCampaigns,
  getPrelaunchById,
  getBusinessCampaignById,
  getPrelaunches,
}
