(() => {
  "use strict";

  const DATA_URL = "../scripts/js/data/games/games-list.json";
  const grid = document.getElementById("gamesGrid");

  if (!grid) {
    console.error("[Voxel Forge] gamesGrid elementi bulunamadı.");
    return;
  }

  const STATUS_INFO = {
    active: {
      label: "AKTİF",
      className: "status-active",
    },
    "semi-active": {
      label: "YARI AKTİF",
      className: "status-semi-active",
    },
    inactive: {
      label: "PASİF",
      className: "status-inactive",
    },
    deleted: {
      label: "KALDIRILDI",
      className: "status-deleted",
    },
  };

  function createElement(tag, className, text) {
    const element = document.createElement(tag);

    if (className) {
      element.className = className;
    }

    if (text !== undefined && text !== null) {
      element.textContent = String(text);
    }

    return element;
  }

  function createCard(game) {
    const card = createElement("article", "detail-card");

    card.dataset.projectId = game.id;

    const heading = createElement("h3", "", game.name);
    const description = createElement("p", "", game.description);
    const tagsContainer = createElement("div", "tags");

    const status = STATUS_INFO[game.status] || {
      label: "DURUM BİLİNMİYOR",
      className: "status-unknown",
    };

    const statusTag = createElement("span", status.className, status.label);

    tagsContainer.appendChild(statusTag);

    if (Array.isArray(game.tags)) {
      game.tags.forEach((tag) => {
        tagsContainer.appendChild(createElement("span", "", tag));
      });
    }

    card.append(heading, description, tagsContainer);

    if (Array.isArray(game.links) && game.links.length > 0) {
      const linksContainer = createElement("div", "game-links");

      game.links.forEach((link) => {
        const linkElement = document.createElement("a");

        linkElement.className = "mod-btn";

        if (link.type === "notice" || !link.url) {
          linkElement.classList.add("deleted-btn");
          linkElement.href = "#";
          linkElement.setAttribute("aria-disabled", "true");

          linkElement.addEventListener("click", (event) => {
            event.preventDefault();
          });
        } else {
          try {
            const parsedUrl = new URL(link.url);

            if (!["https:", "http:"].includes(parsedUrl.protocol)) {
              return;
            }

            linkElement.href = parsedUrl.href;
            linkElement.target = "_blank";
            linkElement.rel = "noopener noreferrer";
          } catch {
            console.warn("[Voxel Forge] Geçersiz proje bağlantısı:", link.url);
            return;
          }
        }

        if (link.icon) {
          const icon = createElement("i", link.icon);
          icon.setAttribute("aria-hidden", "true");
          linkElement.appendChild(icon);
          linkElement.appendChild(document.createTextNode(" "));
        }

        linkElement.appendChild(
          document.createTextNode(link.label || "Projeyi görüntüle"),
        );

        linksContainer.appendChild(linkElement);
      });

      if (linksContainer.childElementCount > 0) {
        card.appendChild(linksContainer);
      }
    }

    return card;
  }

  async function loadGames() {
    try {
      const response = await fetch(DATA_URL, {
        cache: "no-cache",
      });

      if (!response.ok) {
        throw new Error(`JSON yüklenemedi: HTTP ${response.status}`);
      }

      const games = await response.json();

      if (!Array.isArray(games)) {
        throw new Error("games-list.json bir JSON dizisi olmalı.");
      }

      const validGames = games.filter(
        (game) =>
          game &&
          typeof game.id === "string" &&
          typeof game.name === "string" &&
          typeof game.description === "string",
      );

      const fragment = document.createDocumentFragment();

      validGames.forEach((game) => {
        fragment.appendChild(createCard(game));
      });

      if (validGames.length === 0) {
        grid.replaceChildren(
          createElement(
            "p",
            "glass-text",
            "Henüz listelenecek bir oyun projesi bulunmuyor.",
          ),
        );
      } else {
        grid.replaceChildren(fragment);
      }

      const activeCount = validGames.filter(
        (game) => game.status === "active",
      ).length;

      document.dispatchEvent(
        new CustomEvent("voxelforge:data-loaded", {
          detail: {
            category: "games",
            total: validGames.length,
            active: activeCount,
          },
        }),
      );

      console.info(`[Voxel Forge] ${validGames.length} oyun projesi yüklendi.`);
    } catch (error) {
      console.error("[Voxel Forge] Oyunlar yüklenemedi:", error);

      grid.replaceChildren(
        createElement(
          "p",
          "glass-text",
          "Oyun projeleri yüklenemedi. JSON dosyasını ve dosya yolunu kontrol et.",
        ),
      );
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

  loadGames();
})();
