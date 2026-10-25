(() => {
  "use strict";

  const DATA_URL = "../scripts/js/data/bots/bots-list.json";

  const escapeText = (value) => String(value ?? "");

  function createTag(text, deleted = false) {
    const tag = document.createElement("span");
    tag.textContent = escapeText(text);

    if (deleted) tag.classList.add("tag-deleted");

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

    anchor.append(document.createTextNode(escapeText(link.label)));
    return anchor;
  }

  function createCard(bot) {
    const card = document.createElement("div");
    card.className = "detail-card";

    const deleted = bot.status === "deleted";
    if (deleted) card.classList.add("deleted-card");

    const title = document.createElement("h3");
    title.textContent = escapeText(bot.name);

    const description = document.createElement("p");
    description.textContent = escapeText(bot.description);

    const tags = document.createElement("div");
    tags.className = "tags";

    tags.append(
      createTag(deleted ? "SİLİNDİ" : "AKTİF", deleted)
    );

    for (const tag of Array.isArray(bot.tags) ? bot.tags : []) {
      tags.append(createTag(tag));
    }

    card.append(title, description, tags);

    const links = Array.isArray(bot.links) ? bot.links : [];

    if (links.length > 0) {
      const linkContainer = document.createElement("div");
      linkContainer.className = "bot-links";

      for (const link of links) {
        if (
          !link ||
          typeof link.url !== "string" ||
          !/^https?:\/\//i.test(link.url)
        ) {
          console.warn("[BOT.js] Geçersiz bağlantı:", bot.id, link);
          continue;
        }

        linkContainer.append(createLink(link));
      }

      card.append(linkContainer);
    } else if (deleted) {
      const notice = document.createElement("span");
      notice.className = "mod-btn deleted-btn";
      notice.textContent = "Proje artık aktif değil";
      card.append(notice);
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

      const validBots = data.filter((bot) => {
        const valid =
          bot &&
          typeof bot.name === "string" &&
          typeof bot.description === "string" &&
          ["active", "deleted"].includes(bot.status);

        if (!valid) {
          console.warn("[BOT.js] Geçersiz bot kaydı atlandı:", bot);
        }

        return valid;
      });

      const fragment = document.createDocumentFragment();

      for (const bot of validBots) {
        fragment.append(createCard(bot));
      }

      grid.replaceChildren(fragment);

      document.dispatchEvent(
        new CustomEvent("voxelforge:data-loaded", {
          detail: {
            category: "bots",
            total: validBots.length,
            active: validBots.filter((bot) => bot.status === "active").length
          }
        })
      );
    } catch (error) {
      console.error("[BOT.js] Bot verileri yüklenemedi:", error);

      const message = document.createElement("p");
      message.className = "glass-text";
      message.textContent =
        "Bot verileri şu anda yüklenemiyor. Lütfen daha sonra tekrar deneyin.";

      grid.replaceChildren(message);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();