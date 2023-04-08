const express = require("express");
const router = express.Router();
const Payment = require("../models/payments");

//paypal config
const paypal = require("paypal-rest-sdk");

/* GET /adopt home page. */
router.get("/", (req, res) => {
  //get data from mgdb using payments model
  Payment.find((err, payments) => {
    if (err) {
      console.log(err);
    } else {
      console.log(payments);
      res.render("payment/index", { title: "Payment by Paypal", payments: payments, user: req.user });
    }
  });
});

//POST
router.post("/pay", (req, res) => {
  const create_payment_json = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: "http://localhost:3000/payment/success",
      cancel_url: "http://localhost:3000/payment/cancel",
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: "item",
              // SKU stands for Stock Keeping Unit, and is the unique identifier for a products stock item.
              sku: "item",
              price: "1.00",
              currency: "CAD",
              quantity: 1,
            },
          ],
        },
        amount: {
          currency: "CAD",
          total: "1.00",
        },
        description: "This is the payment description.",
      },
    ]
  };
  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
      throw error;
    } else {
      // console.log("Create Payment Response");
      // console.log(payment);
      // res.send('test');
      for (let i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === 'approval_url') {
          res.redirect(payment.links[i].href);
        }
      }
    }
  });
});

// GET payment/success
router.get('/success',(req,res)=>{ 
  const payerId = req.query.PayerID;
  const paymentId=req.query.paymentId;
  

  const execute_payment_json={
    "payer_id":payerId,
    "transactions":[{
      "amount":{
        "currency":"CAD",
        "total":"1.00"
      }
    }]
  };
  paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
    if (error) {
        console.log(error.response);
        throw error;
    } else {
        // console.log("Get Payment Response");
        console.log(JSON.stringify(payment));
        res.send('Success');
        // res.redirect('/animals');
    }
});
});

router.get('/cancel',(req,res)=>res.send('Cancelled'));
module.exports = router;
