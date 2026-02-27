import { env } from "@/env";
import { render } from "@react-email/render";
import nodemailer from "nodemailer";
import { VerificationEmailTemplate } from "@/modules/email-templates/email-verification";
import { ResetPasswordEmailTemplate } from "@/modules/email-templates/reset-password-email";
import { ChangeEmailVerificationTemplate } from "@/modules/email-templates/change-email-verification";
import { EmployeeInvitationEmail } from "@/modules/email-templates/employee-invitation";

const transporter = nodemailer.createTransport({
  host: "smtp.zoho.com",
  port: 465,
  secure: true,
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS,
  },
});

async function sendMail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    const info = await transporter.sendMail({
      from: env.EMAIL_FROM,
      to,
      subject,
      html,
    });
    return { data: info, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
}

export const sendVerificationEmail = async ({
  email,
  verificationUrl,
}: {
  email: string;
  verificationUrl: string;
}) => {
  return sendMail({
    to: email,
    subject: "Verify your Email address",
    html: await render(
      VerificationEmailTemplate({ inviteLink: verificationUrl }),
    ),
  });
};

export const sendResetPasswordEmail = async ({
  email,
  verificationUrl,
}: {
  email: string;
  verificationUrl: string;
}) => {
  return sendMail({
    to: email,
    subject: "Reset Password Link",
    html: await render(
      ResetPasswordEmailTemplate({ inviteLink: verificationUrl }),
    ),
  });
};

export const sendChangeEmailVerification = async ({
  email,
  verificationUrl,
}: {
  email: string;
  verificationUrl: string;
}) => {
  return sendMail({
    to: email,
    subject: "Reset Password Link",
    html: await render(
      ChangeEmailVerificationTemplate({ inviteLink: verificationUrl }),
    ),
  });
};

export const sendOrganizationInvitationEmail = async ({
  email,
  inviteLink,
  orgName,
  inviteId,
}: {
  email: string;
  inviteLink: string;
  orgName: string;
  inviteId?: string;
}) => {
  return sendMail({
    to: email,
    subject: "Organization Invitation",
    html: await render(
      EmployeeInvitationEmail({
        invitationLink: inviteLink,
        organizationName: orgName,
        email,
        invitationId: inviteId ?? "N/A",
      }),
    ),
  });
};
