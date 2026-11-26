document.addEventListener("DOMContentLoaded", () => {
  const navItems = [
    ["Index", ""],
    ["About", "about"],
    ["Activities", "activities"],
    ["Communication", "communication"],
    ["Appointments", "appointments"]
  ];

  const siteUrl = window.location.origin; // Ajustez si sous-dossier WordPress

  const nav = navItems.map(([label, slug]) =>
    `<a href="${siteUrl}/${slug}">${label}</a>`
  ).join("");

  document.querySelectorAll("[data-site-header]").forEach((el) => {
    el.innerHTML = `<header class="topbar">
      <a class="logo" href="${siteUrl}">NEPTUNE®</a>
      <nav class="nav">${nav}<a href="${siteUrl}/chat">Members ↗</a></nav>
    </header>`;
  });

  document.querySelectorAll("[data-site-footer]").forEach((el) => {
    el.innerHTML = `<footer class="footer">
      <span>Neptune — Independent by nature</span>
      <a href="mailto:contact@neptune.studio">Contact ↗</a>
      <span>© ${new Date().getFullYear()}</span>
    </footer>`;
  });
});