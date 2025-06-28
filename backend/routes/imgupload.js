const express = require("express");
const router = express.Router();
const ImageKit = require("imagekit");



const imagekit = new ImageKit({
  urlEndpoint: process.env.URL_ENDPOINT,
  publicKey: process.env.IMAGE_PUBLIC_KEY,
  privateKey: process.env.IMAGE_PRIVATE_KEY,
});

console.log(process.env.URL_ENDPOINT);
console.log(process.env.IMAGE_PUBLIC_KEY);
console.log(process.env.IMAGE_PRIVATE_KEY);


router.get("/img-upload", (req, res) => {
  try {
    const result = imagekit.getAuthenticationParameters();
    res.json(result); 
  } catch (error) {
    console.error('ImageKit Authentication Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate authentication parameters',
      details: error.message 
    });
  }
});


module.exports = router;
