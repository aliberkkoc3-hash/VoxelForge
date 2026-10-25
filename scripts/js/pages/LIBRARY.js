"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const DATA_BASE_URL = "../scripts/js/data/library/";

  const DATA_FILES = {
    mods: "mods-list.json",
    resourcepacks: "resourcepacks-list.json",
    datapacks: "datapacks-list.json",
    shaderpacks: "shaderpacks-list.json",
    plugins: "plugins-list.json",
  };

  const PLACEHOLDER_IMAGE = "../../art/mods/placeholder.png";

  const grid = document.getElementById("modGrid");
  const searchInput = document.getElementById("modSearch");
  const gameFilter = document.getElementById("gameFilter");
  const resetButton = document.getElementById("resetFilters");
  const resultCount = document.getElementById("resultCount");
  const totalMods = document.getElementById("totalMods");
  const totalGames = document.getElementById("totalGames");
  const activeFilters = document.getElementById("activeFilters");

  const mobileMenuButton = document.getElementById("mobileMenuButton");
  const navLinks = document.getElementById("navLinks");

  const categories = [
    {
      id: "mods",
      key: "mods",
      file: DATA_FILES.mods,
      label: "Modlar",
      icon: "fa-puzzle-piece",
      emptyTitle: "Yeni modlar yolda!",
      emptyDescription:
        "Prism Crew Studio arşivine eklenecek yeni modlar hazırlanıyor.",
    },
    {
      id: "resourcepacks",
      key: "resourcepacks",
      file: DATA_FILES.resourcepacks,
      label: "Kaynak Paketleri",
      icon: "fa-images",
      emptyTitle: "Görsel şölen hazırlanıyor!",
      emptyDescription: "Yeni kaynak paketleri çok yakında burada olacak.",
    },
    {
      id: "datapacks",
      key: "datapacks",
      file: DATA_FILES.datapacks,
      label: "Veri Paketleri",
      icon: "fa-database",
      emptyTitle: "Yeni mekanikler yolda!",
      emptyDescription:
        "Yeni veri paketleri hazırlandığında burada görüntülenecek.",
    },
    {
      id: "shaderpacks",
      key: "shaderpacks",
      file: DATA_FILES.shaderpacks,
      label: "Gölge Paketleri",
      icon: "fa-wand-magic-sparkles",
      emptyTitle: "Görsel efektler hazırlanıyor!",
      emptyDescription: "Yeni shader paketleri için gözünü burada tut!",
    },
    {
      id: "plugins",
      key: "plugins",
      file: DATA_FILES.plugins,
      label: "Eklentiler",
      icon: "fa-plug",
      emptyTitle: "Henüz eklenti yok!",
      emptyDescription:
        "VoxelForge eklentileri eklendiğinde burada görüntülenecek.",
    },
  ];

  let allMods = [];
  let activeCategory = "mods";
  let isLoading = false;

  const requiredElements = {
    modGrid: grid,
    modSearch: searchInput,
    gameFilter,
    resetFilters: resetButton,
    resultCount,
    totalMods,
    totalGames,
    activeFilters,
    mobileMenuButton,
    navLinks,
  };

  const missingElements = Object.entries(requiredElements)
    .filter(([, element]) => !element)
    .map(([name]) => name);

  if (missingElements.length > 0) {
    console.error(
      "VoxelForge: HTML elemanları bulunamadı:",
      missingElements.join(", "),
    );
    return;
  }

  // HTML özel karakterlerini güvenli biçimde dönüştürür.
  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => {
      const entities = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      };

      return entities[char];
    });
  }

  // Yalnızca HTTP/HTTPS bağlantılarına ve göreli dosya yollarına izin verir.
  function safeURL(value) {
    if (typeof value !== "string" || !value.trim()) {
      return "";
    }

    try {
      const url = new URL(value, window.location.href);

      if (!["http:", "https:"].includes(url.protocol)) {
        return "";
      }

      return url.href;
    } catch {
      return "";
    }
  }

  function normalizeText(value) {
    return String(value ?? "")
      .toLocaleLowerCase("tr-TR")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function getModName(mod) {
    return mod.name || mod.title || "İsimsiz Proje";
  }

  function getGameName(mod) {
    return mod.game || mod.gameName || "Belirtilmemiş";
  }

  function getDescription(mod) {
    return mod.description || "Bu proje için henüz bir açıklama eklenmemiş.";
  }

  function getTags(mod) {
    if (!Array.isArray(mod.tags)) {
      return [];
    }

    return mod.tags.filter((tag) => typeof tag === "string").slice(0, 8);
  }

  function getVersion(mod) {
    return mod.version ? String(mod.version) : "";
  }

  // Eski kategori adlarını da yeni kategori sistemine uyarlar.
  function normalizeCategory(value) {
    const raw = String(value || "mods")
      .trim()
      .toLocaleLowerCase("tr-TR")
      .replace(/[\s_-]+/g, "");

    const aliases = {
      mod: "mods",
      mods: "mods",

      resource: "resourcepacks",
      resources: "resourcepacks",
      resourcepack: "resourcepacks",
      resourcepacks: "resourcepacks",
      texture: "resourcepacks",
      textures: "resourcepacks",
      kaynak: "resourcepacks",
      kaynakpaketi: "resourcepacks",
      kaynakpaketleri: "resourcepacks",

      data: "datapacks",
      datapack: "datapacks",
      datapacks: "datapacks",
      veri: "datapacks",
      veripaketi: "datapacks",
      veripaketleri: "datapacks",

      shader: "shaderpacks",
      shaders: "shaderpacks",
      shaderpack: "shaderpacks",
      shaderpacks: "shaderpacks",
      shaderpaketi: "shaderpacks",
      shaderpaketleri: "shaderpacks",

      plugin: "plugins",
      plugins: "plugins",
      extension: "plugins",
      extensions: "plugins",
      eklenti: "plugins",
      eklentiler: "plugins",
    };

    return aliases[raw] || "mods";
  }

  function getCategoryLabel(categoryId) {
    return (
      categories.find((category) => category.id === categoryId)?.label ||
      "Modlar"
    );
  }

  function getModImage(mod) {
    return safeURL(mod.image || mod.thumbnail || "");
  }

  function getPlaceholderURL() {
    return new URL(PLACEHOLDER_IMAGE, window.location.href).href;
  }

  // Her JSON dosyasının içeriğini kendi kategorisine bağlar.
  // Desteklenen biçimler: doğrudan dizi veya kategori anahtarı içeren nesne.
  function parseCategoryData(data, category) {
    let items;

    if (Array.isArray(data)) {
      items = data;
    } else if (data && typeof data === "object") {
      if (Array.isArray(data[category.key])) {
        items = data[category.key];
      } else if (Array.isArray(data.items)) {
        items = data.items;
      } else {
        throw new Error(
          `${category.file}: JSON içinde "${category.key}" veya "items" dizisi bulunamadı.`,
        );
      }
    } else {
      throw new Error(
        `${category.file}: JSON içeriği bir dizi veya nesne olmalıdır.`,
      );
    }

    return items
      .filter(
        (item) => item && typeof item === "object" && !Array.isArray(item),
      )
      .map((item) => ({
        ...item,
        __category: category.id,
      }));
  }

  // Kategori sekmelerini oluşturur.
  function createCategoryTabs() {
    const existingTabs = document.getElementById("categoryTabs");

    if (!grid.parentElement) {
      console.error("VoxelForge: İçerik ızgarasının üst elemanı bulunamadı.");
      return;
    }

    if (existingTabs) {
      existingTabs.remove();
    }

    const tabs = document.createElement("div");

    tabs.id = "categoryTabs";
    tabs.className = "category-tabs";
    tabs.setAttribute("role", "tablist");
    tabs.setAttribute("aria-label", "İçerik kategorileri");

    tabs.innerHTML = categories
      .map(
        (category) => `
          <button
            class="category-tab${category.id === activeCategory ? " active" : ""}"
            id="category-tab-${category.id}"
            type="button"
            role="tab"
            aria-selected="${category.id === activeCategory}"
            aria-controls="modGrid"
            data-category="${category.id}"
          >
            <i class="fa-solid ${category.icon}" aria-hidden="true"></i>
            <span>${escapeHTML(category.label)}</span>
          </button>
        `,
      )
      .join("");

    grid.parentElement.insertBefore(tabs, grid);

    tabs.addEventListener("click", (event) => {
      const tab = event.target.closest("[data-category]");

      if (!tab || !tabs.contains(tab)) {
        return;
      }

      activeCategory = tab.dataset.category;

      tabs.querySelectorAll(".category-tab").forEach((button) => {
        const selected = button.dataset.category === activeCategory;

        button.classList.toggle("active", selected);
        button.setAttribute("aria-selected", String(selected));
      });

      renderMods();
    });
  }

  // Yükleniyor, boş ve hata ekranlarını gösterir.
  function showState(icon, title, description, buttonText = "") {
    const buttonHTML = buttonText
      ? `
          <button
            class="mod-button primary retry-button"
            id="retryLoad"
            type="button"
          >
            <i class="fa-solid fa-rotate-right" aria-hidden="true"></i>
            ${escapeHTML(buttonText)}
          </button>
        `
      : "";

    grid.innerHTML = `
      <div class="state-card glass">
        <div class="state-icon">
          <i class="${escapeHTML(icon)}" aria-hidden="true"></i>
        </div>
        <h3>${escapeHTML(title)}</h3>
        <p>${escapeHTML(description)}</p>
        ${buttonHTML}
      </div>
    `;

    const retryButton = document.getElementById("retryLoad");

    if (retryButton) {
      retryButton.addEventListener("click", loadMods);
    }
  }

  function getCategoryMods() {
    return allMods.filter((mod) => mod.__category === activeCategory);
  }

  // İstatistikler dört dosyadaki tüm içerikleri kapsar.
  function updateStats() {
    const games = new Set(
      allMods.map(getGameName).filter((game) => game !== "Belirtilmemiş"),
    );

    totalMods.textContent = String(allMods.length);
    totalGames.textContent = String(games.size);
  }

  // Oyun filtresini mevcut içeriklere göre doldurur.
  function populateGameFilter() {
    const selected = gameFilter.value;

    const games = [
      ...new Set(
        allMods.map(getGameName).filter((game) => game !== "Belirtilmemiş"),
      ),
    ].sort((a, b) => a.localeCompare(b, "tr"));

    const options = [
      { value: "all", label: "Tüm oyunlar" },
      ...games.map((game) => ({
        value: game,
        label: game,
      })),
    ];

    gameFilter.innerHTML = options
      .map(
        (option) => `
          <option value="${escapeHTML(option.value)}">
            ${escapeHTML(option.label)}
          </option>
        `,
      )
      .join("");

    if (options.some((option) => option.value === selected)) {
      gameFilter.value = selected;
    } else {
      gameFilter.value = "all";
    }
  }

  // Kart görseli oluşturur.
  function createImageHTML(image, name) {
    const source = image || getPlaceholderURL();

    return `
      <img
        class="mod-image"
        src="${escapeHTML(source)}"
        data-placeholder="${escapeHTML(getPlaceholderURL())}"
        alt="${escapeHTML(name)}"
        loading="lazy"
        decoding="async"
      >
    `;
  }

  // Görsel yüklenemezse placeholder kullanır.
  function attachImageFallbacks() {
    grid.querySelectorAll(".mod-image").forEach((image) => {
      image.addEventListener("error", () => {
        if (image.dataset.placeholderApplied === "true") {
          image.style.visibility = "hidden";
          return;
        }

        image.dataset.placeholderApplied = "true";
        image.src = image.dataset.placeholder;
      });
    });
  }

  // İndirme ve proje bağlantılarını oluşturur.
  function createActionsHTML(mod) {
    const downloadURL = safeURL(mod.downloadUrl || mod.download || "");

    const pageURL = safeURL(mod.pageUrl || mod.url || "");

    let html = "";

    if (downloadURL) {
      html += `
        <a
          class="mod-button primary"
          href="${escapeHTML(downloadURL)}"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i class="fa-solid fa-download" aria-hidden="true"></i>
          İndir
        </a>
      `;
    }

    if (pageURL) {
      html += `
        <a
          class="mod-button"
          href="${escapeHTML(pageURL)}"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>
          Proje Sayfası
        </a>
      `;
    }

    if (!html) {
      html = `
        <span class="mod-button disabled">
          <i class="fa-solid fa-link-slash" aria-hidden="true"></i>
          Bağlantı eklenmedi
        </span>
      `;
    }

    return html;
  }

  // İçerik kartını oluşturur.
  function createModCard(mod) {
    const name = getModName(mod);
    const game = getGameName(mod);
    const description = getDescription(mod);
    const version = getVersion(mod);
    const image = getModImage(mod);
    const tags = getTags(mod);

    const tagsHTML = tags.length
      ? `
          <div class="mod-tags">
            ${tags
              .map(
                (tag) => `
                  <span class="mod-tag">${escapeHTML(tag)}</span>
                `,
              )
              .join("")}
          </div>
        `
      : `<div class="mod-tags"></div>`;

    return `
      <article class="mod-card" data-id="${escapeHTML(mod.id || "")}">
        <div class="mod-image-wrap">
          ${createImageHTML(image, name)}

          <span class="mod-game-badge">
            <i class="fa-solid fa-gamepad" aria-hidden="true"></i>
            ${escapeHTML(game)}
          </span>
        </div>

        <div class="mod-card-content">
          <div class="mod-card-topline">
            <h3 class="mod-title">${escapeHTML(name)}</h3>

            ${
              version
                ? `<span class="mod-version">v${escapeHTML(version)}</span>`
                : ""
            }
          </div>

          <p class="mod-description">${escapeHTML(description)}</p>

          ${tagsHTML}

          <div class="mod-actions">
            ${createActionsHTML(mod)}
          </div>
        </div>
      </article>
    `;
  }

  // Arama ve oyun filtresini seçili kategoriye uygular.
  function renderMods() {
    if (isLoading) {
      return;
    }

    const query = normalizeText(searchInput.value.trim());
    const selectedGame = gameFilter.value;
    const categoryMods = getCategoryMods();

    const filtered = categoryMods.filter((mod) => {
      const searchable = normalizeText(
        [
          getModName(mod),
          getGameName(mod),
          getDescription(mod),
          getVersion(mod),
          ...getTags(mod),
        ].join(" "),
      );

      const matchesSearch = !query || searchable.includes(query);

      const matchesGame =
        selectedGame === "all" || getGameName(mod) === selectedGame;

      return matchesSearch && matchesGame;
    });

    updateStats();

    resultCount.textContent = `${filtered.length} sonuç`;

    const hasFilters =
      Boolean(query) || selectedGame !== "all" || activeCategory !== "mods";

    activeFilters.hidden = !hasFilters;

    activeFilters.textContent = hasFilters
      ? `Aktif filtreler: ${[
          `Kategori: ${getCategoryLabel(activeCategory)}`,
          query ? `Arama: "${searchInput.value.trim()}"` : "",
          selectedGame !== "all" ? `Oyun: ${selectedGame}` : "",
        ]
          .filter(Boolean)
          .join(" · ")}`
      : "";

    if (categoryMods.length === 0) {
      const category =
        categories.find((item) => item.id === activeCategory) || categories[0];

      showState(
        `fa-solid ${category.icon}`,
        category.emptyTitle,
        category.emptyDescription,
      );

      resultCount.textContent = "0 sonuç";
      return;
    }

    if (filtered.length === 0) {
      showState(
        "fa-solid fa-magnifying-glass",
        "Eşleşen içerik bulunamadı",
        "Başka bir kelime deneyebilir veya filtreleri sıfırlayabilirsin.",
      );

      resultCount.textContent = "0 sonuç";
      return;
    }

    grid.innerHTML = filtered.map(createModCard).join("");

    attachImageFallbacks();
  }

  // Dört JSON dosyasını bağımsız olarak yükler.
  async function loadMods() {
    if (isLoading) {
      return;
    }

    isLoading = true;

    showState(
      "fa-solid fa-circle-notch fa-spin",
      "Projeler yükleniyor...",
      "VoxelForge arşivi açılıyor. Biraz sabır!",
    );

    try {
      const loadedCategories = await Promise.all(
        categories.map(async (category) => {
          const fileURL = new URL(
            DATA_BASE_URL + category.file,
            window.location.href,
          );

          const response = await fetch(fileURL.href, {
            cache: "no-cache",
          });

          if (!response.ok) {
            throw new Error(
              `${category.file} yüklenemedi: HTTP ${response.status}`,
            );
          }

          let data;

          try {
            data = await response.json();
          } catch {
            throw new Error(`${category.file} geçerli bir JSON dosyası değil.`);
          }

          return parseCategoryData(data, category);
        }),
      );

      // Dosyaların sırası categories dizisiyle aynı kalır.
      allMods = loadedCategories.flat();

      populateGameFilter();
      updateStats();
    } catch (error) {
      console.error("VoxelForge içerikleri yüklenemedi:", error);

      allMods = [];
      isLoading = false;

      showState(
        "fa-solid fa-triangle-exclamation",
        "İçerikler yüklenemedi",
        error.message ||
          "JSON dosyalarının yollarını, biçimlerini ve sunucu bağlantısını kontrol et.",
        "Tekrar dene",
      );

      resultCount.textContent = "Yükleme hatası";
      totalMods.textContent = "0";
      totalGames.textContent = "0";

      return;
    }

    isLoading = false;
    renderMods();
  }

  // Arama ve filtre kontrolleri.
  searchInput.addEventListener("input", renderMods);
  gameFilter.addEventListener("change", renderMods);

  resetButton.addEventListener("click", () => {
    searchInput.value = "";
    gameFilter.value = "all";

    renderMods();
    searchInput.focus();
  });

  // Mobil navigasyon menüsü.
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

  // Kategori sekmelerini oluştur ve dört dosyayı yükle.
  createCategoryTabs();
  loadMods();
});
