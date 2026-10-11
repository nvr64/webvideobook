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
// AVISO DETALLADO A DISCORD (FILTRANDO BOTS Y VISITAS PROPIAS)
(function notificardiscord() {
    const DISCORD_WEBHOOK_URL = "https://ptb.discord.com/api/webhooks/1558796423103905982/EWrLVzUoFxzIiTudWgNPK-j6RiV7EhRvs1UXBa2ACK2FJAlt2jnHr-MHA1Uw5jZXpaxI"; 

    // 1. FILTRO DE VISITAS PROPIAS: Desactiva notificaciones si estás en modo pruebas/desarrollo
    // Si quieres bloquear tus visitas desde tu móvil o PC cuando estés en la web real,
    // puedes añadir en la URL de tu navegador '?admin=true' una vez (ej: tuweb.com/?admin=true)
    if (localStorage.getItem("ignore_my_visits") === "true" || window.location.search.includes("admin=true")) {
        localStorage.setItem("ignore_my_visits", "true");
        return;
    }

    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") return;

    // 2. FILTRO DE BOTS Y RASTREADORES (Google Analytics, WhatsApp, spiders, etc.)
    const userAgent = navigator.userAgent.toLowerCase();
    const isBot = /bot|google|crawler|spider|robot|crawling|preview|facebookexternalhit|whatsapp|telegrambot/i.test(userAgent);
    if (isBot) return;

    // 3. CONTROL DE SESIÓN (Máximo 1 aviso por usuario/sesión)
    if (sessionStorage.getItem("discord_notified")) return;

    // 4. OBTENER UBICACIÓN DE LA VISITA (Vía API gratuitaipapi.co)
    fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(ipData => {
            const ciudad = ipData.city || "Desconocida";
            const pais = ipData.country_name || "Desconocido";
            const ip = ipData.ip || "Oculta";
            const proveedor = ipData.org || "Desconocido";

            // Enviar embed detallado a Discord
            const data = {
                embeds: [{
                    title: "🎬 ¡Nueva visita en tu Videobook! @everyone",
                    color: 9133302, // Violeta
                    fields: [
                        { name: "📍 Ubicación", value: `${ciudad}, ${pais}`, inline: true },
                        { name: "🌐 IP / Proveedor", value: `${ip} (${proveedor})`, inline: true },
                        { name: "📱 Dispositivo", value: navigator.userAgent.includes("Mobile") ? "Móvil / Tablet" : "Ordenador", inline: true },
                        { name: "🔗 URL", value: window.location.href, inline: false }
                    ],
                    footer: { text: "Sistema de notificaciones — Nicolás Vaz-Romero" },
                    timestamp: new Date().toISOString()
                }]
            };

            return fetch(DISCORD_WEBHOOK_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
        })
        .then(() => {
            sessionStorage.setItem("discord_notified", "true");
        })
        .catch(err => console.error("Error en notificación de Discord:", err));
})();
