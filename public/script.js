async function loadPosts() {
  const res = await fetch("/api/posts");
  const posts = await res.json();

  const container = document.getElementById("posts");
  container.innerHTML = "";

  posts.sort((a, b) => b.time - a.time); // newest first

  posts.forEach(post => {
    const div = document.createElement("div");
    div.className = "post";

    div.innerHTML = `
      <div class="title">${post.title}</div>
      <div class="date">${new Date(post.time).toLocaleString()}</div>
      <div class="content">${post.content.replace(/\n/g, "<br>")}</div>
    `;

    container.appendChild(div);
  });
}

loadPosts();