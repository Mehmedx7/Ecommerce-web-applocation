import Order from "../../models/Order";
import connectDb from "../../middleware/mongoose";
import Product from "../../models/Product";

const https = require("https");

const PaytmChecksum = require("paytmchecksum");

const handler = async (req, res) => {
  if (req.method == "POST") {
    // check if the cart is tempered
    let product,
      sumTotal = 0;
    let cart = req.body.cart;

    if ((req.body.subTotal = 0)) {
      res.status(200).json({
        success: false,
        error: "Cart is Empty!!. Please built Your Cart and try again ",
      });
      return;
    }
    for (let item in cart) {
      sumTotal += cart[item].price * cart[item].qty;
      product = await Product.findOne({ slug: item });

      if (product.availableQty < cart[item].qty) {
        res.status(200).json({
          success: false,
          error: "Out of Stack",
        });
      }

      if (product.price * product.qty != cart[item].price) {
        res.status(200).json({
          success: false,
          error:
            "The Price of some items in your cart have changed. Please try again",
        });
        return;
      }
    }
    if (sumTotal !== req.body.subTotal) {
      res.status(200).json({
        success: false,
        error:
          "The Price of some items in your cart have changed. Please try again",
      });
      return;
    }

    // check items outfox stack[pending]

    // check if details are valid
    if (req.body.phone.length != 10 || !Number.isInteger(req.body.phone)) {
      res.status(200).json({
        success: false,
        error: "Please Enter Valid Number!!",
      });
      return;
    }
    if (req.body.pincode.length != 6 || !Number.isInteger(req.body.pincode)) {
      res.status(200).json({
        success: false,
        error: "Please Enter Valid Pincode!!",
      });
      return;
    }

    // initiate on order corresponding
    let order = new Order({
      email: req.body.email,
      orderId: req.body.oid,
      address: req.body.address,
      amount: req.body.subTotal,
      products: req.body.cart,
    });
    await order.save();

    // insert an entry into database

    var paytmParams = {};

    paytmParams.body = {
      requestType: "Payment",
      mid: process.env.NEXT_PUBLIC_PAYTM_MID,
      websiteName: "YOUR_WEBSITE_NAME",
      orderId: request.body.oid,
      callbackUrl: `${process.env.NEXT_PUBLIC_HOST}/api/posttransaction`,
      txnAmount: {
        value: req.body.subTotal,
        currency: "INR",
      },
      userInfo: {
        custId: req.body.email,
      },
    };

    const checksum = await PaytmChecksum.generateSignature(
      JSON.stringify(paytmParams.body),
      process.env.PAYTM_MKEY
    );
    paytmParams.head = {
      signature: checksum,
    };

    var post_data = JSON.stringify(paytmParams);

    const requestAsync = async () => {
      return new Promise((resolve, reject) => {
        var options = {
          hostname: "securegw-stage.paytm.in" /* for Production */, // hostname: 'securegw.paytm.in',

          port: 443,
          path: `/theia/api/v1/initiateTransaction?mid=${process.env.NEXT_PUBLIC_PAYTM_MID}&orderId=${req.body.oid}`,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Content-Length": post_data.length,
          },
        };

        var response = "";
        var post_req = https.request(options, function (post_res) {
          post_res.on("data", function (chunk) {
            response += chunk;
          });

          post_res.on("end", function () {
            // console.log("Response: ", response);
            let ress = JSON.parse(response).body;
            ress.success = true;
            resolve(ress);
          });
        });

        post_req.write(post_data);
        post_req.end();
      });
    };
    let myr = await requestAsync();
    res.status(200).json(myr);
  }
};
export default connectDb(handler);
