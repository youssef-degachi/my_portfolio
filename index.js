import express from 'express';
import nodemailer from 'nodemailer';
const app = express();
const router = express.Router();
const port = process.env.PORT || 5001;
app.use(express.json());


app.post("/api/sendMessage", (req,res) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "youcef29082003@gmail.com",
      pass: "Youcef@50702320",
    },
  });
  const mailOptions = {
    from: "youcef29082003@gmail.com",
    to: "youssefdegachi0@gmail.com",
    subject: "Hello from Nodemailer",
    text: "This is a test email sent using Nodemailer.",
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email: ", error);
    } else {
      console.log("Email sent: ", info.response);
    }
  });
  res.json({status: "success", message: 'Message received'})
});

app.listen(port, () => console.log(`Server running on port ${port}`));