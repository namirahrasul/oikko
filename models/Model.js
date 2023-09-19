const mysql = require('mysql2/promise')

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


async function createTables() {
  try {
    const connection = await pool.getConnection()

    // Execute DDL statements
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        email varchar(100) NOT NULL,
        name varchar(200) NOT NULL,
        password varchar(255) NOT NULL,
        email_verified varchar(45) NOT NULL DEFAULT '0',
        PRIMARY KEY (email),
        UNIQUE KEY email_UNIQUE (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
    `)

    await connection.query(`
      CREATE TABLE IF NOT EXISTS verification_tokens (
        id int NOT NULL AUTO_INCREMENT,
        email varchar(255) NOT NULL,
        token varchar(36) NOT NULL,
        expiration_timestamp datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY email (email),
        CONSTRAINT verification_tokens_ibfk_1 FOREIGN KEY (email) REFERENCES users (email) ON DELETE CASCADE
      ) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
    `)

    await connection.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        session_id varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
        expires int unsigned NOT NULL,
        data mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
        PRIMARY KEY (session_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
    `)

    await connection.query(`
      CREATE TABLE IF NOT EXISTS prelaunch (
        prid int NOT NULL AUTO_INCREMENT,
        email varchar(200) DEFAULT NULL,
        title varchar(200) DEFAULT NULL,
        city varchar(100) DEFAULT NULL,
        state varchar(100) DEFAULT NULL,
        type varchar(100) DEFAULT NULL,
        description varchar(2000) DEFAULT NULL,
        prelaunch_img varchar(200) DEFAULT NULL,
        prelaunch_video varchar(200) DEFAULT NULL,
        feature varchar(2000) DEFAULT NULL,
        feature_img varchar(200) DEFAULT NULL,
        fb_url varchar(200) DEFAULT NULL,
        twitter_url varchar(200) DEFAULT NULL,
        yt_url varchar(200) DEFAULT NULL,
        website_url varchar(200) DEFAULT NULL,
        is_approved tinyint(1) DEFAULT '0',
        PRIMARY KEY (prid)
      ) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
    `)

    await connection.query(`
      CREATE TABLE IF NOT EXISTS personal (
        pid int NOT NULL AUTO_INCREMENT,
        title varchar(200) DEFAULT NULL,
        city varchar(100) DEFAULT NULL,
        state varchar(100) DEFAULT NULL,
        type varchar(100) DEFAULT NULL,
        description varchar(1000) DEFAULT NULL,
        campaign_img varchar(200) DEFAULT NULL,
        campaign_video varchar(200) DEFAULT NULL,
        goal_amount double DEFAULT NULL,
        goal_date date DEFAULT NULL,
        bsb varchar(45) DEFAULT NULL,
        account varchar(45) DEFAULT NULL,
        bkash varchar(45) DEFAULT NULL,
        rocket varchar(45) DEFAULT NULL,
        nagad varchar(45) DEFAULT NULL,
        upay varchar(45) DEFAULT NULL,
        perk_title varchar(200) DEFAULT NULL,
        perk_description varchar(1000) DEFAULT NULL,
        perk_img varchar(200) DEFAULT NULL,
        perk_price double DEFAULT NULL,
        perk_retail_price double DEFAULT NULL,
        perk_date date DEFAULT NULL,
        nid_front varchar(200) DEFAULT NULL,
        nid_back varchar(200) DEFAULT NULL,
        passport varchar(200) DEFAULT NULL,
        amount_raised double DEFAULT NULL,
        is_approved tinyint(1) DEFAULT NULL,
        PRIMARY KEY (pid)
      ) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
    `)

    await connection.query(`
      CREATE TABLE IF NOT EXISTS business (
        bid int NOT NULL AUTO_INCREMENT,
        email varchar(100) DEFAULT NULL,
        title varchar(200) DEFAULT NULL,
        city varchar(100) DEFAULT NULL,
        state varchar(100) DEFAULT NULL,
        type varchar(100) DEFAULT NULL,
        tagline varchar(200) DEFAULT NULL,
        description varchar(2000) DEFAULT NULL,
        campaign_img varchar(200) DEFAULT NULL,
        campaign_video varchar(200) DEFAULT NULL,
        feature varchar(2000) DEFAULT NULL,
        feature_img varchar(200) DEFAULT NULL,
        goal_amount double DEFAULT NULL,
        goal_date date DEFAULT NULL,
        bsb varchar(45) DEFAULT NULL,
        account varchar(45) DEFAULT NULL,
        bkash varchar(45) DEFAULT NULL,
        rocket varchar(45) DEFAULT NULL,
        nagad varchar(45) DEFAULT NULL,
        upay varchar(45) DEFAULT NULL,
        perk_title varchar(200) DEFAULT NULL,
        perk_description varchar(2000) DEFAULT NULL,
        perk_img varchar(200) DEFAULT NULL,
        perk_price double DEFAULT NULL,
        perk_retail_price double DEFAULT NULL,
        perk_date date DEFAULT NULL,
        nid_front varchar(200) DEFAULT NULL,
        nid_back varchar(200) DEFAULT NULL,
        passport varchar(200) DEFAULT NULL,
        business_plan varchar(200) DEFAULT NULL,
        project_budget varchar(200) DEFAULT NULL,
        product_prototype varchar(200) DEFAULT NULL,
        legal_entity_verification varchar(200) DEFAULT NULL,
        financial_statements varchar(200) DEFAULT NULL,
        intellectual_property varchar(200) DEFAULT NULL,
        permits varchar(200) DEFAULT NULL,
        contracts varchar(200) DEFAULT NULL,
        extras varchar(200) DEFAULT NULL,
        amount_raised double DEFAULT NULL,
        is_approved tinyint(1) DEFAULT '0',
        PRIMARY KEY (bid)
      ) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
    `)

    connection.release()
    console.log('Tables created successfully')
  } catch (error) {
    console.error('Error creating tables:', error)
  } finally {
    pool.end() // Close the connection pool
  }
}

// Call the function to create tables
createTables()
