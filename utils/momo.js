// utils/momo.js
import crypto from "crypto";
import https from "https";
import { momoRedirectUrl } from "../constants/constants";

export const createMomoPayment = ({ orderInfo, amount, extraData }) => {
  return new Promise((resolve, reject) => {
    const config = {
      accessKey: process.env.MOMO_ACCESS_KEY,
      secretKey: process.env.MOMO_SECRET_KEY,
      partnerCode: process.env.MOMO_PARTNER_CODE,
      redirectUrl: momoRedirectUrl,
      ipnUrl: process.env.MOMO_IPN_URL,
      requestType: "payWithMethod",
      orderGroupId: "",
      autoCapture: true,
      lang: "vi",
    };

    const orderId = config.partnerCode + Date.now();
    const requestId = orderId;

    const rawSignature = [
      `accessKey=${config.accessKey}`,
      `amount=${amount}`,
      `extraData=${extraData}`,
      `ipnUrl=${config.ipnUrl}`,
      `orderId=${orderId}`,
      `orderInfo=${orderInfo}`,
      `partnerCode=${config.partnerCode}`,
      `redirectUrl=${config.redirectUrl}`,
      `requestId=${requestId}`,
      `requestType=${config.requestType}`,
    ].join("&");

    const signature = crypto
      .createHmac("sha256", config.secretKey)
      .update(rawSignature)
      .digest("hex");

    const requestBody = JSON.stringify({
      partnerCode: config.partnerCode,
      partnerName: "Test",
      storeId: "TestStore",
      requestId,
      amount,
      orderId,
      orderInfo,
      redirectUrl: config.redirectUrl,
      ipnUrl: config.ipnUrl,
      lang: config.lang,
      requestType: config.requestType,
      autoCapture: config.autoCapture,
      extraData,
      orderGroupId: config.orderGroupId,
      signature,
    });

    const options = {
      hostname: "test-payment.momo.vn",
      port: 443,
      path: "/v2/gateway/api/create",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(requestBody),
      },
    };

    const momoReq = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed);
        } catch (err) {
          reject(err);
        }
      });
    });

    momoReq.on("error", reject);
    momoReq.write(requestBody);
    momoReq.end();
  });
};
