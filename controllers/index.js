const express = require("express");
const { render } = require("../app");
const router = express.Router();
const paypal=require('paypal-rest-sdk');
/* GET home page. */
router.get("/", (req, res) => {
  res.render("index", { title: "Stray Animal Rescue", user: req.user });
});

// GET /about
router.get("/about", (req, res) => {
  res.render("about", { title: "about", user: req.user });
});

// //POST
// router.post("/pay", (req, res) => {
//   const create_payment_json = {
//     intent: "sale",
//     payer: {
//       payment_method: "paypal",
//     },
//     redirect_urls: {
//       return_url: "http://localhost:3000/success",
//       cancel_url: "http://localhost:3000/cancel",
//     },
//     transactions: [
//       {
//         item_list: {
//           items: [
//             {
//               name: "item",
//               // SKU stands for Stock Keeping Unit, and is the unique identifier for a products stock item.
//               sku: "item",
//               price: "1.00",
//               currency: "CAD",
//               quantity: 1,
//             },
//           ],
//         },
//         amount: {
//           currency: "CAD",
//           total: "1.00",
//         },
//         description: "This is the payment description.",
//       },
//     ],
//   };
//   paypal.payment.create(create_payment_json, function (error, payment) {
//     if (error) {
//       throw error;
//     } else {
//       console.log("Create Payment Response");
//       console.log(payment);
//       res.send("test");
//     }
//   });
// });

module.exports = router;
