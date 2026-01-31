console.log("script.js loaded ✅");

if (sessionStorage.getItem("loggedIn") === "yes") {
  const loginCard = document.querySelector(".login-card");
  if (loginCard) loginCard.style.display = "none";
}


// ===================== LOGIN =====================
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("loginEmail")?.value.trim();
  const password = document.getElementById("loginPassword")?.value.trim();

  if (!email || !password) return alert("Enter email & password");

  try {
    const res = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    sessionStorage.setItem("loggedIn", "yes");


    const data = await res.json();
    if (!res.ok) return alert(data.message);

    alert("Login success ✅");

    // hide login section after success
    const loginCard = document.querySelector(".login-card");
    if (loginCard) loginCard.style.display = "none";

  } catch (err) {
    alert("Backend not reachable ❌ Run server.js first");
  }
});

// ===================== REGISTER =====================
document.getElementById("registerForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("regName")?.value.trim();
  const email = document.getElementById("regEmail")?.value.trim();
  const password = document.getElementById("regPassword")?.value.trim();

  if (!name || !email || !password) return alert("Fill all details");

  try {
    const res = await fetch("http://localhost:5000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();
    if (!res.ok) return alert(data.message);

    alert("Account created ✅ Now login");
    window.location.href = "index.html";

  } catch (err) {
    alert("Backend not reachable ❌ Run server.js first");
  }
});

// ===================== FORGOT PASSWORD =====================
document.getElementById("forgotForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("fpEmail")?.value.trim();
  const newPassword = document.getElementById("fpNewPassword")?.value.trim();

  if (!email || !newPassword) return alert("Fill all details");

  try {
    const res = await fetch("http://localhost:5000/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, newPassword })
    });

    const data = await res.json();
    if (!res.ok) return alert(data.message);

    alert("Password updated ✅");
    window.location.href = "index.html";

  } catch (err) {
    alert("Backend not reachable ❌ Run server.js first");
  }
});


// ===================== APPLY PAGE =====================
const applyForm = document.getElementById("applyForm");

if (applyForm) {
  applyForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const borrowerName = document.getElementById("borrowerName").value.trim();
    const loanType = document.getElementById("loanType").value.trim();
    const loanAmount = document.getElementById("loanAmount").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const address = document.getElementById("address").value.trim();

    const res = await fetch("http://localhost:5000/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ borrowerName, loanType, loanAmount, phone, address })
    });

    const data = await res.json();

    if (res.ok) {
      alert("Application submitted ✅");
    } else {
      alert(data.message);
    }
  });
}
