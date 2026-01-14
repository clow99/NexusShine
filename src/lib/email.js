import { Resend } from "resend";

export async function sendInspectionFailEmail({ to, cc = [], subject, html }) {
    if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM) return;

    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
        from: process.env.RESEND_FROM,
        to,
        cc,
        subject,
        html,
    });
}
