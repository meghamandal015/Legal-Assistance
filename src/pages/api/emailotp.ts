// pages/api/emails.ts

import { Resend } from 'resend';
import { NextApiRequest, NextApiResponse } from 'next';

const resend = new Resend(process.env.RESEND_API_KEY); 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { name, email, otp } = req.body;
    console.log("Name: ", name);
    console.log("Email: ", email);
    console.log("OTP: ", otp);

    try {
      await resend.emails.send({
        from: 'onboarding@resend.dev', 
        to: email, 
        subject: 'LegalAID AI | One Time Password for Email Verification',
        html: `
          <h3>New Contact Form Submission</h3>
          <p><strong>Hi ${name}</strong></p>
          <p>This is your One Time Password for Email Verification</p>
          <p><strong> ${otp} </strong></p>
        `,
      });

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ success: false });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}