fetch("api/history.php")
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("historyContainer");

    if (!data.length) {
      container.innerHTML = "<p>No history</p>";
      return;
    }

    data.forEach(task => {
      const div = document.createElement("div");
      div.className = "task";

      div.innerHTML = `
        <span>${task.title}</span>
        <button onclick="restore(${task.id})">Restore</button>
      `;

      container.appendChild(div);
    });
  });

function restore(id) {
  fetch("api/restore.php", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ id })
  }).then(() => location.reload());
}