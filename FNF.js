/* ==========================================================
   VOXEL FORGE - FNF MODLARI VERİ TABANI & KONTROLCÜ
   ==========================================================
   Yeni mod eklemek için: MODS dizisine yeni bir obje ekle.
   status: "released" | "dev" | "halted" | "soon"

   buttons: bir dizi. Her buton: 
   { label, icon, url, variant, disabled, reason, action }
   variant: "primary" (dolgu) | "ghost" (şeffaf) | "mediafire" | "github"
   ========================================================== */

const MODS = [
    // ============ PRISM ENGINE ============
    {
        id: "prism-engine",
        name: "Prism Engine",
        icon: "fa-solid fa-gem",
        status: "dev",
        version: "Açık Beta",
        tagline: "Saf Haxe ile sıfırdan yazılmış özel bir FNF Engine'ı. Psych'a benzer yapıda ama tamamen bağımsız bir kod tabanına sahip.",
        progress: 35,
        meta: [
            { icon: "fa-solid fa-code", text: "Saf Haxe" },
            { icon: "fa-solid fa-list-check", text: "Görev Sistemi" },
            { icon: "fa-solid fa-shop", text: "Market Sistemi" }
        ],
        features: [
            { icon: "fa-solid fa-list-check", title: "Görev Sistemi", desc: "Oyun içi görevler tamamla, ödüller kazan" },
            { icon: "fa-solid fa-shop", title: "Market Sistemi", desc: "Şarkılar, skinler ve içerikler satın al" },
            { icon: "fa-solid fa-music", title: "Yeni Şarkılar", desc: "Özel besteler ve yeni ritimler" },
            { icon: "fa-solid fa-wand-magic-sparkles", title: "Özel Geçişler", desc: "Kendine has sahne geçiş efektleri" }
        ],
        note: "Psych Engine'a benzer yapıda ama tamamen bağımsız bir engine'dır.",
        tags: ["Haxe", "Custom Engine", "Görev Sistemi", "Market", "Açık Beta"],
        buttons: [
            { label: "Açık Beta Henüz Çıkmadı", icon: "fa-solid fa-hourglass-half", variant: "primary", disabled: true, reason: "Açık Beta Daha Çıkmadı" },
            { label: "GitHub", icon: "fa-brands fa-github", url: "#", variant: "github", disabled: true, reason: "Repo Henüz Yayında Değil" }
        ],
        details: {
            title: "🔷 Prism Engine - Açık Beta Öncesi",
            body: `Prism Engine, tamamen sıfırdan <strong>Haxe</strong> ile yazılmakta olan bağımsız bir Friday Night Funkin' motorudur.

<h4>💎 Neler Var?</h4>
• <strong>Görev Sistemi:</strong> Oyun içi görevleri tamamla, XP ve ödül kazan.
• <strong>Market Sistemi:</strong> Kazandığın coinlerle yeni şarkılar, karakter skinleri ve özel içerikler satın al.
• <strong>Yeni Şarkılar:</strong> Özel besteler ve tamamen yeni ritim yapıları.
• <strong>Değişik Geçiş Animasyonları:</strong> Kendine has sahne geçiş efektleri.

<h4>⚠️ Not</h4>
Prism Engine yapı olarak Psych Engine'a benzese de kod tabanı ve mimarisi tamamen bağımsızdır. Sıfırdan geliştirilmiştir.

<h4>🚧 Durum</h4>
Şu anda %35 tamamlanmış durumda. Açık Beta henüz yayınlanmadı, takipte kalın!`
        }
    },

    // ============ RHYTHMX ============
    {
        id: "rhythmx",
        name: "RhythmX",
        icon: "fa-solid fa-bolt",
        status: "released",
        version: "v0.0.3",
        tagline: "Cyberpunk estetiği, otomatik dodge/click sistemleri ve VSCHARA 2.0 desteğiyle donatılmış özel FNF modu.",
        meta: [
            { icon: "fa-solid fa-robot", text: "AutoDodge" },
            { icon: "fa-solid fa-hand-pointer", text: "AutoClick" },
            { icon: "fa-solid fa-code", text: "VSCHARA 2.0" }
        ],
        events: [
            "BFPlaysSansTheme.lua",
            "FlashBang.lua",
            "ReplayGChart.lua",
            "SaveGChart.lua",
            "Spare.lua",
            "WelcomeHell.lua"
        ],
        tags: ["Psych Engine", "Cyberpunk", "Bot Mod", "Lua Events", "VSCHARA 2.0"],
        buttons: [
            { label: "MediaFire", icon: "fa-solid fa-cloud-arrow-down", url: "https://www.mediafire.com/file/e9fcx67b9eoey7r/RhythmX-0.0.3.zip/file", variant: "mediafire" },
            { label: "GitHub Release", icon: "fa-brands fa-github", url: "https://github.com/aliberkkoc3-hash/RhythmX/releases/tag/0.0.3", variant: "github" },
            { label: "Kaynak Kod", icon: "fa-solid fa-code-branch", url: "https://github.com/aliberkkoc3-hash/RhythmX", variant: "ghost" }
        ],
        details: {
            title: "⚡ RhythmX v0.0.3 - Parmaklara Jimnastik, Ritmik Kaos! 🎤",
            body: `RhythmX, öyle alelade bir Friday Night Funkin' modu değil; bildiğin parmaklarını düğüm yapacak, <strong>VSCHARA(2.0)</strong> moduyla kanka gibi takılan, yerinde duramayan bir canavar. "Bilgisayarım patates, FNF oynarken uçak motoru gibi ses çıkarıyor" diyenleri de düşündük; altyapısı o kadar hafif ki tost makinesinde bile su kaynatmadan çalışır.

<h4>🚀 Neler Var Bu Canavarın İçinde?</h4>
• <strong>Psych Engine v1.0.4 Uyumluluğu:</strong> Yağ gibi akan performans, en güncel altyapı. Donma, kasma, Windows'un "yanıt vermiyor" tribi burada yok!
• <strong>Chara 2.0 Entegrasyonu:</strong> VSCHARA(2.0) ile tam uyumlu; yani eğlenceyi ikiye katlıyoruz, aksiyonu arşa çıkarıyoruz.
• <strong>Özel Tuş Kombinasyonları:</strong> Shift, CTRL, TAB ve o meşhur ritim dizileri için özel optimize edildi. Parmaklarınız piyano çalıyor gibi hissedecek.
• <strong>RhythmXAutoPress Desteği:</strong> M tuşuyla dodge (kaçınma) olayını baştan yazdık. Artık "bastım ama yemedi" bahaneniz kalmadı; hata payı silindi, ritim akıp gidiyor.
• <strong>Hafif ve Hızlı:</strong> Altyapı o kadar optimize ki, sistemini yormaz, sadece müziğe odaklanmanı sağlar.

<h4>📦 Kurulum (İndir, Daldır, Oyna)</h4>
1. En güncel sürümü (v0.0.3) MediaFire veya GitHub Releases sayfasından hemen kap gel.
2. İndirdiğin .zip dosyasının içindeki her şeyi <strong>Psych Engine v1.0.4</strong> klasörünün içine bodoslama boşalt.
3. Oyunu aç, hoparlörün sesini kökle ve ritmin dibine vur! 🎸

<h4>🔗 İndirme Kaynakları</h4>
• <strong>MediaFire:</strong> Hızlı ve direkt indirme
• <strong>GitHub Release:</strong> Değişiklik günlüğü ile birlikte
• <strong>Kaynak Kod:</strong> Modu incelemek veya katkı sağlamak için

<em>FNF tayfası için bolca kahve ve uykusuz geceyle, tutkuyla hazırlandı.</em>`
        }
    },

    // ============ FUNKLAB MOBILE PORT ============
    {
        id: "funklab-mobile",
        name: "FunkLab Mobile Port",
        icon: "fa-solid fa-mobile-screen-button",
        status: "released",
        version: "v0.1.4",
        tagline: "Yatakta, yolda, okulda - parmağını bile oynatmadan ritmin kralı ol. Bot terliyor, sen şöhretin tadını çıkarıyorsun! 📱🤖🔥",
        meta: [
            { icon: "fa-brands fa-android", text: "Android" },
            { icon: "fa-solid fa-robot", text: "Bot Destekli" },
            { icon: "fa-solid fa-wifi", text: "Offline" }
        ],
        tags: ["Mobile Port", "FunkLab", "AutoPlay", "Touch Controls", "Protokol-66"],
        buttons: [
            { label: "MediaFire APK", icon: "fa-solid fa-cloud-arrow-down", url: "https://www.mediafire.com/file/x26lwxr3aamv7jj/FunkLab-Mobile-Port-0.1.4.zip/file", variant: "mediafire" },
            { label: "GitHub Release", icon: "fa-brands fa-github", url: "https://github.com/aliberkkoc3-hash/FunkLab-Mobile-Port/releases/tag/v0.1.4", variant: "github" },
            { label: "Kaynak Kod", icon: "fa-solid fa-code-branch", url: "https://github.com/aliberkkoc3-hash/FunkLab-Mobile-Port", variant: "ghost" }
        ],
        details: {
            title: "📱 v0.1.4 - Protokol-66: Mobil Sistemsel Hakimiyet",
            body: `Başparmaklar emekli edildi, işlemciler kırbaçlandı! FunkLab artık cebinizdeki en sinsi güç olan <strong>Funk-O-Matic 9000 (Protokol-66)</strong> tarafından yönetiliyor.

<h4>🚀 Mobil Operasyon Detayları</h4>
• <strong>Mobil Çekirdek:</strong> Bot mantığı ve ritim senkronizasyonu mobil işlemciler için stabilize edildi.
• <strong>Funk-O-Turbo Ultra:</strong> Mobil cihazlara özel agresif turboTick protokolü eklendi. RAM tasfiyesi ve GPU rahatlatma modları devreye alındı.
• <strong>Mutlak Hassasiyet:</strong> Botun vuruş kalitesini sen belirle! İster kusursuz "SICK" vur, ister +/- 55ms sapmayla "Pro Player" taklidi yap.
• <strong>Hayalet Skor (Ghost Mode) v2:</strong> Uzun notaların (sustain) puan sızıntıları tamamen tıkandı. Bot notaları tokatlar ama skor tabelasında tek bir dijital iz bile bırakmaz.
• <strong>Güvenlik & Kararlılık:</strong> InfoHUD, sistem güvenliği ve çökme risklerini sıfırlamak adına tasfiye edildi. Protokol-66 artık daha sessiz ve daha ölümcül.

<h4>🔗 İndirme Kaynakları</h4>
• <strong>MediaFire APK:</strong> Direkt APK indirme (hızlı)
• <strong>GitHub Release:</strong> Sürüm notları ve arşiv
• <strong>Kaynak Kod:</strong> Projeyi keşfet, katkı sağla

<h4>⚠️ Not</h4>
Bu sürümden sonra telefonunuzun ısınması bir hata değil, botun notaları parçalarken çıkardığı <em>sürtünme ısısıdır</em>.

<h4>🎮 Sunan</h4>
<strong>Pixel Devs Studio & AliBerk</strong> sundu: Parmaklara özgürlük, işlemciye zulüm!`
        }
    }
];

/* ==========================================================
   RENDER FONKSİYONLARI
   ========================================================== */

const STATUS_LABELS = {
    released: "Yayınlandı",
    dev: "Geliştiriliyor",
    halted: "Durduruldu",
    soon: "Yakında"
};

function renderMeta(meta) {
    if (!meta || !meta.length) return "";
    return `<ul class="mod-meta">
        ${meta.map(m => `<li><i class="${m.icon}"></i> ${m.text}</li>`).join("")}
    </ul>`;
}

function renderFeatures(features) {
    if (!features || !features.length) return "";
    return `<div class="feature-grid">
        ${features.map(f => `
            <div class="feature-item">
                <i class="${f.icon}"></i>
                <div>
                    <strong>${f.title}</strong>
                    <span>${f.desc}</span>
                </div>
            </div>
        `).join("")}
    </div>`;
}

function renderEvents(events) {
    if (!events || !events.length) return "";
    return `<div class="event-list">
        <div class="event-list-header">
            <i class="fa-solid fa-scroll"></i>
            <span>Özel Eventler</span>
        </div>
        <ul>
            ${events.map(e => `<li><i class="fa-solid fa-file-code"></i> ${e}</li>`).join("")}
        </ul>
    </div>`;
}

function renderNote(note) {
    if (!note) return "";
    return `<div class="engine-note">
        <i class="fa-solid fa-triangle-exclamation"></i>
        <span>${note}</span>
    </div>`;
}

function renderProgress(progress) {
    if (progress === undefined || progress === null) return "";
    return `<div class="progress" style="--progress: ${progress}%">
        <div class="progress-label"><span>Geliştirme Durumu</span><span>%${progress}</span></div>
        <div class="progress-bar"><i></i></div>
    </div>`;
}

function renderTags(tags) {
    if (!tags || !tags.length) return "";
    return `<div class="tags">
        ${tags.map(t => `<span>${t}</span>`).join("")}
    </div>`;
}

/* ---------- Buton Sistemi (Çoklu Buton Destekli) ---------- */

function renderSingleButton(btn) {
    if (!btn) return "";

    const variantClass = `mod-btn-${btn.variant || "primary"}`;
    const cls = `mod-btn ${variantClass}`;

    if (btn.disabled) {
        const reason = btn.reason ? `title="${btn.reason}" data-reason="${btn.reason}"` : "";
        return `<a class="${cls} is-disabled" aria-disabled="true" tabindex="-1" ${reason}>
            <i class="${btn.icon}"></i> <span>${btn.label}</span>
        </a>`;
    }

    const target = btn.url && btn.url !== "#" ? 'target="_blank" rel="noopener"' : "";
    return `<a href="${btn.url || '#'}" class="${cls}" ${target}>
        <i class="${btn.icon}"></i> <span>${btn.label}</span>
    </a>`;
}

function renderActions(mod) {
    const buttons = mod.buttons || [];

    // Detay butonu her zaman en sonda otomatik eklensin
    const detailBtnHtml = mod.details
        ? `<button type="button" class="mod-btn mod-btn-detail" data-detail="${mod.id}">
             <i class="fa-solid fa-circle-info"></i> <span>Detay</span>
           </button>`
        : "";

    const buttonsHtml = buttons.map(renderSingleButton).join("");

    return `<div class="card-actions">${buttonsHtml}${detailBtnHtml}</div>`;
}

function renderCard(mod) {
    return `
    <article class="fnf-card" data-status="${mod.status}" data-id="${mod.id}">
        <div class="card-cover">
            <span class="status-badge"><i class="fa-solid fa-circle"></i> ${STATUS_LABELS[mod.status] || mod.status}</span>
            ${mod.version ? `<span class="version-badge">${mod.version}</span>` : ""}
            <div class="cover-icon"><i class="${mod.icon}"></i></div>
        </div>
        <div class="card-body">
            <h3><i class="${mod.icon}"></i> ${mod.name}</h3>
            <p>${mod.tagline}</p>
            ${renderMeta(mod.meta)}
            ${renderFeatures(mod.features)}
            ${renderEvents(mod.events)}
            ${renderNote(mod.note)}
            ${renderProgress(mod.progress)}
            ${renderTags(mod.tags)}
            ${renderActions(mod)}
        </div>
    </article>
    `;
}

/* ==========================================================
   MODAL (DETAY PENCERESİ)
   ========================================================== */

function createModal() {
    if (document.getElementById("modDetailModal")) return;

    const modal = document.createElement("div");
    modal.id = "modDetailModal";
    modal.className = "detail-modal";
    modal.setAttribute("aria-hidden", "true");
    modal.innerHTML = `
        <div class="modal-backdrop"></div>
        <div class="modal-content" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
            <button class="modal-close" aria-label="Kapat"><i class="fa-solid fa-xmark"></i></button>
            <div class="modal-header">
                <h2 id="modalTitle"></h2>
            </div>
            <div class="modal-body" id="modalBody"></div>
        </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector(".modal-close").addEventListener("click", closeModal);
    modal.querySelector(".modal-backdrop").addEventListener("click", closeModal);
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
    });
}

function openModal(modId) {
    const mod = MODS.find(m => m.id === modId);
    if (!mod || !mod.details) return;

    const modal = document.getElementById("modDetailModal");
    modal.querySelector("#modalTitle").innerHTML = mod.details.title;
    modal.querySelector("#modalBody").innerHTML = mod.details.body.replace(/\n/g, "<br>");

    const accents = {
        released: { rgb: "0, 255, 157", color: "#00ff9d" },
        dev: { rgb: "255, 170, 0", color: "#ffaa00" },
        halted: { rgb: "255, 51, 102", color: "#ff3366" },
        soon: { rgb: "189, 0, 255", color: "#bd00ff" }
    };
    const a = accents[mod.status] || accents.released;
    modal.style.setProperty("--modal-rgb", a.rgb);
    modal.style.setProperty("--modal-accent", a.color);

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
}

function closeModal() {
    const modal = document.getElementById("modDetailModal");
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
}

/* ==========================================================
   FİLTRE SİSTEMİ
   ========================================================== */

function setupFilters() {
    const filterButtons = document.querySelectorAll(".filter-btn");
    const cards = document.querySelectorAll(".fnf-card[data-status]");
    const noResults = document.getElementById("noResults");

    filterButtons.forEach(btn => {
        const f = btn.dataset.filter;
        const total = f === "all"
            ? cards.length
            : [...cards].filter(c => c.dataset.status === f).length;
        const countEl = btn.querySelector(".count");
        if (countEl) countEl.textContent = total;
    });

    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const filter = btn.dataset.filter;
            let visible = 0;

            cards.forEach(card => {
                const show = filter === "all" || card.dataset.status === filter;
                card.classList.toggle("hidden", !show);
                if (show) visible++;
            });

            if (noResults) noResults.classList.toggle("show", visible === 0);
        });
    });
}

/* ==========================================================
   INIT
   ========================================================== */

function initFNF() {
    const grid = document.getElementById("modGrid");
    if (!grid) return;

    const cardsHtml = MODS.map(renderCard).join("");
    grid.innerHTML = cardsHtml + `
        <div class="no-results" id="noResults">
            <i class="fa-solid fa-ghost"></i>
            <p>Bu kategoride henüz mod yok.</p>
        </div>
    `;

    createModal();

    document.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-detail]");
        if (btn) {
            e.preventDefault();
            openModal(btn.dataset.detail);
        }
    });

    setupFilters();

    document.querySelectorAll(".mod-btn.is-disabled").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const reason = btn.dataset.reason;
            if (reason) showToast(reason);
        });
    });
}

/* ==========================================================
   TOAST (Küçük Bildirim)
   ========================================================== */

function showToast(message) {
    let toast = document.getElementById("fnfToast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "fnfToast";
        toast.className = "fnf-toast";
        document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${message}`;
    toast.classList.remove("show");
    void toast.offsetWidth;
    toast.classList.add("show");

    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove("show"), 3000);
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initFNF);
} else {
    initFNF();
}