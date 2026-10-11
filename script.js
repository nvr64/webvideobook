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
// AVISO INSTANTÁNEO A DISCORD AL ENTRAR A LA WEB
(function notificardiscord() {
    // ⚠️ Reemplaza esta URL por la URL de tu Webhook de Discord
    const DISCORD_WEBHOOK_URL = "https://ptb.discord.com/api/webhooks/1558796423103905982/EWrLVzUoFxzIiTudWgNPK-j6RiV7EhRvs1UXBa2ACK2FJAlt2jnHr-MHA1Uw5jZXpaxI"; 

    // Evita enviar notificaciones si estás probando la web localmente (en tu PC)
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") return;

    // Control para enviar máximo 1 aviso por sesión (evita spam si el usuario recarga)
    if (sessionStorage.getItem("discord_notified")) return;

    const data = {
        embeds: [{
            title: "🎬 ¡Alguien acaba de entrar a tu Videobook! @everyone",
            color: 9133302, // Color violeta en código decimal
            fields: [
                { name: "Página cargada", value: window.location.href, inline: true },
                { name: "Dispositivo", value: navigator.userAgent.includes("Mobile") ? "📱 Móvil" : "💻 Ordenador", inline: true }
            ],
            timestamp: new Date().toISOString()
        }]
    };

    fetch(DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    }).then(() => {
        sessionStorage.setItem("discord_notified", "true");
    }).catch(err => console.error("Error al enviar notificación a Discord:", err));
})();
