/**
 * VoxelForge - FNF Mod Detay Penceresi
 * Mod verileri FNF.js tarafından aktarılır.
 */

const ACCENTS = {
    released: {
        rgb: "0, 255, 157",
        color: "#00ff9d"
    },
    dev: {
        rgb: "255, 170, 0",
        color: "#ffaa00"
    },
    halted: {
        rgb: "255, 51, 102",
        color: "#ff3366"
    },
    soon: {
        rgb: "189, 0, 255",
        color: "#bd00ff"
    }
};

// JSON'dan yüklenen modlar.
let MODS = [];

/**
 * Mod listesini FNF.js üzerinden aktarır.
 */
export function setModalMods(mods) {
    if (!Array.isArray(mods)) {
        console.error("Modal: Geçerli bir mod listesi verilmedi.");
        MODS = [];
        return;
    }

    MODS = mods;
}

/**
 * Modal elementini getirir.
 */
function getModal() {
    return document.getElementById("modDetailModal");
}

/**
 * Detay penceresini oluşturur.
 */
export function createModal() {
    if (getModal()) return;

    const modal = document.createElement("div");

    modal.id = "modDetailModal";
    modal.className = "detail-modal";
    modal.setAttribute("aria-hidden", "true");

    modal.innerHTML = `
        <div class="modal-backdrop"></div>

        <div
            class="modal-content"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modalTitle"
            tabindex="-1"
        >
            <button
                type="button"
                class="modal-close"
                aria-label="Kapat"
            >
                <i
                    class="fa-solid fa-xmark"
                    aria-hidden="true"
                ></i>
            </button>

            <div class="modal-header">
                <h2 id="modalTitle"></h2>
            </div>

            <div
                class="modal-body"
                id="modalBody"
            ></div>
        </div>
    `;

    document.body.appendChild(modal);

    modal
        .querySelector(".modal-close")
        .addEventListener("click", closeModal);

    modal
        .querySelector(".modal-backdrop")
        .addEventListener("click", closeModal);

    modal.addEventListener("keydown", (event) => {
        if (event.key === "Tab") {
            trapFocus(event, modal);
        }
    });
}

/**
 * Klavye odağının modal dışına çıkmasını engeller.
 */
function trapFocus(event, modal) {
    const focusable = [
        ...modal.querySelectorAll(
            'button:not([disabled]), a[href], ' +
            'input:not([disabled]), select:not([disabled]), ' +
            'textarea:not([disabled]), ' +
            '[tabindex]:not([tabindex="-1"])'
        )
    ];

    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (
        event.shiftKey &&
        document.activeElement === first
    ) {
        event.preventDefault();
        last.focus();
    } else if (
        !event.shiftKey &&
        document.activeElement === last
    ) {
        event.preventDefault();
        first.focus();
    }
}

/**
 * Mod detay penceresini açar.
 */
export function openModal(modId) {
    const mod = MODS.find(
        (item) => item.id === modId
    );

    const modal = getModal();

    if (!modal) {
        console.error("Modal henüz oluşturulmadı.");
        return;
    }

    if (!mod) {
        console.error(`Mod bulunamadı: ${modId}`);
        return;
    }

    if (!mod.details) {
        console.warn(
            `Mod için detay bilgisi bulunamadı: ${modId}`
        );
        return;
    }

    const title = modal.querySelector("#modalTitle");
    const body = modal.querySelector("#modalBody");

    title.textContent = mod.details.title || mod.title || "Mod Detayları";

    // details.body, projeye dahil edilen geliştirici kontrollü HTML'dir.
    body.innerHTML = mod.details.body || "";

    const accent = ACCENTS[mod.status] || ACCENTS.released;

    modal.style.setProperty(
        "--modal-rgb",
        accent.rgb
    );

    modal.style.setProperty(
        "--modal-accent",
        accent.color
    );

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";

    modal.querySelector(".modal-close")?.focus();
}

/**
 * Detay penceresini kapatır.
 */
export function closeModal() {
    const modal = getModal();

    if (!modal) return;

    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";
}

/**
 * Escape tuşuyla kapatmayı etkinleştirir.
 */
export function initModalKeyboard() {
    if (document.documentElement.dataset.modalKeyboardInitialized === "true") {
        return;
    }

    document.documentElement.dataset.modalKeyboardInitialized = "true";

    document.addEventListener("keydown", (event) => {
        if (
            event.key === "Escape" &&
            getModal()?.classList.contains("open")
        ) {
            closeModal();
        }
    });
}