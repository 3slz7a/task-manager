// ================= INIT =================
window.addEventListener("DOMContentLoaded", () => {

  const user = localStorage.getItem("user");

  // 🔥 لو مش مسجل دخول
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  loadHistory();

});


// ================= LOAD HISTORY =================
async function loadHistory() {

  try {
    const user = localStorage.getItem("user");

    const res = await fetch("https://taskify-mo.ct.ws/api/history.php?user_id=" + user);
    const data = await res.json();

    console.log("HISTORY:", data);

    const container = document.getElementById("historyContainer");
    container.innerHTML = "";

    if (!data.length) {
      container.innerHTML = "<p>No deleted tasks</p>";
      return;
    }

    data.forEach(task => {

      const div = document.createElement("div");
      div.className = "history-item";

      div.innerHTML = `
        <h3>${task.title}</h3>
        <p>${task.due_date}</p>
        <span class="priority ${task.priority}">${task.priority}</span>
        <button class="restore-btn">Restore</button>
      `;

      // 🔥 restore button
      div.querySelector(".restore-btn").onclick = () => {
        restoreTask(task.id);
      };

      container.appendChild(div);

    });

  } catch (err) {
    console.error("HISTORY ERROR:", err);
  }

}


// ================= RESTORE =================
async function restoreTask(id) {

  try {

    const res = await fetch("https://taskify-mo.ct.ws/api/restore.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id })
    });

    const data = await res.json();
    console.log("RESTORE:", data);

    if (data.status === "success") {

      // 🔥 اعادة تحميل
      loadHistory();

    } else {
      alert("Restore failed");
    }

  } catch (err) {
    console.error("RESTORE ERROR:", err);
  }

}
