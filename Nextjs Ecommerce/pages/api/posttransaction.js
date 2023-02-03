import Order from "../../models/Order";
import connectDb from "../../middleware/mongoose";
import Product from "../../models/Product";

const handler = async (req, res) => {
  let order;
  // validate paytm checksum[pending]

  //Orders Table after the checking transaction status

  if (req.body.STATUS == "TXN_SUCCESS") {
    let Products = order.Products
    for(let slug in Products){
      await Product.findOneAndUpdate({slug:slug},{$inc:{"availableQTY":-Products[slug].qty}})

    }
    order = await Order.findOneAndUpdate(
      { orderId: req.body.ORDERID },
      { status: "Paid", paymentInfo: JSON.stringify(req.body) }
    );
  } else if (req.body.STATUS == "PENDING") {
    order = await Order.findOneAndUpdate(
      { orderId: req.body.ORDERID },
      { status: "Pending", paymentInfo: JSON.stringify(req.body) }
    );
  }

  // initiate sipping
  // redirect

  res.redirect("/order?clearCart=1&id=" + order._id, 200);

  // res.status(200).json({ body: req.body });
};
export default connectDb(handler);
