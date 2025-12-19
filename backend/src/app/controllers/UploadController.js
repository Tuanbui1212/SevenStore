const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey: "public_p8ljoyEcCEBiXGQOIbU2fsfWr98=", // Thay bằng Public Key của bạn
  privateKey: "private_JeBmuwlY92uNsS/GJYD6e9EQkMM=", // Thay bằng Private Key của bạn
  urlEndpoint: "https://ik.imagekit.io/iscatb3um", // Thay bằng URL Endpoint của bạn
});

exports.getAuth = (req, res) => {
  // Hàm này tạo chữ ký bảo mật, cực nhẹ, không xử lý file
  const result = imagekit.getAuthenticationParameters();
  res.send(result);
};
