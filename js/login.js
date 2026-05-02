// ================= LOGIN =================
async function login() {

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Please enter email and password");
    return;
  }

  try {
    const res = await fetch("https://taskify-mo.ct.ws/api/login.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    console.log("LOGIN RESPONSE:", data);

    if (data.status === "success") {
      localStorage.setItem("user", data.user_id);

      // 🔥 redirect
      window.location.href = "index.html";

    } else {
      alert(data.message || "Wrong email or password");
    }

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    alert("Server error");
  }
}


// ================= REGISTER =================
async function register() {

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Fill all fields");
    return;
  }

  try {
    const res = await fetch("https://taskify-mo.ct.ws/api/register.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    console.log("REGISTER:", data);

    if (data.status === "success") {
      alert("Account created successfully");
      window.location.href = "login.html";
    } else {
      alert(data.message || "Register failed");
    }

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    alert("Server error");
  }
}
