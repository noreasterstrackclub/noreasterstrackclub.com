
export async function onRequestPost(context) {
  const { request, env } = context;

  const form = await request.formData();
  const password = form.get("password");

  if (
    typeof password !== "string" ||
    !env.MEMBERS_PASSWORD ||
    password !== env.MEMBERS_PASSWORD
  ) {
    return new Response("Incorrect password. Please go back and try again.", {
      status: 401,
      headers: { "Content-Type": "text/plain; charset=utf-8" }
    });
  }

  return new Response(
    "Password accepted. The members area is not connected yet.",
    {
      headers: { "Content-Type": "text/plain; charset=utf-8" }
    }
  );
}
