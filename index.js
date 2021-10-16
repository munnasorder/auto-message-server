const wbm = require("./wbm");
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.post("/api", (req, res) => {
  const { phone, msg } = req.body;

  wbm
    .start({ qrCodeData: true, session: false, showBrowser: false })
    .then(async (qrCodeData) => {
      console.log(qrCodeData); // show data used to generate QR Code
      res.send(qrCodeData);
      await wbm.waitQRCode();

      const phones = [phone];
      const message = msg;

      await wbm.send(phones, message);
      await wbm.end();
    })
    .catch((err) => {
      console.log(err);
    });
});


app.post("/send", (req, res) => {
  const { phone, msg } = req.body;
  
  wbm
    .start({ qrCodeData: false, session: true, showBrowser: false })
    .then(async (qrCodeData) => {

      const phones = [phone];
      const message = msg;

      const result = await wbm.send(phones, message);
      res.send(result);
      await wbm.end();
      console.log(result)
    })
    .catch((err) => {
      console.log(err);
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
