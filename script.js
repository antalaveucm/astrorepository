// ====== AÑO EN EL FOOTER ======
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// ====== MODAL (IMAGEN AMPLIADA + INFO) ======
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalImage = document.getElementById("modal-image");
const modalInfo = document.getElementById("modal-info");
const modalBackdrop = modal ? modal.querySelector(".modal-backdrop") : null;
const modalClose = modal ? modal.querySelector(".modal-close") : null;

function openModal({ title, info, imageSrc, imageAlt }) {
  if (!modal) return;
  if (modalTitle) modalTitle.textContent = title || "";
  if (modalInfo) modalInfo.textContent = (info || "").trim();
  if (modalImage) {
    modalImage.src = imageSrc || "";
    modalImage.alt = imageAlt || title || "";
  }
  modal.classList.remove("hidden");
}

function closeModal() {
  if (!modal) return;
  modal.classList.add("hidden");
}

// ====== CLICK EN LAS IMÁGENES PARA ABRIR MODAL ======
function setupCardClicks() {
  document.querySelectorAll(".card").forEach((card) => {
    const title =
      card.dataset.title ||
      (card.querySelector(".card-body h3")
        ? card.querySelector(".card-body h3").textContent
        : "Detalles del objeto");

    const info = card.dataset.info || "Sin información técnica.";

    const imageContainer = card.querySelector(".card-image");
    const img = imageContainer ? imageContainer.querySelector("img") : null;

    if (!imageContainer || !img) return;

    imageContainer.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      openModal({
        title,
        info,
        imageSrc: img.src,
        imageAlt: img.alt || title,
      });
    });
  });
}

// ====== COLLAGE: SPANS SEGÚN PROPORCIÓN Y RESOLUCIÓN ======
function applyCollageLayout() {
  const grid = document.querySelector(".gallery-grid");
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll(".card"));
  if (!cards.length) return;

  // Calculamos áreas para saber cuáles son “grandes”
  const areas = cards.map((card) => {
    const img = card.querySelector(".card-image img");
    if (!img || !img.naturalWidth || !img.naturalHeight) return 1;
    return img.naturalWidth * img.naturalHeight;
  });

  const maxArea = Math.max(...areas);
  const minArea = Math.min(...areas);
  const range = Math.max(maxArea - minArea, 1);

  cards.forEach((card, index) => {
    const img = card.querySelector(".card-image img");
    if (!img || !img.naturalWidth || !img.naturalHeight) return;

    const w = img.naturalWidth;
    const h = img.naturalHeight;
    const ratio = w / h;          // >1 horizontal, <1 vertical
    const area = areas[index];
    const normArea = (area - minArea) / range; // 0..1

    let colSpan = 1;
    let rowSpan = 1;

    // Según PROPORCIÓN
    if (ratio > 2.0) {
      // muy panorámica
      colSpan = 2;
      rowSpan = 1;
    } else if (ratio > 1.4) {
      // horizontal
      colSpan = 2;
      rowSpan = 2;
    } else if (ratio < 0.8) {
      // bastante vertical
      colSpan = 1;
      rowSpan = 3;
    } else {
      // casi cuadrada / intermedia
      colSpan = 1;
      rowSpan = 2;
    }

    // Pequeño ajuste por RESOLUCIÓN (las más grandes un pelín más)
    if (normArea > 0.7) {
      rowSpan += 1;
    }

    card.style.gridColumn = `span ${colSpan}`;
    card.style.gridRow = `span ${rowSpan}`;
  });
}

// ====== INICIALIZACIÓN ======
document.addEventListener("DOMContentLoaded", () => {
  setupCardClicks();

  const grid = document.querySelector(".gallery-grid");
  if (!grid) return;

  const images = Array.from(grid.querySelectorAll(".card-image img"));
  if (!images.length) return;

  let loadedCount = 0;

  function maybeLayout() {
    loadedCount += 1;
    if (loadedCount === images.length) {
      applyCollageLayout();
    }
  }

  images.forEach((img) => {
    if (img.complete && img.naturalWidth) {
      maybeLayout();
    } else {
      img.addEventListener("load", maybeLayout);
      img.addEventListener("error", maybeLayout);
    }
  });

  // Recalcular al cambiar el tamaño de la ventana
  window.addEventListener("resize", applyCollageLayout);
});

// Cerrar modal
if (modalBackdrop) {
  modalBackdrop.addEventListener("click", closeModal);
}
if (modalClose) {
  modalClose.addEventListener("click", closeModal);
}
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});
