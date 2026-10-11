document.addEventListener('DOMContentLoaded', () => {

    // 1. NAVEGACIÓN POR PESTAÑAS (SPA)
    const navButtons = document.querySelectorAll('.nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const switchTabButtons = document.querySelectorAll('.switch-tab-btn');

    function switchTab(targetTabId) {
        // Desactivar pestañas y botones
        tabContents.forEach(tab => tab.classList.remove('active'));
        navButtons.forEach(btn => btn.classList.remove('active'));

        // Activar pestaña solicitada
        const activeTab = document.getElementById(targetTabId);
        const activeNavBtn = document.querySelector(`.nav-btn[data-tab="${targetTabId}"]`);

        if (activeTab) activeTab.classList.add('active');
        if (activeNavBtn) activeNavBtn.classList.add('active');

        // Desplazarse arriba suavemente
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            switchTab(targetTab);
        });
    });

    switchTabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-target');
            switchTab(targetTab);
        });
    });

    // 2. LIGHTBOX DE FOTOS
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.lightbox-close');
    const photoTriggers = document.querySelectorAll('.lightbox-trigger');

    photoTriggers.forEach(img => {
        img.addEventListener('click', () => {
            lightbox.style.display = 'flex';
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
        });
    });

    closeBtn.addEventListener('click', () => {
        lightbox.style.display = 'none';
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target !== lightboxImg) {
            lightbox.style.display = 'none';
        }
    });
});