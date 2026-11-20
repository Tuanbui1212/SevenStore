const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "public_p8ljoyEcCEBiXGQOIbU2fsfWr98=",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "private_JeBmuwlY92uNsS/GJYD6e9EQkMM=",
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "https://ik.imagekit.io/iscatb3um",
});

exports.getAuth = (req, res) => {
  // Hàm này tạo chữ ký bảo mật, cực nhẹ, không xử lý file
  const result = imagekit.getAuthenticationParameters();
  res.send(result);
};
