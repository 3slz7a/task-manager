let deleteTargetId = null;

// ================= INIT =================
window.addEventListener("DOMContentLoaded", () => {

  console.log("APP JS LOADED");

  const form = document.getElementById("taskForm");
  const userId = localStorage.getItem("user");

  // 🔥 auth check
  if (!userId) {
    window.location.href = "login.html";
    return;
  }

  initDragDrop();
  initDelete();
  initUI();
  loadTasks();
  loadUser();

  if (!form) return;

  // ================= ADD TASK =================
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const due_date = document.getElementById("dueDate").value;
    const priority = document.getElementById("priority").value;

    try {
      const res = await fetch("https://taskify-mo.ct.ws/api/create.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          due_date,
          priority,
          user_id: userId
        })
      });

      const data = await res.json();
      console.log("CREATE:", data);

      form.reset();
      loadTasks();

    } catch (err) {
      console.error("CREATE ERROR:", err);
    }
  });

});

// ================= PROFILE IMAGE =================
const uploadInput = document.getElementById("uploadImage");

if (uploadInput) {
  uploadInput.addEventListener("change", async () => {

    const file = uploadInput.files[0];
    if (!file) return;

    const user = localStorage.getItem("user");

    const formData = new FormData();
    formData.append("image", file);
    formData.append("user_id", user);

    const res = await fetch("https://taskify-mo.ct.ws/api/upload.php", {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    console.log("UPLOAD:", data);

    if (data.status === "success") {
      loadProfileImage(data.image);
    } else {
      alert("Upload failed");
    }
  });
}

// ================= LOAD PROFILE =================
async function loadUser() {
  const user = localStorage.getItem("user");

  const res = await fetch("https://taskify-mo.ct.ws/api/getUser.php?id=" + user);
  const data = await res.json();

  if (data && data.image) {
    loadProfileImage(data.image);
  }
}

function loadProfileImage(image) {
  const btn = document.querySelector(".account-btn");
  if (!btn) return;

  btn.innerHTML = `<img src="https://taskify-mo.ct.ws/images/${image}" style="width:100%;height:100%;border-radius:50%">`;
}

// ================= LOAD TASKS =================
async function loadTasks() {
  try {
    const userId = localStorage.getItem("user");

    const res = await fetch("https://taskify-mo.ct.ws/api/get.php?user_id=" + userId);
    const tasks = await res.json();

    const todo = document.getElementById("todo");
    const inProgress = document.getElementById("inProgress");
    const done = document.getElementById("done");

    if (todo) todo.innerHTML = "<h2>To Do</h2>";
    if (inProgress) inProgress.innerHTML = "<h2>In Progress</h2>";
    if (done) done.innerHTML = "<h2>Done</h2>";

    tasks.forEach(createTask);

    updateTicker(tasks);

  } catch (err) {
    console.error("LOAD ERROR:", err);
  }
}

// ================= CREATE TASK =================
function createTask(task) {

  let status = task.status;
  if (status === "in-progress") status = "inProgress";

  const column = document.getElementById(status);
  if (!column) return;

  const div = document.createElement("div");
  div.className = "task";
  div.setAttribute("data-id", task.id);
  div.setAttribute("draggable", true);

  div.innerHTML = `
    <h3>${task.title}</h3>
    <p>${task.due_date}</p>
    <span class="priority ${task.priority}">${task.priority}</span>
    <button class="delete">Delete</button>
  `;

  // 🔥 DELETE BUTTON
  div.querySelector(".delete").onclick = () => {
    deleteTargetId = task.id;
    document.getElementById("modal").classList.remove("hidden");
  };

  // 🔥 DRAG
  div.addEventListener("dragstart", () => div.classList.add("dragging"));
  div.addEventListener("dragend", () => div.classList.remove("dragging"));

  column.appendChild(div);
}

// ================= DELETE =================
function initDelete() {

  const confirmBtn = document.getElementById("confirmDelete");
  const cancelBtn = document.getElementById("cancelDelete");
  const modal = document.getElementById("modal");

  if (!confirmBtn || !cancelBtn || !modal) return;

  confirmBtn.addEventListener("click", async () => {

    if (!deleteTargetId) return;

    const taskElement = document.querySelector(`[data-id="${deleteTargetId}"]`);

    if (taskElement) {
      taskElement.style.transition = "all 0.3s ease";
      taskElement.style.opacity = "0";
      taskElement.style.transform = "translateX(50px)";
    }

    try {
      const res = await fetch("https://taskify-mo.ct.ws/api/delete.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: deleteTargetId })
      });

      const data = await res.json();
      console.log("DELETE:", data);

      if (data.status === "success") {

        setTimeout(() => {
          if (taskElement) taskElement.remove();
          loadTasks();
        }, 300);

      } else {
        alert("Delete failed");
      }

    } catch (err) {
      console.error("DELETE ERROR:", err);
    }

    deleteTargetId = null;
    modal.classList.add("hidden");
  });

  cancelBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
    deleteTargetId = null;
  });
}

// ================= DRAG & DROP =================
function initDragDrop() {

  document.querySelectorAll(".column").forEach(col => {

    col.addEventListener("dragover", async (e) => {
      e.preventDefault();

      const dragging = document.querySelector(".dragging");
      if (!dragging) return;

      col.appendChild(dragging);

      await fetch("https://taskify-mo.ct.ws/api/update.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: dragging.dataset.id,
          status: col.id
        })
      });
    });

  });
}

// ================= TICKER =================
function updateTicker(tasks) {

  const track = document.getElementById("tickerTrack");
  if (!track) return;

  const order = { high: 1, medium: 2, low: 3 };

  tasks.sort((a, b) => order[a.priority] - order[b.priority]);

  track.innerHTML = "";

  tasks.forEach(task => {
    const div = document.createElement("div");
    div.className = `ticker-item ${task.priority}`;
    div.textContent = `📌 ${task.title} - ${task.priority}`;
    track.appendChild(div);
  });
}

// ================= UI =================
function initUI() {

  const account = document.querySelector(".account");
  const dropdown = document.querySelector(".dropdown");

  if (!account || !dropdown) return;

  account.onclick = (e) => {
    e.stopPropagation();
    dropdown.style.display =
      dropdown.style.display === "flex" ? "none" : "flex";
  };

  document.addEventListener("click", () => {
    dropdown.style.display = "none";
  });
}
