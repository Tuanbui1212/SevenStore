const moment = require("moment");
const qs = require("qs");
const crypto = require("crypto");

const config = {
  tmnCode: process.env.VNP_TMNCODE || process.env.VNPAY_TMN_CODE || "45Z02A87",
  secretKey: process.env.VNP_HASHSECRET || process.env.VNPAY_HASH_SECRET || "PH48F4C8S7Z3GM2UJCWIODKW3HJ7MQPR",
  vnpUrl: process.env.VNP_URL || process.env.VNPAY_URL || "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
  returnUrl: process.env.VNP_RETURNURL || process.env.VNPAY_RETURN_URL || "http://localhost:3000/my-orders",
};

// Hàm sắp xếp object theo thứ tự a-b-c
function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

const createPaymentUrl = (arg1, orderId, amount) => {
  const date = new Date();
  const createDate = moment(date).format("YYYYMMDDHHmmss");

  let ipAddr = "127.0.0.1";
  let txnRef = moment(date).format("DDHHmmss");
  let orderInfo = "Thanh toan don hang";
  let orderAmount = 0;
  let bankCode = undefined;

  // Handle object signature: createPaymentUrl({ amount, ipAddr, txnRef, orderInfo, bankCode })
  if (arg1 && typeof arg1 === "object" && !arg1.headers && (arg1.amount !== undefined || arg1.txnRef !== undefined)) {
    orderAmount = arg1.amount || 0;
    ipAddr = arg1.ipAddr || "127.0.0.1";
    txnRef = arg1.txnRef || moment(date).format("DDHHmmss");
    orderInfo = arg1.orderInfo || `Thanh toan don hang ${txnRef}`;
    bankCode = arg1.bankCode;
  } else {
    // Handle (req, orderId, amount)
    const req = arg1;
    ipAddr =
      (req &&
        (req.headers?.["x-forwarded-for"] ||
          req.connection?.remoteAddress ||
          req.socket?.remoteAddress ||
          req.connection?.socket?.remoteAddress)) ||
      "127.0.0.1";
    if (typeof ipAddr === "string") {
      ipAddr = ipAddr.split(",")[0].trim();
    }
    orderAmount = amount || (req && req.body && req.body.amount) || 0;
    txnRef = orderId ? orderId.toString().slice(-8) + moment(date).format("HHmmss") : moment(date).format("DDHHmmss");
    orderInfo = `Thanh toan don hang ${orderId || txnRef}`;
    if (req && req.body && req.body.bankCode) {
      bankCode = req.body.bankCode;
    }
  }

  let vnp_Params = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: config.tmnCode,
    vnp_Locale: "vn",
    vnp_CurrCode: "VND",
    vnp_TxnRef: txnRef,
    vnp_OrderInfo: orderInfo,
    vnp_OrderType: "other",
    vnp_Amount: Math.round(orderAmount * 100),
    vnp_ReturnUrl: config.returnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate,
  };

  if (bankCode) {
    vnp_Params["vnp_BankCode"] = bankCode;
  }

  vnp_Params = sortObject(vnp_Params);

  const signData = qs.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac("sha512", config.secretKey);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  vnp_Params["vnp_SecureHash"] = signed;
  return config.vnpUrl + "?" + qs.stringify(vnp_Params, { encode: false });
};

module.exports = {
  createPaymentUrl,
  sortObject,
  config,
};
