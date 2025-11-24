import { backgroundStars } from './backgroundCanvas.js';

// Фиксируем время последнего показа интро, чтобы решить, когда проигрывать.
// EN: Store the last opening play time to decide when to play the intro.
const OPENING_STORAGE_KEY = 'openingLastPlayedAt';
const OPENING_COOLDOWN_MS = 5 * 60 * 1000; // 5 минут

// Флаги для ленивой инициализации (чтобы запускать один раз).
// EN: Lazy flags for one-time initializations.
let backgroundInstance;
let cursorStarted = false;
let hoverTestShown = false;
let navbarInitialized = false;
let scrollArrowInitialized = false;
let sitePart1TitleInitialized = false;
let sitePart1SubtitleInitialized = false;

const getLastOpeningPlay = () => {
    const raw = localStorage.getItem(OPENING_STORAGE_KEY);
    const parsed = parseInt(raw, 10);
    return Number.isFinite(parsed) ? parsed : null;
};

// Хелперы для чтения/записи/очистки отметки времени.
// EN: Helpers to read/write/clear the timestamp marker.
const setLastOpeningPlay = (timestamp = Date.now()) => localStorage.setItem(OPENING_STORAGE_KEY, String(timestamp));
const clearLastOpeningPlay = () => localStorage.removeItem(OPENING_STORAGE_KEY);

const shouldPlayOpening = () => {
    const lastPlay = getLastOpeningPlay();
    if (!lastPlay) return true;
    return Date.now() - lastPlay >= OPENING_COOLDOWN_MS;
};

// Показ подсказки, если ещё не показывали.
// EN: Show the hover hint if it hasn't been shown yet.
const showHoverTest = () => {
    if (hoverTestShown) return;
    const hoverTest = document.querySelector('#hoverTest');
    if (hoverTest) {
        hoverTest.style.display = 'block';
        hoverTestShown = true;
    }
};

// Удаляем блок открытия из DOM.
// EN: Remove the opening block from the DOM.
const removeOpeningBlock = () => {
    const openingBlock = document.querySelector('#openingBlock');
    if (openingBlock) openingBlock.remove();
};

// Запуск звёздного фона (если не запущен).
// EN: Start the background stars instance (if not started).
const startBackground = () => {
    if (backgroundInstance) return;
    backgroundInstance = backgroundStars({
        fadeInDuration: 120,
    });
    backgroundInstance.start();
};

// Запуск пользовательского курсора (если доступен и ещё не запущен).
// EN: Start the custom cursor (if available and not started).
const startCursor = () => {
    if (cursorStarted) return;
    if (typeof cursorTick === 'function') {
        cursorTick();
        cursorStarted = true;
    }
};

// Включаем вертикальную прокрутку страницы (после интро).
// EN: Enable body vertical scroll (after intro finishes).
const enableBodyScroll = () => {
    document.body.style.overflowY = "scroll";
};

// Перемещаем `shot3/line` в navbar и масштабируем (опционально с Flip).
// EN: Re-home `shot3/line` into the navbar and scale it (optionally with Flip animation).
const setupNavbar = (withAnimation = true) => {
    if (navbarInitialized && !withAnimation) return;

    const shot3 = document.querySelector("#shot3");
    const navbar = document.querySelector("#navbar");
    const line = document.querySelector("#line");

    if (!shot3 || !navbar || !line) return;

    const state = withAnimation ? Flip.getState(shot3) : null;

    navbar.style.height = '60px';
    navbar.style.padding = '10px 0px';
    shot3.style.margin = '5px';

    // Перемещаем линию в shot3 и масштабируем её внутри navbar.
    // EN: Move `line` into `shot3` and scale it to fit the navbar.
    const changeScale = () => {
        shot3.appendChild(line);
        line.style.position = "absolute";
        line.style.top = "50%";
        line.style.left = "50%";
        line.style.transform = "translate(-50%, -50%) translateY(-10px)";
        line.style.height = "110%";
        line.style.display = "block";
        line.style.visibility = "visible";
        navbar.appendChild(shot3);

        const baseSize = window.innerWidth * 0.2;
        const navbarRect = navbar.getBoundingClientRect();
        const scaleY = (navbarRect.height - 20) / baseSize;

        gsap.set(shot3, {
            position: "absolute",
            top: 0,
            left: "50%",
            xPercent: -50,
            width: baseSize,
            height: baseSize,
            transformOrigin: "top center",
            scaleX: scaleY,
            scaleY: scaleY,
        });
    };

    changeScale();

    if (withAnimation && state) {
        Flip.from(state, {
            duration: 1.2,
            ease: "expo.inOut",
            absolute: true,
            scale: true,
            onComplete: () => {
                navbar.style.display = "flex";
                navbar.style.alignItems = "center";
                navbar.style.justifyContent = "center";
            },
        });
    } else {
        navbar.style.display = "flex";
        navbar.style.alignItems = "center";
        navbar.style.justifyContent = "center";
    }

    if (!navbarInitialized) {
        window.addEventListener("resize", changeScale);
    }

    navbarInitialized = true;
};

// Инициализация заголовка первой секции: разбивка на символы и анимация при скролле.
// EN: Initialize the sitePart1 title: split into chars and animate on scroll.
const setupSitePart1Title = () => {
    if (sitePart1TitleInitialized) return;

    let shot1 = new SplitText('#sitePart1 h1', {
        type: 'chars, words, lines',
        charsClass: 'labelChar',

    });

    gsap.set(shot1.chars, { y: 100, opacity: 0 });

    gsap.to(shot1.chars, {
        y: 0,
        opacity: 1,
        ease: "expo.out",
        stagger: 0.03,
        scrollTrigger: {
            trigger: "#sitePart1",
            toggleActions: "play none none none"
        }
    });

    sitePart1TitleInitialized = true;
};

// Стрелка прокрутки: показываем, затем скрываем при скролле.
// EN: Scroll arrow: show it and hide when the user scrolls.
const setupScrollArrow = () => {
    if (scrollArrowInitialized) return;

    const scrollArrow = document.querySelector('#scrollArrow');
    if (!scrollArrow) return;

    const hideArrow = () => {
        gsap.to('#scrollArrow', {
            ease: 'expo.out',
            duration: 1,

            bottom: '50vh',
            opacity: 0,

            onComplete: () => {
                scrollArrow.style.display = "none";
                scrollArrow.classList.remove('star-obstacle');
            }
        });
    };

    window.addEventListener('scroll', hideArrow);

    gsap.to('#scrollArrow', {
        bottom: '5vh'
    });

    scrollArrowInitialized = true;
};

// Подзаголовок: появляется с анимацией, затем реагирует на движение мыши.
// EN: Subtitle: animates in and then reacts to mouse movement.
const setupSitePart1Subtitle = () => {
    if (sitePart1SubtitleInitialized) return;

    let sitePart1h2 = new SplitText('#sitePart1 h2', {
        type: 'chars, words, lines',
        charsClass: 'labelChar',
    });

    const subtitleTimeline = gsap.timeline();

    subtitleTimeline.fromTo(sitePart1h2.words, {
        yPercent: 100,
        opacity: 0
    }, {
        stagger: {
            from: 'start',
            each: 0.05
        },
        yPercent: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        onComplete: () => {
            const chars = sitePart1h2.words;
            const strength = 20;
            const damp = 1;

            const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

            window.addEventListener('mousemove', e => {
                mouse.x = e.clientX;
                mouse.y = e.clientY;
            });

            // Простейший тик для смещения слов в зависимости от позиции мыши.
            // EN: Simple tick that shifts words based on mouse position.
            function tick() {
                chars.forEach((char) => {
                    const rect = char.getBoundingClientRect();
                    const cx = rect.left + rect.width / 2;
                    const cy = rect.top + rect.height / 2;

                    const dx = mouse.x - cx;
                    const dy = mouse.y - cy;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    const pull = Math.max(0, (1 - dist / 400));

                    const moveX = dx * pull * (strength / 200);
                    const moveY = dy * pull * (strength / 200);

                    gsap.to(char, {
                        x: moveX,
                        y: moveY,
                        duration: damp,
                        ease: "power2.out"
                    });
                });

                requestAnimationFrame(tick);
            }
            tick();
        }
    });

    sitePart1SubtitleInitialized = true;
};

// Быстрое завершение, если пропускаем анимацию открытия.
// EN: Finalize without running the opening animation (skip intro).
const finalizeWithoutOpeningAnimation = () => {
    setupNavbar(false);
    showHoverTest();
    removeOpeningBlock();
    startBackground();
    startCursor();
    enableBodyScroll();
    setupSitePart1Title();
    setupScrollArrow();
    setupSitePart1Subtitle();
};

let openingTimeline;

// Полный таймлайн интро; onStart ставит отметку последнего проигрыша.
// EN: Full intro timeline; onStart stamps the last-play timestamp.
const createOpeningTimeline = () => {
    // Разбиваем `#shot1 div` на символы перед анимацией.
    // EN: Split `#shot1 div` into characters before animation.
    let shot1 = SplitText.create('#shot1 div', {
        type: 'chars, words, lines',
        wordsClass: 'chars',
        mask: 'chars'
    });

    let tl = gsap.timeline({
        onStart: () => setLastOpeningPlay()
    });

    // Оригинальная последовательность пролога.
    // EN: Original prologue animation sequence.
    tl
        .from(shot1.chars, {
            delay: 0.3,
            ease: 'back.out',
            stagger: {
                each: 0.03,
                from: 'start',
            },
            opacity: 0,
            yPercent: 100,

            onComplete: () => {
                shot1.chars.forEach(char => {
                    char.parentNode.style.overflow = 'visible';
                });
            }

        })
        .to(shot1.chars, {
            ease: CustomEase.create("custom", "M0,0 C0.104,0.204 0.286,0.821 1,1 "),
            duration: 0.7,
            delay: 0,
            stagger: {
                each: 0.02,
                from: 'center',
            },

            yPercent: (i) => {
                let distance = Math.abs(i - 3);
                return -100 / (1 + distance * 0.5);
            },
            skewX: (i) => {
                if (i === 3) return 0;
                const direction = i < 3 ? 1 : -1;
                const distance = Math.abs(i - 3);
                const falloff = 1;
                return direction * -70 / (1 + distance * falloff);
            },
            skewY: (i) => {
                if (i === 3) return 0;
                const direction = i < 3 ? 1 : -1;
                const distance = Math.abs(i - 3);
                const falloff = 1;
                return direction * 110 / (1 + distance * falloff);
            },
            scaleY: (i) => {
                if (i === 3) return 2;
            },

        })
        .fromTo('#shot2', {
            y: '110vh',
        }, {
            duration: 0.8,
            ease: CustomEase.create("custom", "M0,0,C0,0,0.028,0.215,0.045,0.276,0.051,0.299,0.061,0.326,0.07,0.34,0.076,0.351,0.07,0.356,0.1,0.375,0.25,0.472,0.71,0.543,0.875,0.612,0.907,0.626,0.906,0.626,0.915,0.634,0.925,0.644,0.939,0.67,0.945,0.683,0.952,0.699,0.96,0.729,0.965,0.751,0.977,0.807,1,1,1,1"),

            y: '-50vh'
        }, '<')
        .to(shot1.chars, {
            duration: 0.8,
            stagger: {
                each: 0.01,
                from: 3,
            },
            ease: 'expo.in',

            y: (i) => {
                let distance = Math.abs(i - 3);
                return -200 / (1 + distance * 0.5) + 'vh';
            },
        }, '<+=0.27')
        .to('#shot3', {
            duration: 1.5,
            ease: 'elastic.out(1,0.5)',

            top: 'calc(50vh - 10vw)'
        }, '<+=0.7')
        .to('#line', {
            duration: 1.5,
            ease: 'elastic.out(1,0.5)',

            top: 'calc(50% - 9.5vw - 1px)'
        }, '<')
        .to('#shot4', {
            keyframes: [
                {
                    duration: 0.3,
                    ease: "power2.in",

                    top: '40vh',
                    scaleY: 1.3,
                    scaleX: 0.8,
                },
                {
                    duration: 0.4,
                    ease: "power1",

                    top: '80vh',
                    scaleY: 1.1,
                    scaleX: 0.9,
                },
                {
                    duration: 0.3,
                    ease: "power2.out",

                    top: '102vh',
                    scaleY: 1,
                    scaleX: 1,
                }
            ],
            transformOrigin: "center center",
            ease: CustomEase.create("custom", "M0,0 C0,0 0.028,0.215 0.045,0.276 0.051,0.299 0.061,0.326 0.07,0.34 0.076,0.351 0.07,0.356 0.1,0.375 0.25,0.472 0.71,0.543 0.875,0.612 0.907,0.626 0.906,0.626 0.915,0.634 0.925,0.644 0.939,0.67 0.945,0.683 0.952,0.699 0.96,0.729 0.965,0.751 0.977,0.807 1,1 1,1 ")
        }, '<+=0.5')
        .to('#cursor', {

        })
        // После пролога: переставляем узлы и включаем основной контент.
        // EN: After the prologue: rearrange nodes and enable main content.
        .call(() => setupNavbar(true))
        .call(showHoverTest)
        .call(removeOpeningBlock)
        .call(startBackground)
        .call(startCursor)
        .call(enableBodyScroll)
        .call(setupSitePart1Title)
        .call(setupScrollArrow)
        .call(setupSitePart1Subtitle);

    return tl;
};

if (shouldPlayOpening()) {
    openingTimeline = createOpeningTimeline();
} else {
    finalizeWithoutOpeningAnimation();
}

// Утилита в консоли: сбрасывает cooldown и перезагружает страницу, чтобы принудительно показать интро.
// EN: Console helper: clear the cooldown and reload to force the intro.
window.resetOpeningAnimation = () => {
    clearLastOpeningPlay();
    location.reload();
};
