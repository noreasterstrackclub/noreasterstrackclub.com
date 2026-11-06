
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

export async function onRequestPost({ request, env }) {
  if (!env.MEMBERS_PASSWORD || !env.MEMBERS_SESSION_SECRET) {
    return new Response("Login is temporarily unavailable.", {
      status: 503
    });
  }

  const form = await request.formData();
  const password = form.get("password");

  if (password !== env.MEMBERS_PASSWORD) {
    return new Response("Incorrect password. Please go back and try again.", {
      status: 401
    });
  }

  // Session expires after 7 days.
  const expires = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;
  const payload = `member:${expires}`;
  const signature = await sign(payload, env.MEMBERS_SESSION_SECRET);
  const token = `${payload}:${signature}`;

  return new Response(null, {
    status: 303,
    headers: {
      "Location": "/members/",
      "Set-Cookie":
        `ntc_session=${token}; Path=/members; ` +
        `HttpOnly; Secure; SameSite=Lax; Max-Age=604800`
    }
  });
}
