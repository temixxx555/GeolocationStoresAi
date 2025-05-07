const navLinks = document.getElementById("nav-links");
const toggle = document.getElementById("menu-toggle");
const cancelBtn = document.getElementById("cancel-btn");

toggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

cancelBtn.addEventListener("click", () => {
  navLinks.classList.remove("active");
});
