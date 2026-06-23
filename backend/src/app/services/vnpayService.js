const moment = require("moment");
const qs = require("qs");
const crypto = require("crypto");

// Cấu hình từ file .env
const config = {
  tmnCode: process.env.VNP_TMNCODE || "45Z02A87",
  secretKey: process.env.VNP_HASHSECRET || "PH48F4C8S7Z3GM2UJCWIODKW3HJ7MQPR",
  vnpUrl: process.env.VNP_URL || "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
  returnUrl: process.env.VNP_RETURNURL || "http://localhost:3000/",
};

const createPaymentUrl = ({ amount, ipAddr, txnRef, orderInfo, bankCode }) => {
  let date = new Date();
  let createDate = moment(date).format("YYYYMMDDHHmmss");

  // 1. Tạo tham số
  let vnp_Params = {};
  vnp_Params["vnp_Version"] = "2.1.0";
  vnp_Params["vnp_Command"] = "pay";
  vnp_Params["vnp_TmnCode"] = config.tmnCode;
  vnp_Params["vnp_Locale"] = "vn";
  vnp_Params["vnp_CurrCode"] = "VND";
  vnp_Params["vnp_TxnRef"] = txnRef || moment(date).format("DDHHmmss"); // Mã đơn hàng (Unique)
  vnp_Params["vnp_OrderInfo"] = orderInfo || "Thanh toan don hang";
  vnp_Params["vnp_OrderType"] = "other";
  vnp_Params["vnp_Amount"] = amount * 100; // Số tiền (VNPay bắt buộc nhân 100)
  vnp_Params["vnp_ReturnUrl"] = config.returnUrl;
  vnp_Params["vnp_IpAddr"] = ipAddr || "127.0.0.1";
  vnp_Params["vnp_CreateDate"] = createDate;
  if (bankCode) {
    vnp_Params["vnp_BankCode"] = bankCode;
  }

  // 2. Sắp xếp tham số (QUAN TRỌNG: Không sắp xếp là sai chữ ký)
  vnp_Params = sortObject(vnp_Params);

  // 3. Tạo chữ ký bảo mật (Secure Hash)
  let signData = qs.stringify(vnp_Params, { encode: false });
  let hmac = crypto.createHmac("sha512", config.secretKey);
  let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  // 4. Gắn chữ ký vào và tạo URL cuối cùng
  vnp_Params["vnp_SecureHash"] = signed;
  let paymentUrl = config.vnpUrl + "?" + qs.stringify(vnp_Params, { encode: false });

  return paymentUrl;
};

// Hàm sắp xếp object theo thứ tự a-b-c
function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

module.exports = { createPaymentUrl };
