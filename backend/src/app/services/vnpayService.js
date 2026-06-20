import moment from "moment";
import qs from "qs";
import crypto from "crypto";

// Cấu hình (Nên để trong file .env)
const config = {
  tmnCode: "45Z02A87", // <--- Thay mã của bạn
  secretKey: "PH48F4C8S7Z3GM2UJCWIODKW3HJ7MQPR", // <--- Thay key của bạn
  vnpUrl: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
  returnUrl: "http://localhost:3000/payment-result", // Link frontend nhận kết quả
};

const createPaymentUrl = (req) => {
  let date = new Date();
  let createDate = moment(date).format("YYYYMMDDHHmmss");

  let ipAddr =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  // 1. Tạo tham số
  let vnp_Params = {};
  vnp_Params["vnp_Version"] = "2.1.0";
  vnp_Params["vnp_Command"] = "pay";
  vnp_Params["vnp_TmnCode"] = config.tmnCode;
  vnp_Params["vnp_Locale"] = "vn";
  vnp_Params["vnp_CurrCode"] = "VND";
  vnp_Params["vnp_TxnRef"] = moment(date).format("DDHHmmss"); // Mã đơn hàng (Unique)
  vnp_Params["vnp_OrderInfo"] = "Thanh toan don hang test";
  vnp_Params["vnp_OrderType"] = "other";
  vnp_Params["vnp_Amount"] = req.body.amount * 100; // Số tiền (VNPay bắt buộc nhân 100)
  vnp_Params["vnp_ReturnUrl"] = config.returnUrl;
  vnp_Params["vnp_IpAddr"] = ipAddr;
  vnp_Params["vnp_CreateDate"] = createDate;
  if (req.body.bankCode) {
    vnp_Params["vnp_BankCode"] = req.body.bankCode;
  }

  // 2. Sắp xếp tham số (QUAN TRỌNG: Không sắp xếp là sai chữ ký)
  vnp_Params = sortObject(vnp_Params);

  // 3. Tạo chữ ký bảo mật (Secure Hash)
  let signData = qs.stringify(vnp_Params, { encode: false });
  let hmac = crypto.createHmac("sha512", config.secretKey);
  let signed = hmac.update(new Buffer.from(signData, "utf-8")).digest("hex");

  // 4. Gắn chữ ký vào và tạo URL cuối cùng
  vnp_Params["vnp_SecureHash"] = signed;
  let paymentUrl =
    config.vnpUrl + "?" + qs.stringify(vnp_Params, { encode: false });

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

export default { createPaymentUrl };
