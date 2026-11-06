
const encoder = new TextEncoder();

async function sign(value, secret) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(value)
  );

  return Array.from(new Uint8Array(signature))
    .map(byte => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function onRequestGet({ request, env }) {
  const cookies = request.headers.get("Cookie") || "";

  const session = cookies
    .split(";")
    .map(cookie => cookie.trim())
    .find(cookie => cookie.startsWith("ntc_session="));

  if (!session || !env.MEMBERS_SESSION_SECRET) {
    return Response.redirect(
      new URL("/team-login.html", request.url),
      302
    );
  }

  const token = session.substring("ntc_session=".length);
  const match = /^member:(\d+):([0-9a-f]{64})$/.exec(token);

  if (!match) {
    return Response.redirect(
      new URL("/team-login.html", request.url),
      302
    );
  }

  const expires = Number(match[1]);
  const suppliedSignature = match[2];
  const expectedSignature = await sign(
    `member:${expires}`,
    env.MEMBERS_SESSION_SECRET
  );

  if (
    expires <= Math.floor(Date.now() / 1000) ||
    suppliedSignature !== expectedSignature
  ) {
    return Response.redirect(
      new URL("/team-login.html", request.url),
      302
    );
  }

  return new Response(
    `<!doctype html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Member Resources | Nor’easters Track Club</title>
      <link rel="stylesheet" href="/assets/style.css">
    </head>
    <body>
      <header class="header">
        <div class="wrap nav">
          <a class="brand" href="/index.html">NOR’EASTERS TRACK CLUB</a>
          <nav class="links">
            <a href="/index.html">Home</a>
            <a href="/about.html">About Us</a>
            <a href="/roster.html">Roster</a>
            <a href="/team-login.html" aria-current="page">Members</a>
            <a href="/contact.html">Contact</a>
          </nav>
        </div>
      </header>
      <main>
        <section class="wrap section narrow">
          <h1>Member Resources</h1>
          <div class="member-panel">
            <h2>Welcome, Nor’easters!</h2>
            <p>This is your members-only area.</p>
            <p>Team store, handbook, and race schedule links will go here.</p>
          </div>
        </section>
      </main>
      <footer>
        <div class="wrap footer">
          <span>Nor’easters Track Club · Greater Boston</span>
          <a href="https://www.instagram.com/noreasterstrackclub/">Instagram</a>
        </div>
      </footer>
    </body>
    </html>`,
    {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "private, no-store"
      }
    }
  );
}
