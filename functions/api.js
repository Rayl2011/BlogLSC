export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  // ----------------------------------------
  // POST /api/upload
  // ----------------------------------------
  if (url.pathname === "/api/upload" && request.method === "POST") {
    const data = await request.json();
    const id = Date.now().toString();

    const post = {
      id,
      title: data.title || "Untitled Post",
      content: data.content || "",
      time: Date.now(),
    };

    await env.BLOG_DB.put(`post:${id}`, JSON.stringify(post));

    return new Response(
      JSON.stringify({ success: true, id }),
      { headers: { "Content-Type": "application/json" } }
    );
  }

  // ----------------------------------------
  // GET /api/posts
  // ----------------------------------------
  if (url.pathname === "/api/posts") {
    const list = await env.BLOG_DB.list({ prefix: "post:" });
    const posts = [];

    for (const key of list.keys) {
      const item = await env.BLOG_DB.get(key.name);
      if (item) posts.push(JSON.parse(item));
    }

    // newest first
    posts.sort((a, b) => b.time - a.time);

    return new Response(JSON.stringify(posts), {
      headers: { "Content-Type": "application/json" }
    });
  }

  // ----------------------------------------
  // GET /api/post?id=xxxx
  // ----------------------------------------
  if (url.pathname === "/api/post") {
    const id = url.searchParams.get("id");
    if (!id) {
      return new Response("missing id", { status: 400 });
    }

    const raw = await env.BLOG_DB.get(`post:${id}`);
    if (!raw) {
      return new Response("post not found", { status: 404 });
    }

    return new Response(raw, {
      headers: { "Content-Type": "application/json" }
    });
  }

  return new Response("API OK");
}
