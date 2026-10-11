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
// AVISO A DISCORD (100% RESPETUOSO CON LA PRIVACIDAD Y SIN DUPLICADOS)
(function notificardiscord() {
    const DISCORD_WEBHOOK_URL = "PEGA_AQUI_TU_URL_DE_WEBHOOK"; 

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
