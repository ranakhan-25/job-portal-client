import { Resend } from "resend";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { jwt } from "better-auth/plugins";

const client = new MongoClient(process.env.DB_URL!);
const db = client.db("Crowdfunding");

const sendResetPasswordEmail = async (
  args: {
    user: {
      id: string;
      email: string;
      emailVerified: boolean;
      name?: string;
    };
    url: string;
    token: string;
  },
  request: Request,
) => {
  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;

  if (!resendApiKey || !fromEmail) {
    const missing = [];
    if (!resendApiKey) missing.push("RESEND_API_KEY");
    if (!fromEmail) missing.push("RESEND_FROM_EMAIL");
    const message = `Missing env vars: ${missing.join(", ")}`;
    console.error("Password reset email not sent:", message, {
      to: args.user.email,
      url: args.url,
      token: args.token,
    });
    throw new Error(message);
  }

  const resend = new Resend(resendApiKey);
  const subject = "Reset Your Password";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #10b981; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0;">Password Reset Request</h1>
      </div>
      <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px;">
        <p style="color: #374151;">Hi <strong>${args.user.name || args.user.email}</strong>,</p>
        <p style="color: #374151;">Click the button below to reset your password.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${args.url}"
             style="background-color: #10b981; color: white; padding: 14px 32px;
                    text-decoration: none; border-radius: 8px; font-size: 16px;
                    font-weight: bold; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p style="color: #6b7280; font-size: 14px;">⚠️ This link will expire in <strong>1 hour</strong>.</p>
        <p style="color: #6b7280; font-size: 14px;">If you didn't request this, ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
        <p style="color: #9ca3af; font-size: 12px; text-align: center; word-break: break-all;">${args.url}</p>
      </div>
    </div>
  `;
  const text = `Hi ${args.user.name || args.user.email},\n\nPlease reset your password using the link below:\n${args.url}\n\nIf you did not request this, ignore this email.`;

  console.log("Sending password reset email", {
    to: args.user.email,
    from: fromEmail,
    url: args.url,
    token: args.token,
  });

  try {
    await resend.emails.send({
      from: fromEmail,
      to: args.user.email,
      subject,
      html,
      text,
    });
  } catch (error) {
    console.error("Resend password reset email failed", {
      error,
      to: args.user.email,
      from: fromEmail,
      url: args.url,
      token: args.token,
    });
    throw error instanceof Error
      ? error
      : new Error("Failed to send reset password email");
  }
};

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),

  emailAndPassword: {
    enabled: true,
    sendResetPassword: sendResetPasswordEmail,
    resetPasswordTokenExpiresIn: 3600,
    revokeSessionsOnPasswordReset: true,
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
      },
      phone: {
        type: "string",
        required: false,
      },
      bio: {
        type: "string",
        required: false,
      },
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  session: {
    cookieCache: {
      enabled: true,
      strategy: "jwt",
      maxAge: 7 * 24 * 60 * 60,
    },
  },

  plugins: [jwt()],
});
