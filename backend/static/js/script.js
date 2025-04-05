document.addEventListener("DOMContentLoaded", function () {
  checkAuth(); // Check if user is logged in

  document.getElementById("loginForm").addEventListener("submit", async function (event) {
      event.preventDefault();

      const email = document.getElementById("email1").value;
      const password = document.getElementById("password1").value;

      const response = await fetch("/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.token) {
          localStorage.setItem("token", data.token);
          alert("Login successful!");
          showDashboard();
      } else {
          alert("Login failed! Check your credentials.");
      }
  });

  document.getElementById("signupForm").addEventListener("submit", async function (event) {
      event.preventDefault();

      const email = document.getElementById("email2").value;
      const password = document.getElementById("password2").value;

      const response = await fetch("/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
      });

      if (response.status === 201) {
          alert("Signup successful! Please log in.");
      } else {
          alert("Signup failed! Email might be taken.");
      }
  });

  document.getElementById("logoutBtn").addEventListener("click", function () {
      localStorage.removeItem("token");
      alert("Logged out successfully!");
      showAuthForm();
  });
});

// 🔑 Check if user is logged in
function checkAuth() {
  const token = localStorage.getItem("token");
  token ? showDashboard() : showAuthForm();
}

// 🎯 Show dashboard
function showDashboard() {
  document.getElementById("auth-section").style.display = "none";
  document.getElementById("dashboard").style.display = "block";
}

// 🛑 Show login/signup form
function showAuthForm() {
  document.getElementById("auth-section").style.display = "block";
  document.getElementById("dashboard").style.display = "none";
}

// 📥 Upload PhonePe Statement
async function uploadPhonePeStatement() {
  const fileInput = document.getElementById("phonepeFile");
  const file = fileInput.files[0];
  if (!file) {
      alert("Please select a PDF file to upload.");
      return;
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
      const response = await fetch("/upload_phonepe", {
          method: "POST",
          headers: { "x-access-token": localStorage.getItem("token") },
          body: formData
      });

      const data = await response.json();
      if (response.ok) {
          alert(data.message);
      } else {
          alert(data.error || "Failed to upload the PDF.");
      }
  } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file. Please try again.");
  }
}
