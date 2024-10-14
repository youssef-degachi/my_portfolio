import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from a .env file

const app = express();
const port = process.env.PORT || 5001;
app.use(express.json());

app.post("/api/sendMessage", async (req, res) => {
  const { firstname, lastname, email, phone, service, message } = req.body;

  // Validate input
  if (!firstname || !lastname || !email || !phone || !service || !message) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      logger: true,
      debug: true, // Include this for more details
    });
    

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender address
      to: 'youssefdegachi0@gmail.com', // Receiver's email address
      subject: `New message from ${firstname} ${lastname}`,
      text: `You have received a new message:\n\n
      Name: ${firstname} ${lastname}\n
      Email: ${email}\n
      Phone: ${phone}\n
      Service: ${service}\n
      Message: ${message}`,
    };

    // Send the email
    console.log('Sending email...');
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully.');
    return res.status(200).json({ message: 'Message sent successfully!' });

  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ message: 'Failed to send message.', error: error.message });
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
