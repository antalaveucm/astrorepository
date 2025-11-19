// Año en el footer
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// Referencias al modal
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalImage = document.getElementById("modal-image");
const modalInfo = document.getElementById("modal-info");
const modalBackdrop = modal.querySelector(".modal-backdrop");
const modalClose = modal.querySelector(".modal-close");

function openModal({ title, info, imageSrc, imageAlt }) {
  if (modalTitle) modalTitle.textContent = title || "";
  if (modalInfo) modalInfo.textContent = (info || "").trim();

  if (modalImage) {
    modalImage.src = imageSrc || "";
    modalImage.alt = imageAlt || title || "";
  }

  modal.classList.remove("hidden");
}

function closeModal() {
  modal.classList.add("hidden");
}

// Click en la imagen de cada tarjeta -> abrir modal
document.querySelectorAll(".card").forEach((card) => {
  const title = card.dataset.title || "Detalles del objeto";
  const info = card.dataset.info || "Sin información técnica.";

  const imageContainer = card.querySelector(".card-image");
  const img = imageContainer ? imageContainer.querySelector("img") : null;

  if (!imageContainer || !img) return;

  imageContainer.addEventListener("click", (event) => {
    event.stopPropagation(); // evita que otros handlers salten
    openModal({
      title,
      info,
      imageSrc: img.src,
      imageAlt: img.alt || title,
    });
  });
});

// Cerrar modal
modalBackdrop.addEventListener("click", closeModal);
modalClose.addEventListener("click", closeModal);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});
