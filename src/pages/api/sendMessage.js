import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { firstname, lastname, email, phone, service, message } = req.body;

      // Validate input
      if (!firstname || !lastname || !email || !phone || !service || !message) {
        return res.status(400).json({ message: 'All fields are required.' });
      }

      // Check environment variables
      if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
        return res.status(500).json({ message: 'Email configuration is not set properly.' });
      }

      // Create a transporter
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT, 10),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      // Set up email data
      const mailOptions = {
        from: process.env.SMTP_USER,
        to: process.env.PRIMARY_EMAIL,
        subject: `New message from ${firstname} ${lastname}`,
        text: `You have received a new message:\n\n
        Name: ${firstname} ${lastname}\n
        Email: ${email}\n
        Phone: ${phone}\n
        Service: ${service}\n
        Message: ${message}`,
      };

      // Send mail
      await transporter.sendMail(mailOptions);
      return res.status(200).json({ message: 'Message sent successfully!' });
    } catch (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ message: 'Failed to send message.', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}










////////////////////////////////


// index.js
// import express from 'express';
// import nodemailer from 'nodemailer';
// import bodyParser from 'body-parser';
// import cors from 'cors';
// import dotenv from 'dotenv';

// dotenv.config();

// const app = express();
// const PORT = 5000;

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());

// // POST route to send message
// app.post('/api/sendMessage', async (req, res) => {
//   const { firstname, lastname, email, phone, service, message } = req.body;

//   // Validate input
//   if (!firstname || !lastname || !email || !phone || !service || !message) {
//     return res.status(400).json({ message: 'All fields are required.' });
//   }

//   // Create a transporter
//   const transporter = nodemailer.createTransport({
//     host: process.env.SMTP_HOST,
//     port: parseInt(process.env.SMTP_PORT, 10),
//     secure: false, // true for 465, false for other ports
//     auth: {
//       user: process.env.SMTP_USER,
//       pass: process.env.SMTP_PASS,
//     },
//   });

//   // Set up email data
//   const mailOptions = {
//     from: process.env.SMTP_USER,
//     to: process.env.PRIMARY_EMAIL,
//     subject: `New message from ${firstname} ${lastname}`,
//     text: `You have received a new message:\n\n
//     Name: ${firstname} ${lastname}\n
//     Email: ${email}\n
//     Phone: ${phone}\n
//     Service: ${service}\n
//     Message: ${message}`,
//   };

//   // Send mail
//   try {
//     await transporter.sendMail(mailOptions);
//     return res.status(200).json({ message: 'Message sent successfully!' });
//   } catch (error) {
//     console.error('Error sending email:', error); // Log the error
//     return res.status(500).json({ message: 'Failed to send message.', error: error.message });
//   }
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

















//!



// import express from 'express';
// import nodemailer from 'nodemailer';
// import cors from 'cors';
// import dotenv from 'dotenv';

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5001;

// // Middleware
// app.use(express.json());
// app.use(cors());

// // POST route to send message
// app.post('/api/sendMessage', async (req, res) => {
//   const { firstname, lastname, email, phone, service, message } = req.body;

//   // Validate input
//   if (!firstname || !lastname || !email || !phone || !service || !message) {
//     return res.status(400).json({ message: 'All fields are required.' });
//   }

//   // Create a transporter
//   const transporter = nodemailer.createTransport({
//     service: 'Gmail', // Use 'Gmail' or change to your email provider
//     auth: {
//       user: "youcef29082003@gmail.com",
//       pass: "Youcef@50702320",
//     },
//     secure: false, // Set to true if using SSL (like Gmail with port 465)
//   });
//   // Set up email data
//   const mailOptions = {
//     from: process.env.SMTP_USER,
//     to: process.env.PRIMARY_EMAIL,
//     subject: `New message from ${firstname} ${lastname}`,
//     text: `You have received a new message:\n\n
//     Name: ${firstname} ${lastname}\n
//     Email: ${email}\n
//     Phone: ${phone}\n
//     Service: ${service}\n
//     Message: ${message}`,
//   };

//   // Send mail
//   try {
//     console.log('Sending email...');
//     await transporter.sendMail(mailOptions);
//     console.log('Email sent successfully.');
//     return res.status(200).json({ message: 'Message sent successfully!' });
//   } catch (error) {
//     console.error('Error sending email:', error); // Log the error
//     return res.status(500).json({ message: 'Failed to send message.', error: error.message });
//   }
// });

// // Start the server
// app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
