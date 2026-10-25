(() => {
  "use strict";

  const DATA_SOURCES = {
    projects: [
      "scripts/js/data/bots/bots-list.json",
      "scripts/js/data/games/games-list.json",
      "scripts/js/data/sites/sites-list.json",
      "scripts/js/data/library/mods-list.json",
      "scripts/js/data/library/resourcepacks-list.json",
      "scripts/js/data/library/datapacks-list.json",
      "scripts/js/data/library/shaderpacks-list.json",
      "scripts/js/data/library/plugins-list.json"
    ],

    fnfMods: "scripts/js/data/fnf-mods.json"
  };

  const elements = {
    projects: document.getElementById("activeProjectsCount"),
    fnfReleased: document.getElementById("fnfModsCount"),
    fnfDeveloping: document.getElementById("fnfModsDevCount")
  };

  const ACTIVE_STATUSES = new Set([
    "active",
    "aktif",
    "released",
    "published",
    "live",
    "public",
    "yayında",
    "yayimlandi",
    "yayımlandı"
  ]);

  const INACTIVE_STATUSES = new Set([
    "deleted",
    "inactive",
    "disabled",
    "removed",
    "archived",
    "pasif",
    "kaldırıldı",
    "silindi",
    "halted",
    "semi-active",
    "semi_active",
    "semi active"
  ]);

  async function fetchJson(url) {
    const response = await fetch(url, { cache: "no-cache" });

    if (!response.ok) {
      throw new Error(`${url}: HTTP ${response.status}`);
    }

    return response.json();
  }

  function getCollection(data) {
    if (Array.isArray(data)) {
      return data;
    }

    if (!data || typeof data !== "object") {
      return [];
    }

    const possibleKeys = [
      "items",
      "mods",
      "projects",
      "plugins",
      "games",
      "sites",
      "bots",
      "resourcepacks",
      "resourcePacks",
      "resource_packs",
      "datapacks",
      "dataPacks",
      "data_packs",
      "shaderpacks",
      "shaderPacks",
      "shader_packs",
      "packs",
      "entries",
      "results"
    ];

    for (const key of possibleKeys) {
      if (Array.isArray(data[key])) {
        return data[key];
      }
    }

    return [];
  }

  function normalizeStatus(status) {
    return String(status ?? "")
      .trim()
      .toLowerCase();
  }

  function isActive(item) {
    if (!item || typeof item !== "object") {
      return false;
    }

    const status = normalizeStatus(item.status);

    if (INACTIVE_STATUSES.has(status)) {
      return false;
    }

    if (ACTIVE_STATUSES.has(status)) {
      return true;
    }

    if (typeof item.active === "boolean") {
      return item.active;
    }

    return false;
  }

  async function countActiveItems(url) {
    const data = await fetchJson(url);
    const items = getCollection(data);

    return items.filter(isActive).length;
  }

  async function countFromSources(urls) {
    const results = await Promise.allSettled(
      urls.map(countActiveItems)
    );

    let total = 0;
    let failed = false;

    results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        total += result.value;
      } else {
        failed = true;
        console.error(
          `[Voxel Forge Stats] Veri okunamadı: ${urls[index]}`,
          result.reason
        );
      }
    });

    return { total, failed };
  }

  async function updateProjectsCount() {
    if (!elements.projects) return;

    const result = await countFromSources(DATA_SOURCES.projects);

    elements.projects.textContent =
      String(result.total) + (result.failed ? "+" : "");
  }

  async function updateFnfCounts() {
    try {
      const data = await fetchJson(DATA_SOURCES.fnfMods);
      const mods = getCollection(data);

      const releasedCount = mods.filter(mod =>
        normalizeStatus(mod.status) === "released"
      ).length;

      const developingCount = mods.filter(mod =>
        normalizeStatus(mod.status) === "dev"
      ).length;

      if (elements.fnfReleased) {
        elements.fnfReleased.textContent = String(releasedCount);
      }

      if (elements.fnfDeveloping) {
        elements.fnfDeveloping.textContent = String(developingCount);
      }
    } catch (error) {
      console.error(
        "[Voxel Forge Stats] FNF modları yüklenemedi:",
        error
      );

      if (elements.fnfReleased) {
        elements.fnfReleased.textContent = "!";
      }

      if (elements.fnfDeveloping) {
        elements.fnfDeveloping.textContent = "!";
      }
    }
  }

  async function updateStatistics() {
    await Promise.all([
      updateProjectsCount(),
      updateFnfCounts()
    ]);
  }

  updateStatistics();
})();