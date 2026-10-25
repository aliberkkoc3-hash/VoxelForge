/** Kısa bildirimler. Mesaj HTML olarak değil, düz metin olarak eklenir. */
let toastTimer;

export function showToast(message) {
  let toast = document.getElementById("fnfToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "fnfToast";
    toast.className = "fnf-toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);
  }

  toast.replaceChildren();
  const icon = document.createElement("i");
  icon.className = "fa-solid fa-circle-exclamation";
  icon.setAttribute("aria-hidden", "true");
  toast.append(icon, document.createTextNode(` ${String(message ?? "")}`));
  toast.classList.remove("show");
  void toast.offsetWidth;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 3000);
}
