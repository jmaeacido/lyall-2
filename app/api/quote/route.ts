const CLIENT_EMAIL = "Stevelyall67@gmail.com";
const FORD_EMAIL = "team@alchemydev.io";
const NOTIFY_EMAILS = [CLIENT_EMAIL, FORD_EMAIL] as const;

type QuoteDetails = {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  service: string;
  message: string;
  photos: string[];
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

async function notifyRecipients(details: QuoteDetails) {
  const subject = `New quote request — Lyall Property Care (${details.name || "Website"})`;
  const text = [
    "New Lyall Property Care quote request",
    "",
    `Request ID: ${details.id}`,
    `Submitted: ${details.createdAt}`,
    `Name: ${details.name}`,
    `Phone: ${details.phone}`,
    `Email: ${details.email}`,
    `Location: ${details.location}`,
    `Service: ${details.service}`,
    "",
    "Message:",
    details.message,
    "",
    details.photos.length
      ? `Photos uploaded: ${details.photos.length}`
      : "Photos uploaded: none",
  ].join("\n");

  const html = `
    <h2>New Lyall Property Care quote request</h2>
    <p><strong>Request ID:</strong> ${escapeHtml(details.id)}<br/>
    <strong>Submitted:</strong> ${escapeHtml(details.createdAt)}</p>
    <table cellpadding="6" cellspacing="0" style="border-collapse:collapse">
      <tr><td><strong>Name</strong></td><td>${escapeHtml(details.name)}</td></tr>
      <tr><td><strong>Phone</strong></td><td>${escapeHtml(details.phone)}</td></tr>
      <tr><td><strong>Email</strong></td><td>${escapeHtml(details.email)}</td></tr>
      <tr><td><strong>Location</strong></td><td>${escapeHtml(details.location)}</td></tr>
      <tr><td><strong>Service</strong></td><td>${escapeHtml(details.service)}</td></tr>
      <tr><td><strong>Photos</strong></td><td>${details.photos.length}</td></tr>
    </table>
    <p><strong>Message</strong></p>
    <pre style="white-space:pre-wrap;font-family:inherit">${escapeHtml(details.message)}</pre>
  `;

  const payload = {
    name: details.name,
    phone: details.phone,
    email: details.email,
    location: details.location,
    service: details.service,
    message: details.message,
    requestId: details.id,
    submittedAt: details.createdAt,
    photos: details.photos.length ? `${details.photos.length} uploaded` : "none",
    _subject: subject,
    _template: "table",
    _captcha: "false",
    _replyto: details.email || CLIENT_EMAIL,
    text,
    html,
  };

  const results = await Promise.all(
    NOTIFY_EMAILS.map(async (to) => {
      const response = await fetch(`https://formsubmit.co/ajax/${to}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const body = await response.text().catch(() => "");
        throw new Error(`Notify ${to} failed (${response.status}): ${body}`);
      }
      return to;
    }),
  );

  return results;
}

export async function POST(request: Request) {
  try {
    const { env } = await import("cloudflare:workers");
    const data = await request.formData();
    const id = crypto.randomUUID();
    const photos = data
      .getAll("photos")
      .filter((x): x is File => x instanceof File && x.size > 0);

    if (photos.length > 6) {
      return Response.json({ error: "Too many photos" }, { status: 400 });
    }

    const saved: string[] = [];
    for (const [i, file] of photos.entries()) {
      if (!file.type.startsWith("image/") || file.size > 10_000_000) continue;
      const key = `quote-requests/${id}/photo-${i + 1}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
      await env.BUCKET.put(key, file.stream(), {
        httpMetadata: { contentType: file.type },
      });
      saved.push(key);
    }

    const details: QuoteDetails = {
      id,
      createdAt: new Date().toISOString(),
      name: String(data.get("name") || ""),
      phone: String(data.get("phone") || ""),
      email: String(data.get("email") || ""),
      location: String(data.get("location") || ""),
      service: String(data.get("service") || ""),
      message: String(data.get("message") || ""),
      photos: saved,
    };

    await env.BUCKET.put(
      `quote-requests/${id}/request.json`,
      JSON.stringify(details, null, 2),
      { httpMetadata: { contentType: "application/json" } },
    );

    let emailed = false;
    try {
      await notifyRecipients(details);
      emailed = true;
    } catch (error) {
      console.error("Quote email notify failed", error);
    }

    return Response.json({ ok: true, id, emailed });
  } catch {
    return Response.json({ error: "Unable to save request" }, { status: 500 });
  }
}
