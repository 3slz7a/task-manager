document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("loginForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const res = await fetch("api/login.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const text = await res.text();
      console.log("RAW:", text);

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        alert("API مش بيرجع JSON");
        return;
      }

      console.log("DATA:", data);

      // 🔥 حتى لو الباك غلط، نخزن يدوي
      if (data.user_id || data.id) {

        const userId = data.user_id || data.id;

        localStorage.setItem("user", userId);

        console.log("FORCED SAVE:", localStorage.getItem("user"));

        window.location.href = "index.html";

      } else {
        alert("Login failed: مفيش user_id راجع");
      }

    } catch (err) {
      console.error(err);
    }
  });

});