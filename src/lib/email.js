import nodemailer from "nodemailer";

export function createTransport() {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
        },
    });
}

export async function sendInspectionFailEmail({ to, cc = [], subject, html }) {
    if (!process.env.SMTP_HOST) return;

    const transporter = createTransport();
    await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to,
        cc,
        subject,
        html,
    });
}
