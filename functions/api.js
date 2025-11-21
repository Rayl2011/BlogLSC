export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  // ------------------------
  // Upload post
  // ------------------------
  if (url.pathname === "/api/upload" && request.method === "POST") {
    const data = await request.json();
    const id = Date.now().toString();

    const post = {
      id,
      title: data.title || "Untitled Post",
      content: data.content || "",
      time: Date.now()
    };

    await env.BLOG_DB.put(id, JSON.stringify(post));
    return new Response("Post uploaded successfully!");
  }

  // ------------------------
  // List posts
  // ------------------------
  if (url.pathname === "/api/posts") {
    const list = await env.BLOG_DB.list();
    const posts = [];

    for (const key of list.keys) {
      const item = await env.BLOG_DB.get(key.name);
      posts.push(JSON.parse(item));
    }

    return new Response(JSON.stringify(posts), {
      headers: { "Content-Type": "application/json" }
    });
  }

  // ------------------------
  // Single post retrieval
  // ------------------------
  if (url.pathname === "/api/post") {
    const id = url.searchParams.get("id");

    if (!id) {
      return new Response("missing id", { status: 400 });
    }

    const raw = await env.BLOG_DB.get(id);
    if (!raw) {
      return new Response("post not found", { status: 404 });
    }

    return new Response(raw, {
      headers: { "Content-Type": "application/json" }
    });
  }

  return new Response("API OK");
}