import nodemailer from "nodemailer";

export async function sendVerificationEmail(email: string, otp: string) {
  // If no email credentials are provided, log the OTP to console (for development)
  if (!process.env.EMAIL_SERVER_USER || !process.env.EMAIL_SERVER_PASSWORD) {
    console.log("==================================================");
    console.log(`[DEV MODE] Email to ${email}`);
    console.log(`[DEV MODE] OTP: ${otp}`);
    console.log("==================================================");
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST || "smtp.gmail.com",
    port: Number(process.env.EMAIL_SERVER_PORT) || 587,
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || '"RojgaarNepal" <arpitkafle468@gmail.com>',
    to: email,
    subject: "Verify your email - RojgaarNepal",
    text: `Your verification code is: ${otp} Don't share this code with anyone. rojgaarnepal.com`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Verify your email</h2>
        <p>Thank you for registering with RojgaarNepal. Please use the following code to verify your email address:</p>
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
          <span style="font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #1f2937;">${otp}</span>
        </div>
        <p>This code will expire in 5 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <a href="https://rojgaarnepal.com">RojgaarNepal</a>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(email: string, otp: string) {
  if (!process.env.EMAIL_SERVER_USER || !process.env.EMAIL_SERVER_PASSWORD) {
    console.log("==================================================");
    console.log(`[DEV MODE] Password Reset Email to ${email}`);
    console.log(`[DEV MODE] OTP: ${otp}`);
    console.log("==================================================");
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST || "smtp.gmail.com",
    port: Number(process.env.EMAIL_SERVER_PORT) || 587,
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || '"RojgaarNepal" <arpitkafle468@gmail.com>',
    to: email,
    subject: "Reset Your Password - RojgaarNepal",
    text: `Your password reset code is: ${otp}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Reset Your Password</h2>
        <p>You requested to reset your password for RojgaarNepal. Use the code below:</p>
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
          <span style="font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #1f2937;">${otp}</span>
        </div>
        <p>This code will expire in 5 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `,
  });
}

export async function sendUntrustEmail(trustedEmail: string, trusterName: string) {
  if (!process.env.EMAIL_SERVER_USER || !process.env.EMAIL_SERVER_PASSWORD) {
    console.log(`[DEV MODE] Untrust Email to ${trustedEmail} from ${trusterName}`);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST || "smtp.gmail.com",
    port: Number(process.env.EMAIL_SERVER_PORT) || 587,
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || '"RojgaarNepal" <arpitkafle468@gmail.com>',
    to: trustedEmail,
    subject: "Trust Update - RojgaarNepal",
    text: `${trusterName} removed their trust.`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Trust Update</h2>
        <p><strong>${trusterName}</strong> removed their trust.</p>
        <p style="color: #6b7280; font-size: 12px; margin-top: 20px;">This is an automated notification from RojgaarNepal.</p>
      </div>
    `,
  });
}

export async function sendApplicationEmail(employerEmail: string, jobTitle: string, applicantName: string) {
  if (!process.env.EMAIL_SERVER_USER || !process.env.EMAIL_SERVER_PASSWORD) {
    console.log(`[DEV MODE] Application Email to ${employerEmail} for ${jobTitle} from ${applicantName}`);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST || "smtp.gmail.com",
    port: Number(process.env.EMAIL_SERVER_PORT) || 587,
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || '"RojgaarNepal" <arpitkafle468@gmail.com>',
    to: employerEmail,
    subject: `New Application for ${jobTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>New Job Application</h2>
        <p><strong>${applicantName}</strong> has applied for <strong>${jobTitle}</strong>.</p>
        <p>Log in to your dashboard to review the application.</p>
      </div>
    `,
  });
}

export async function sendApplicationStatusEmail(applicantEmail: string, jobTitle: string, status: string) {
  if (!process.env.EMAIL_SERVER_USER || !process.env.EMAIL_SERVER_PASSWORD) {
    console.log(`[DEV MODE] Status Email to ${applicantEmail} for ${jobTitle}: ${status}`);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST || "smtp.gmail.com",
    port: Number(process.env.EMAIL_SERVER_PORT) || 587,
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || '"RojgaarNepal" <arpitkafle468@gmail.com>',
    to: applicantEmail,
    subject: `Application Status Update: ${jobTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Application Update</h2>
        <p>Your application for <strong>${jobTitle}</strong> has been marked as <strong>${status}</strong>.</p>
        <p>Log in to check details.</p>
      </div>
    `,
  });
}

export async function sendNotificationEmail(
  email: string,
  content: string,
  type: string = "INFO",
  link?: string
) {
  if (!process.env.EMAIL_SERVER_USER || !process.env.EMAIL_SERVER_PASSWORD) {
    console.log("==================================================");
    console.log(`[DEV MODE] Notification Email to ${email}`);
    console.log(`[DEV MODE] Type: ${type}`);
    console.log(`[DEV MODE] Content: ${content}`);
    console.log("==================================================");
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST || "smtp.gmail.com",
    port: Number(process.env.EMAIL_SERVER_PORT) || 587,
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });

  // Determine subject and icon based on type
  let subject = "New Notification - RojgaarNepal";
  let icon = "🔔";
  let color = "#2563eb";

  if (type === "MESSAGE") {
    subject = "New Message - RojgaarNepal";
    icon = "💬";
    color = "#059669";
  } else if (type === "APPLICATION_STATUS") {
    subject = "Application Status Update - RojgaarNepal";
    icon = "📋";
    color = "#dc2626";
  } else if (type === "PREMIUM") {
    subject = "Premium Update - RojgaarNepal";
    icon = "👑";
    color = "#f59e0b";
  } else if (type === "SUPPORT") {
    subject = "Support Update - RojgaarNepal";
    icon = "🎧";
    color = "#8b5cf6";
  }

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || '"RojgaarNepal" <arpitkafle468@gmail.com>',
    to: email,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; background-color: #f9fafb;">
        <div style="background-color: white; border-radius: 10px; padding: 30px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 20px;">
            <span style="font-size: 48px;">${icon}</span>
          </div>
          <h2 style="color: ${color}; text-align: center; margin-bottom: 20px;">New Notification</h2>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; border-left: 4px solid ${color};">
            <p style="margin: 0; color: #1f2937; font-size: 16px; line-height: 1.6;">${content}</p>
          </div>
          ${link ? `
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}${link}" 
               style="display: inline-block; background-color: ${color}; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              View Details
            </a>
          </div>
          ` : ''}
          <p style="color: #6b7280; font-size: 12px; text-align: center; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
            This is an automated notification from RojgaarNepal. You received this because you have an account with us.
          </p>
        </div>
      </div>
    `,
  });
}

