// ================= INIT =================
window.addEventListener("DOMContentLoaded", async () => {
  await loadTeam();
  checkAdmin();

  const saveBtn = document.getElementById("saveMember");
  if (saveBtn) {
    saveBtn.addEventListener("click", saveMember);
  }
});

// ================= LOAD TEAM =================
async function loadTeam() {
  try {
    const res = await fetch("https://taskify-mo.ct.ws/api/team.php");
    const data = await res.json();

    const container = document.getElementById("teamContainer");
    container.innerHTML = "";

    data.forEach(member => {

      const div = document.createElement("div");
      div.className = "history-item";

      // 🔥 الشكل الجديد (الصورة فوق)
      div.innerHTML = `
        <div style="text-align:center;">

          <img src="images/${member.image}" 
               style="
                 width:100px;
                 height:100px;
                 border-radius:50%;
                 object-fit:cover;
                 margin-bottom:10px;
               ">

          <h3 style="margin-bottom:5px;">${member.name}</h3>

          <p style="color:#555;font-size:14px;">
            ${member.bio}
          </p>

        </div>

        <div class="admin-actions" data-id="${member.id}" style="margin-top:10px;text-align:center;"></div>
      `;

      container.appendChild(div);
    });

  } catch (err) {
    console.error("LOAD TEAM ERROR:", err);
  }
}

// ================= CHECK ADMIN =================
async function checkAdmin() {
  try {
    const user = localStorage.getItem("user");

    const res = await fetch("api/me.php?id=" + user);
    const data = await res.json();

    if (data.role === "admin") {
      enableAdminMode();
    }

  } catch (err) {
    console.error("ADMIN CHECK ERROR:", err);
  }
}

// ================= ADMIN MODE =================
function enableAdminMode() {

  // زرار Add Member
  const addBtn = document.createElement("button");
  addBtn.innerText = "➕ Add Member";

  addBtn.style.cssText = `
    margin:20px;
    padding:10px 15px;
    background:#4f46e5;
    color:white;
    border:none;
    border-radius:8px;
    cursor:pointer;
  `;

  addBtn.onclick = showAddForm;
  document.body.prepend(addBtn);

  // زرار Delete لكل عضو
  setTimeout(() => {
    document.querySelectorAll(".admin-actions").forEach(div => {

      const id = div.dataset.id;

      const delBtn = document.createElement("button");
      delBtn.innerText = "Delete";

      delBtn.style.cssText = `
        background:#ef4444;
        color:white;
        border:none;
        padding:6px 12px;
        border-radius:6px;
        cursor:pointer;
      `;

      delBtn.onclick = () => deleteMember(id);

      div.appendChild(delBtn);
    });
  }, 200);
}

// ================= OPEN MODAL =================
function showAddForm() {
  document.getElementById("addModal").classList.remove("hidden");
}

// ================= CLOSE MODAL =================
function closeModal() {
  document.getElementById("addModal").classList.add("hidden");
}

// ================= SAVE MEMBER =================
async function saveMember() {

  console.log("SAVE CLICKED");

  const name = document.getElementById("memberName").value;
  const bio = document.getElementById("memberBio").value;
  const file = document.getElementById("memberImage").files[0];

  console.log(name, bio, file);

  if (!name || !bio) {
    alert("Fill name & bio");
    return;
  }

  if (!file) {
    alert("Choose image first");
    return;
  }

  const formData = new FormData();
  formData.append("name", name);
  formData.append("bio", bio);
  formData.append("image", file);

  try {
    const res = await fetch("api/addMember.php", {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    console.log("ADD MEMBER:", data);

    if (data.status === "success") {
      closeModal();
      loadTeam();
    } else {
      alert("Error: " + data.msg);
    }

  } catch (err) {
    console.error("ERROR:", err);
  }
}

// ================= DELETE MEMBER =================
async function deleteMember(id) {

  if (!confirm("Delete this member?")) return;

  try {
    const res = await fetch("api/deleteMember.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id })
    });

    const data = await res.json();
    console.log("DELETE MEMBER:", data);

    loadTeam();

  } catch (err) {
    console.error("DELETE ERROR:", err);
  }
}
