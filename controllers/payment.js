import { createMomoPayment } from "../utils/momoPayment.js";

export const payWithMomo = async (req, res) => {
  try {
    const { amount, userId } = req.body;
    console.log ("Making Momo payment with:", req.body);
    if ( !amount || !userId) {
      return res.status(400).json({ message: "Missing required fields." });
    }
    const orderInfo = `Thanh toán Pizza`;
    const extraData = Buffer.from(JSON.stringify({ userId })).toString("base64");

    const momoRes = await createMomoPayment({ orderInfo, amount, extraData });

    if (momoRes && momoRes.payUrl) {
      return res.json({ payUrl: momoRes.payUrl });
    } else {
      return res.status(500).json({ message: "Failed to create MoMo payment." });
    }
  } catch (err) {
    console.error("MoMo Payment Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
