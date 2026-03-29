import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const config = {
  runtime: "edge",
};

/** Escape HTML special characters to prevent XSS in email templates */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/** Validate that a string is a reasonable form input (not script injection) */
function sanitize(input: unknown): string {
  if (typeof input !== "string") return "";
  // Trim and limit length
  return escapeHtml(input.trim().slice(0, 500));
}

export default async function handler(req: Request) {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  // Basic origin check — only accept requests from our domain
  const origin = req.headers.get("origin");
  const allowedOrigins = [
    "https://landsvig.com",
    "https://www.landsvig.com",
    "http://localhost:8080",
    "http://localhost:5173",
  ];
  if (origin && !allowedOrigins.includes(origin)) {
    return new Response("Forbidden", { status: 403 });
  }

  try {
    const body = await req.json();

    const name = sanitize(body.name);
    const contact = sanitize(body.contact);
    const companyType = sanitize(body.companyType);
    const painPoint = sanitize(body.painPoint);

    if (!name || !contact) {
      return new Response(
        JSON.stringify({ error: "Navn og kontaktinfo er påkrævet" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    await resend.emails.send({
      from: "LANDSVIG <noreply@landsvig.com>",
      to: "kasper@landsvig.com",
      subject: `Ny henvendelse fra ${name}${companyType ? ` — ${companyType}` : ""}`,
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
            ${companyType ? `<tr>
              <td style="padding: 8px 16px 8px 0; color: #999; vertical-align: top;">Virksomhedstype</td>
              <td style="padding: 8px 0;">${companyType}</td>
            </tr>` : ""}
            ${painPoint ? `<tr>
              <td style="padding: 8px 16px 8px 0; color: #999; vertical-align: top;">Udfordring</td>
              <td style="padding: 8px 0;">${painPoint}</td>
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
