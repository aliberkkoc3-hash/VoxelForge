(() => {
  "use strict";

  const DATA_URL = "../scripts/js/data/sites/sites-list.json";

  function createTag(text) {
    const tag = document.createElement("span");
    tag.textContent = String(text ?? "");
    return tag;
  }

  function createLink(link) {
    const anchor = document.createElement("a");
    anchor.className = "mod-btn";
    anchor.href = link.url;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";

    if (link.icon) {
      const icon = document.createElement("i");
      icon.className = link.icon;
      icon.setAttribute("aria-hidden", "true");
      anchor.append(icon, document.createTextNode(" "));
    }

    anchor.append(document.createTextNode(String(link.label ?? "Siteyi aç")));
    return anchor;
  }

  function createCard(site) {
    const card = document.createElement("div");
    card.className = "detail-card";

    const title = document.createElement("h3");
    title.textContent = site.name;

    const description = document.createElement("p");
    description.textContent = site.description;

    const tags = document.createElement("div");
    tags.className = "tags";

    tags.append(createTag(site.status === "active" ? "ACTIVE" : "INACTIVE"));

    for (const tag of Array.isArray(site.tags) ? site.tags : []) {
      tags.append(createTag(tag));
    }

    const links = document.createElement("div");
    links.className = "site-links";

    for (const link of Array.isArray(site.links) ? site.links : []) {
      if (
        !link ||
        typeof link.url !== "string" ||
        !/^https?:\/\//i.test(link.url)
      ) {
        console.warn("[SITES.js] Geçersiz bağlantı:", site.id, link);
        continue;
      }

      links.append(createLink(link));
    }

    card.append(title, description, tags);

    if (links.childElementCount > 0) {
      card.append(links);
    }

    return card;
  }

  async function init() {
    const grid = document.querySelector(".content-grid");
    if (!grid) return;

    try {
      const response = await fetch(DATA_URL, { cache: "no-cache" });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("JSON kök verisi bir dizi olmalı.");
      }

      const validSites = data.filter((site) => {
        const valid =
          site &&
          typeof site.name === "string" &&
          typeof site.description === "string" &&
          ["active", "inactive"].includes(site.status);

        if (!valid) {
          console.warn("[SITES.js] Geçersiz site kaydı atlandı:", site);
        }

        return valid;
      });

      const fragment = document.createDocumentFragment();

      for (const site of validSites) {
        fragment.append(createCard(site));
      }

      grid.replaceChildren(fragment);

      document.dispatchEvent(
        new CustomEvent("voxelforge:data-loaded", {
          detail: {
            category: "sites",
            total: validSites.length,
            active: validSites.filter((site) => site.status === "active")
              .length,
          },
        }),
      );
    } catch (error) {
      console.error("[SITES.js] Site verileri yüklenemedi:", error);

      const message = document.createElement("p");
      message.className = "glass-text";
      message.textContent =
        "Site verileri şu anda yüklenemiyor. Lütfen daha sonra tekrar deneyin.";

      grid.replaceChildren(message);
    }
  }

  mobileMenuButton.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");

    mobileMenuButton.setAttribute("aria-expanded", String(isOpen));

    mobileMenuButton.setAttribute(
      "aria-label",
      isOpen ? "Menüyü kapat" : "Menüyü aç",
    );

    mobileMenuButton.innerHTML = isOpen
      ? '<i class="fa-solid fa-xmark" aria-hidden="true"></i>'
      : '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
