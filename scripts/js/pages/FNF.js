/**
 * VoxelForge - FNF Modları Sayfası
 * Yalnızca FNF/FNF.html sayfasında çalışır.
 */

import { renderCard } from "../components/components.js";

import {
  createModal,
  openModal,
  initModalKeyboard,
  setModalMods,
} from "../core/modal.js";

import { showToast } from "../core/toast.js";

const MODS_JSON_PATH = "../scripts/js/data/fnf-mods.json";

/**
 * Modları JSON dosyasından yükler.
 */
async function loadMods() {
  const response = await fetch(MODS_JSON_PATH);

  if (!response.ok) {
    throw new Error(`Mod verileri yüklenemedi. HTTP ${response.status}`);
  }

  const data = await response.json();

  if (!Array.isArray(data.mods)) {
    throw new Error("JSON dosyasında geçerli bir mods dizisi bulunamadı.");
  }

  return {
    mods: data.mods,
    statusLabels: data.statusLabels ?? {},
  };
}

/**
 * Kategori filtrelerini kurar.
 */
function setupFilters(grid) {
  const filterButtons = [...document.querySelectorAll(".filter-btn")];

  const noResults = document.getElementById("noResults");

  const cards = [...grid.querySelectorAll(".fnf-card[data-status]")];

  // Her kategorideki mod sayısını hesapla.
  filterButtons.forEach((button) => {
    const filter = button.dataset.filter;

    const count =
      filter === "all"
        ? cards.length
        : cards.filter((card) => card.dataset.status === filter).length;

    const countElement = button.querySelector(".count");

    if (countElement) {
      countElement.textContent = String(count);
    }
  });

  // Filtreleme işlemi.
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((item) => {
        item.classList.remove("active");
        item.setAttribute("aria-pressed", "false");
      });

      button.classList.add("active");
      button.setAttribute("aria-pressed", "true");

      const filter = button.dataset.filter;
      let visible = 0;

      cards.forEach((card) => {
        const show = filter === "all" || card.dataset.status === filter;

        card.classList.toggle("hidden", !show);

        if (show) {
          visible++;
        }
      });

      if (noResults) {
        noResults.classList.toggle("show", visible === 0);
      }
    });
  });
}

/**
 * Kart butonlarını yönetir.
 * Her kart için ayrı listener oluşturmaz.
 */
function setupCardActions(grid) {
  grid.addEventListener("click", (event) => {
    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    // Detay butonu.
    const detailButton = target.closest("[data-detail]");

    if (detailButton && grid.contains(detailButton)) {
      event.preventDefault();

      openModal(detailButton.dataset.detail);
      return;
    }

    // Henüz kullanılamayan butonlar.
    const disabledButton = target.closest(".mod-btn.is-disabled");

    if (disabledButton && grid.contains(disabledButton)) {
      event.preventDefault();

      showToast(
        disabledButton.dataset.reason || "Bu özellik henüz kullanılamıyor.",
      );
    }
  });
}

/**
 * FNF sayfasını başlatır.
 */
export async function initFNF() {
  const grid = document.getElementById("modGrid");

  if (!grid || grid.dataset.initialized === "true") {
    return;
  }

  grid.dataset.initialized = "true";

  grid.setAttribute("aria-busy", "true");

  try {
    // JSON dosyasını oku.
    const { mods, statusLabels } = await loadMods();
    setModalMods(mods);

    // Mod kartlarını oluştur.
    grid.innerHTML =
      mods.map((mod) => renderCard(mod, statusLabels)).join("") +
      `
        <div class="no-results" id="noResults">
          <i
            class="fa-solid fa-ghost"
            aria-hidden="true"
          ></i>

          <p>Bu kategoride henüz mod yok.</p>
        </div>
      `;

    // Detay penceresi ve etkileşimler.
    createModal();
    initModalKeyboard();

    setupCardActions(grid);
    setupFilters(grid);
  } catch (error) {
    console.error("VoxelForge FNF modları yüklenemedi:", error);

    grid.innerHTML = `
      <div class="no-results show">
        <i
          class="fa-solid fa-triangle-exclamation"
          aria-hidden="true"
        ></i>

        <p>Modlar yüklenemedi.</p>
        <p>
          JSON dosyasının konumunu ve tarayıcı konsolunu kontrol et.
        </p>
      </div>
    `;

    // Hata sonrası tekrar başlatılabilmesine izin ver.
    grid.dataset.initialized = "false";
  } finally {
    grid.setAttribute("aria-busy", "false");
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

/**
 * Sayfa yüklendiğinde başlat.
 */
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initFNF, { once: true });
} else {
  initFNF();
}
