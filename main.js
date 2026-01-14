// =============
// Инициализация после загрузки DOM
// =============
document.addEventListener('DOMContentLoaded', function () {
  initGallery();
  initBurgerMenu();
  initCallModal();
});

// =============
// Галерея (Lightbox)
// =============
function initGallery() {
  // Отключаем галерею на мобильных и планшетах
  if (window.innerWidth < 768) {
    return;
  }

  const imageModal = document.getElementById('imageModal');
  if (!imageModal) return;

  const modalImg = document.getElementById('modalImage');
  const closeBtn = imageModal.querySelector('.modal__close');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const counter = document.getElementById('imageCounter');
  const images = document.querySelectorAll('.portfolio__item img');

  if (images.length === 0) return;

  let currentIndex = 0;

  images.forEach((img, index) => {
    img.addEventListener('click', () => {
      currentIndex = index;
      modalImg.src = img.src;
      modalImg.alt = img.alt;
      imageModal.style.display = 'block';
      updateCounter();
      document.body.style.overflow = 'hidden';
    });
  });

  function updateCounter() {
    if (counter) {
      counter.textContent = `${currentIndex + 1} / ${images.length}`;
    }
  }

  const closeModal = () => {
    imageModal.style.display = 'none';
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  imageModal.addEventListener('click', (e) => {
    if (e.target === imageModal) closeModal();
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex > 0) ? currentIndex - 1 : images.length - 1;
      modalImg.src = images[currentIndex].src;
      modalImg.alt = images[currentIndex].alt;
      updateCounter();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex < images.length - 1) ? currentIndex + 1 : 0;
      modalImg.src = images[currentIndex].src;
      modalImg.alt = images[currentIndex].alt;
      updateCounter();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (imageModal.style.display !== 'block') return;
    if (e.key === 'ArrowLeft') prevBtn?.click();
    if (e.key === 'ArrowRight') nextBtn?.click();
    if (e.key === 'Escape') closeModal();
  });
}

// =============
// Бургер-меню
// =============
function initBurgerMenu() {
  const burger = document.querySelector('.burger');
  const mobileMenu = document.querySelector('.mobile-menu');

  // Если элементов нет — выходим
  if (!burger || !mobileMenu) return;

  // Переключение меню
  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
  });

  // Закрытие по клику на ссылку
  const menuLinks = mobileMenu.querySelectorAll('a');
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('active');
      mobileMenu.classList.remove('active');
    });
  });

  // Закрытие по клику вне меню
  document.addEventListener('click', (e) => {
    if (
      !mobileMenu.contains(e.target) &&
      !burger.contains(e.target) &&
      mobileMenu.classList.contains('active')
    ) {
      burger.classList.remove('active');
      mobileMenu.classList.remove('active');
    }
  });
}

// =============
// Попап "Вызвать мастера"
// =============
function initCallModal() {
  const callModal = document.getElementById('callModal');
  const openCallBtn = document.getElementById('openCallModal');
  const closeCallBtn = document.getElementById('closeCallModal');

  if (!callModal || !openCallBtn || !closeCallBtn) return;

  const openCallModal = () => {
    callModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  };

  const closeCallModal = () => {
    callModal.style.display = 'none';
    document.body.style.overflow = '';
  };

  openCallBtn.addEventListener('click', openCallModal);
  closeCallBtn.addEventListener('click', closeCallModal);

  // Закрытие по клику на оверлей
  window.addEventListener('click', (e) => {
    if (e.target === callModal) closeCallModal();
  });
}
