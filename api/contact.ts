import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const config = { runtime: "edge" };

/** Escape HTML special characters to prevent XSS in email templates */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function sanitize(input: unknown): string {
  if (typeof input !== "string") return "";
  return escapeHtml(input.trim().slice(0, 500));
}

const ALLOWED_ORIGINS = [
  "https://landsvig.com",
  "https://www.landsvig.com",
  "http://localhost:8080",
  "http://localhost:5173",
];

export default async function handler(req: Request) {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const origin = req.headers.get("origin");
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    return new Response("Forbidden", { status: 403 });
  }

  try {
    const body = await req.json();

    const name = sanitize(body.name);
    const contact = sanitize(body.contact);
    const message = sanitize(body.message);

    if (!name || !contact) {
      return new Response(
        JSON.stringify({ error: "Navn og kontaktinfo er påkrævet" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    await resend.emails.send({
      from: "LANDSVIG <noreply@landsvig.com>",
      to: "kasper@landsvig.com",
      subject: `Ny henvendelse fra ${name}`,
      html: `
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 14px; line-height: 1.8; color: #2c2e30;">
          <h2 style="font-family: Georgia, serif; font-weight: normal; margin-bottom: 24px;">
            Ny henvendelse via landsvig.com
          </h2>

          <table style="border-collapse: collapse; width: 100%; max-width: 500px;">
            <tr>
              <td style="padding: 8px 16px 8px 0; color: #999; vertical-align: top;">Navn</td>
              <td style="padding: 8px 0;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 16px 8px 0; color: #999; vertical-align: top;">Kontakt</td>
              <td style="padding: 8px 0;">${contact}</td>
            </tr>
            ${message ? `<tr>
              <td style="padding: 8px 16px 8px 0; color: #999; vertical-align: top;">Besked</td>
              <td style="padding: 8px 0;">${message}</td>
            </tr>` : ""}
          </table>
        </div>
      `,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return new Response(
      JSON.stringify({ error: "Der opstod en fejl. Prøv igen." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
