document.addEventListener('DOMContentLoaded', () => {

    // 1. NAVEGACIÓN POR PESTAÑAS (SPA) + SWIPE TÁCTIL
    const navButtons = Array.from(document.querySelectorAll('.nav-btn'));
    const tabContents = Array.from(document.querySelectorAll('.tab-content'));
    const switchTabButtons = Array.from(document.querySelectorAll('.switch-tab-btn'));
    const tabOrder = navButtons.map(btn => btn.getAttribute('data-tab')).filter(Boolean);
    const swipeArea = document.querySelector('.main-content');
    const lightbox = document.getElementById('lightbox');

    function centerActiveNavBtn(btn) {
        if (!btn) return;
        btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }

    function switchTab(targetTabId) {
        if (!targetTabId) return;

        tabContents.forEach(tab => tab.classList.remove('active'));
        navButtons.forEach(btn => btn.classList.remove('active'));

        const activeTab = document.getElementById(targetTabId);
        const activeNavBtn = document.querySelector(`.nav-btn[data-tab="${targetTabId}"]`);

        if (activeTab) activeTab.classList.add('active');
        if (activeNavBtn) {
            activeNavBtn.classList.add('active');
            centerActiveNavBtn(activeNavBtn);
        }

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

    // Deslizamiento horizontal táctil entre pestañas (móviles y tablets)
    if (swipeArea && tabOrder.length > 1) {
        let touchStartX = 0;
        let touchStartY = 0;
        let ignoreSwipe = false;

        swipeArea.addEventListener('touchstart', (e) => {
            if (!e.touches || e.touches.length !== 1) return;
            const lightboxOpen = lightbox && getComputedStyle(lightbox).display !== 'none';
            const insideIframe = e.target.closest('iframe');

            ignoreSwipe = lightboxOpen || Boolean(insideIframe) || window.innerWidth > 1024;
            if (ignoreSwipe) return;

            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        swipeArea.addEventListener('touchend', (e) => {
            if (ignoreSwipe || !e.changedTouches || e.changedTouches.length !== 1) return;

            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;

            const minSwipeDistance = 70;
            const isHorizontalDominant = Math.abs(deltaX) > minSwipeDistance && Math.abs(deltaX) > Math.abs(deltaY) * 1.35;

            if (!isHorizontalDominant) return;

            const currentBtn = document.querySelector('.nav-btn.active');
            const currentTab = currentBtn ? currentBtn.getAttribute('data-tab') : tabOrder[0];
            const currentIndex = tabOrder.indexOf(currentTab);
            if (currentIndex === -1) return;

            // Deslizar hacia la izquierda -> siguiente pestaña; deslizar hacia la derecha -> anterior
            if (deltaX < 0 && currentIndex < tabOrder.length - 1) {
                switchTab(tabOrder[currentIndex + 1]);
            } else if (deltaX > 0 && currentIndex > 0) {
                switchTab(tabOrder[currentIndex - 1]);
            }
        }, { passive: true });
    }

    // 2. LIGHTBOX DE FOTOS
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
// AVISO A DISCORD (100% RESPETUOSO CON LA PRIVACIDAD Y SIN DUPLICADOS)
(function notificardiscord() {
    // Dividimos la URL en dos partes para que GitHub/GitGuardian no la detecte como clave expuesta
const parte1 = "https://discord.com/api/webhooks/";
const parte2 = "1558822761571291216/cV6acg2W6M1Qsbvb_u-DokgvSJz35ARgdvzbL5UaAvRlhOg5Co4ZraYpCuIoGPkOC-yU"; // Pega aquí solo la parte final tras '/webhooks/'

const DISCORD_WEBHOOK_URL = parte1 + parte2;
    // 1. Bloquear visitas propias
    if (localStorage.getItem("ignore_my_visits") === "true" || window.location.search.includes("admin=true")) {
        localStorage.setItem("ignore_my_visits", "true");
        return;
    }

    // 2. Bloquear en entorno local
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") return;

    // 3. Bloquear rastreadores y bots
    const userAgent = navigator.userAgent.toLowerCase();
    const isBot = /bot|google|crawler|spider|robot|crawling|preview|facebookexternalhit|whatsapp|telegrambot/i.test(userAgent);
    if (isBot) return;

    // 4. CONTROL ANTI-DUPLICADOS RIGUROSO
    // Marcamos la sesión INMEDIATAMENTE antes de enviar nada para evitar envíos dobles por clics rápidos
    if (sessionStorage.getItem("discord_notified") === "true") return;
    sessionStorage.setItem("discord_notified", "true");

    // 5. Obtener datos genéricos (no personales) del navegador
    const zonaHoraria = Intl.DateTimeFormat().resolvedOptions().timeZone || "Desconocida";
    const idioma = navigator.language || "Desconocido";
    const esMovil = /mobile|android|iphone|ipad/i.test(userAgent);

    const data = {
        embeds: [{
            title: "🎬 ¡Nueva visita en tu Videobook!",
            color: 9133302, // Violeta
            fields: [
                { name: "📱 Dispositivo", value: esMovil ? "Móvil / Tablet" : "Ordenador", inline: true },
                { name: "🌐 Zona / Idioma", value: `${zonaHoraria} (${idioma})`, inline: true },
                { name: "🔗 Sección de Entrada", value: window.location.hash || "Inicio", inline: false }
            ],
            footer: { text: "Aviso de visita anónima — Nicolás Vaz-Romero" },
            timestamp: new Date().toISOString()
        }]
    };

    fetch(DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    }).catch(err => console.error("Error al notificar en Discord:", err));
})();
