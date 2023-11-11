const express = require('express')
const router = express.Router()

const SSLCommerzPayment = require('sslcommerz-lts');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config(); // Load environment variables from a .env file

// Generate a unique ID
const tran_id = uuidv4();

const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASSWORD;
const is_live = false //true for live, false for sandbox

router.use(express.urlencoded({ extended: true }));



router.post('/submit-donation', (req, res) => {
    // Handle the POST request for '/route1'
    console.log(req.body);

    const mail = req.session.user.email;
    console.log("email");
    console.log(mail);
    console.log("req.body.test");
    const cid = req.body.test;
    console.log(cid);
    
    console.log(req.session.user.name);

    const donation = req.body;

    console.log('Donation Amount:', req.body.donation);

    const data = {
        total_amount: req.body.donation,
        currency: 'BDT',
        tran_id: tran_id, // use a unique tran_id for each API call
        success_url: `http://localhost:3000/ssl-payment/success/${tran_id}`,
        fail_url: `http://localhost:3000/ssl-payment/failure`,
        cancel_url: 'http://localhost:3000/cancel',
        ipn_url: 'http://localhost:3000/ipn',
        shipping_method: 'Courier',
        product_name: 'Computer.',
        product_category: 'Crowdfunding',
        product_profile: 'general',
        cus_name: req.session.user.name,
        cus_email: req.session.user.email,
        cus_add1: 'Dhaka',
        cus_add2: 'Dhaka',
        cus_city: 'Dhaka',
        cus_state: 'Dhaka',
        cus_postcode: '1000',
        cus_country: 'Bangladesh',
        cus_phone: '01711111111',
        cus_fax: '01711111111',
        ship_name: 'Customer Name',
        ship_add1: 'Dhaka',
        ship_add2: 'Dhaka',
        ship_city: 'Dhaka',
        ship_state: 'Dhaka',
        ship_postcode: 1000,
        ship_country: 'Bangladesh',
    };

    console.log(data);

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live)
    sslcz.init(data).then(apiResponse => {
        // Redirect the user to payment gateway
        let GatewayPageURL = apiResponse.GatewayPageURL
        console.log(GatewayPageURL);
        res.redirect(GatewayPageURL)
        console.log('Redirecting to: ', GatewayPageURL)

        // const finalOrder={
        //     paidStatus:false, transactionId: tran_id
        // }
    });
});


// router.post("/ssl-payment/success", async(req,res) => {
//     return res.status(200).json({
//         data: req.body,
//     });
// });






module.exports = router