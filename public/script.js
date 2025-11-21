<script>
async function loadPosts() {
  const res = await fetch("/api/posts");
  const posts = await res.json();

  const container = document.getElementById("posts");
  container.innerHTML = "";

  // Newest first
  posts.sort((a, b) => b.time - a.time);

  // Escape HTML to prevent XSS
  function escapeHTML(input) {
    return input
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  posts.forEach(post => {
    const div = document.createElement("div");
    div.className = "post";

    const preview = post.content.slice(0, 120) + "...";

    div.innerHTML = `
      <a class="title" href="/post.html?id=${post.id}">${escapeHTML(post.title)}</a>
      <div class="date">${new Date(post.time).toLocaleString()}</div>
      <div class="preview">${escapeHTML(preview)}</div>
    `;

    container.appendChild(div);
  });
}

loadPosts();
</script>
