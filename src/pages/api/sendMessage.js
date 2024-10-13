// /src/pages/api/sendMessage.js

import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { firstname, lastname, email, phone, service, message } = req.body;

    // Validate inputs
    if (!firstname || !lastname || !email || !phone || !service || !message) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Create transporter using your email provider's SMTP configuration
    let transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER, // Secondary email (sender)
        pass: process.env.EMAIL_PASS, // Secondary email password
      },
    });

    try {
      // Send email from the secondary email to the primary email
      await transporter.sendMail({
        from: process.env.EMAIL_USER, // Sender email (secondary)
        to: process.env.PRIMARY_EMAIL, // Receiver email (primary)
        subject: `New Message from ${firstname} ${lastname}`,
        text: `Service: ${service}\nPhone: ${phone}\nMessage: ${message}`,
        html: `
          <h2>Contact Request</h2>
          <p><strong>Name:</strong> ${firstname} ${lastname}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Service:</strong> ${service}</p>
          <p><strong>Message:</strong> ${message}</p>
        `,
      });

      res.status(200).json({ message: "Your message has been sent successfully." });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ message: "Failed to send message. Please try again later." });
    }
  } else {
    res.status(405).json({ message: "Only POST method is allowed." });
  }
}
