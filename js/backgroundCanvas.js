// js/backgroundCanvas.js
export function backgroundStars(config = {}) {
    const canvas = document.getElementById('background');
    if (!canvas) {
        console.error('backgroundStars: canvas#background not found');
        return {
            start: () => { },
            stop: () => { },
            updateObstacles: () => { },
            getSettings: () => ({ ...config })
        };
    }
    const ctx = canvas.getContext('2d');

    // ------------------ НАСТРОЙКИ ------------------
    const settings = Object.assign({
        color: '111,111,111',    // Цвет звёзд
        maxStars: 500,           // Максимальное число звёзд
        mouseRadius: 140,        // Радиус притяжения курсора
        baseSpeed: 0.5,          // Базовая скорость
        drift: 0.05,             // Случайный дрейф
        drag: 0.97,              // Замедление
        attractForce: 0.01,       // Сила притяжения к курсору
        repelForce: 0.01,         // Сила отталкивания от препятствий
        repelRadius: 10,        // Радиус отталкивания от препятствий
        sizeMin: 0.2,            // Минимальный размер звезды
        sizeMax: 1.5,            // Максимальный размер звезды
        scrollBoost: -0.6,       // Влияние прокрутки
        scrollDamping: 0.1,      // Затухание скролла
        fadeInSpeed: 0.02,       // Скорость появления
        fadeOutSpeed: 0.003,     // Скорость исчезновения
        spawnRate: 5,            // Количество звёзд, создаваемых за кадр
    }, config);

    // ------------------ СОСТОЯНИЕ ------------------
    const stars = [];
    const obstacles = [];
    const mouse = { x: -9999, y: -9999 };
    let animId = null;
    let scrollVelocity = 0;

    // ------------------ РАЗМЕР CANVAS ------------------
    function fitCanvas() {
        canvas.width = Math.floor(window.innerWidth);
        canvas.height = Math.floor(window.innerHeight);
    }
    fitCanvas();
    window.addEventListener('resize', () => { fitCanvas(); updateObstacles(); });

    // ------------------ МЫШЬ ------------------
    window.addEventListener('mousemove', e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    window.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

    // ------------------ СКРОЛЛ ------------------
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
        const dy = window.scrollY - lastScrollY;
        lastScrollY = window.scrollY;
        scrollVelocity = settings.scrollBoost * Math.sign(dy);
        for (const s of stars) s.vy += scrollVelocity * Math.random();
    });

    // ------------------ СОЗДАНИЕ ЗВЁЗД ------------------
    const rand = (a, b) => a + Math.random() * (b - a);
    function createStar() {
        return {
            x: rand(0, canvas.width),
            y: rand(0, canvas.height),
            vx: rand(-settings.baseSpeed, settings.baseSpeed),
            vy: rand(-settings.baseSpeed, settings.baseSpeed),
            radius: rand(settings.sizeMin, settings.sizeMax),
            opacity: 0,
            life: rand(4 * 60, 10 * 60),
            age: 0
        };
    }

    function initEmpty() { stars.length = 0; }

    // ------------------ ПРЕПЯТСТВИЯ ------------------
    function updateObstacles() {
        obstacles.length = 0;
        document.querySelectorAll('.star-obstacle').forEach(el => {
            const r = el.getBoundingClientRect();
            obstacles.push({
                x: r.left + r.width / 2,
                y: r.top + r.height / 2,
                radius: Math.max(r.width, r.height) / 2
            });
        });
    }
    updateObstacles();
    const mo = new MutationObserver(() => updateObstacles());
    mo.observe(document.body, { childList: true, subtree: true });

    // ------------------ ПОСТЕПЕННОЕ СОЗДАНИЕ ------------------
    function spawnStep() {
        const need = settings.maxStars - stars.length;
        if (need <= 0) return;
        const count = Math.min(settings.spawnRate, need);
        for (let i = 0; i < count; i++) stars.push(createStar());
    }

    // ------------------ ОБНОВЛЕНИЕ ------------------
    function updateAndStep() {
        spawnStep();

        for (let i = stars.length - 1; i >= 0; i--) {
            const s = stars[i];
            s.age++;

            // Плавное появление/исчезновение
            const lifePortion = s.age / s.life;
            if (lifePortion < 0.2) s.opacity = Math.min(1, s.opacity + settings.fadeInSpeed);
            else if (lifePortion > 0.85) s.opacity = Math.max(0, s.opacity - settings.fadeOutSpeed);
            else s.opacity = 1;

            if (s.age > s.life || (s.opacity <= 0 && s.age > s.life * 0.5)) {
                stars[i] = createStar();
                continue;
            }

            // Притяжение к курсору
            const dx = mouse.x - s.x;
            const dy = mouse.y - s.y;
            const dist = Math.hypot(dx, dy);
            if (dist < settings.mouseRadius) {
                const force = (1 - dist / settings.mouseRadius) * settings.attractForce;
                s.vx += dx * force;
                s.vy += dy * force;
            }

            // Отталкивание от препятствий
            for (const obs of obstacles) {
                const dxo = s.x - obs.x;
                const dyo = s.y - obs.y;
                const distO = Math.hypot(dxo, dyo);
                if (distO < settings.repelRadius + obs.radius) {
                    const repel = (1 - distO / (settings.repelRadius + obs.radius)) * settings.repelForce;
                    s.vx += (dxo / distO) * repel;
                    s.vy += (dyo / distO) * repel;
                }
            }

            // Дрейф + движение
            s.vx += (Math.random() - 0.5) * settings.drift;
            s.vy += (Math.random() - 0.5) * settings.drift;

            s.x += s.vx;
            s.y += s.vy;

            s.vx *= settings.drag;
            s.vy *= settings.drag;

            // Обёртка за границами
            if (s.x < 0) s.x = canvas.width;
            if (s.x > canvas.width) s.x = 0;
            if (s.y < 0) s.y = canvas.height;
            if (s.y > canvas.height) s.y = 0;
        }

        scrollVelocity *= settings.scrollDamping;
    }

    // ------------------ РЕНДЕР ------------------
    function draw() {
        ctx.fillStyle = '#00000055';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (const s of stars) {
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${settings.color},${Math.max(0, Math.min(1, s.opacity))})`;
            ctx.fill();
        }
    }

    // ------------------ АНИМАЦИЯ ------------------
    function frame() {
        updateAndStep();
        draw();
        animId = requestAnimationFrame(frame);
    }

    // ------------------ ПУБЛИЧНЫЙ API ------------------
    return {
        start() {
            if (animId) return;
            fitCanvas();
            updateObstacles();
            animId = requestAnimationFrame(frame);
        },
        stop() {
            if (animId) cancelAnimationFrame(animId);
            animId = null;
        },
        updateObstacles,
        setColor(r, g, b) { settings.color = `${r},${g},${b}`; },
        setCount(n) { settings.maxStars = Math.max(0, Math.floor(n)); },
        setAttractForce(v) { settings.attractForce = Math.max(0, v); },
        setRepelForce(v) { settings.repelForce = Math.max(0, v); },
        getSettings() { return { ...settings }; }
    };
}
