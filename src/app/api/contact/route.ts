import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'amineoussi344@gmail.com',
        pass: process.env.GMAIL_APP_PASSWORD, // Must be set in Vercel Env Variables
      },
    });

    const mailOptions = {
      from: '"Xiaosave Support" <amineoussi344@gmail.com>', // Hides your real email behind the name
      to: 'amineoussi344@gmail.com', // Sends the email to yourself
      subject: `New Contact Form Submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      replyTo: email, // If you hit 'Reply' in Gmail, it will reply to the user's email
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
