import { backgroundStars } from './backgroundCanvas.js';

// ANIMATIONS------------------------------

let shot1 = SplitText.create('#shot1 div', {
    type: 'chars, words, lines',
    wordsClass: 'chars',
    mask: 'chars'
});

let tl = gsap.timeline();

tl
    .from(shot1.chars, { // буквы всплывают слева направо
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
    .to(shot1.chars, { // резиново оттягиваем символы начиная от опострофа
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
            const direction = i < 3 ? 1 : -1; // слева направо / справа налево
            const distance = Math.abs(i - 3);
            const falloff = 1;
            return direction * -70 / (1 + distance * falloff);
        },
        skewY: (i) => {
            if (i === 3) return 0;
            const direction = i < 3 ? 1 : -1; // слева направо / справа налево
            const distance = Math.abs(i - 3);
            const falloff = 1;
            return direction * 110 / (1 + distance * falloff);
        },
        scaleY: (i) => {
            if (i === 3) return 2
        },

    })
    .fromTo('#shot2', { // стрелка взлетает
        y: '110vh',
    }, {
        duration: 0.8,
        ease: CustomEase.create("custom", "M0,0,C0,0,0.028,0.215,0.045,0.276,0.051,0.299,0.061,0.326,0.07,0.34,0.076,0.351,0.07,0.356,0.1,0.375,0.25,0.472,0.71,0.543,0.875,0.612,0.907,0.626,0.906,0.626,0.915,0.634,0.925,0.644,0.939,0.67,0.945,0.683,0.952,0.699,0.96,0.729,0.965,0.751,0.977,0.807,1,1,1,1"),

        y: '-50vh'
    }, '<')
    .to(shot1.chars, { // резиново утягиваем симфолы за экран
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
    .to('#shot3', { // взлетает шар
        duration: 1.5,
        ease: 'elastic.out(1,0.5)',

        top: 'calc(50vh - 10vw)'
    }, '<+=0.7')
    .to('#line', { // взлетает линия
        duration: 1.5,
        ease: 'elastic.out(1,0.5)',

        top: 'calc(50% - 9.5vw - 1px)'
    }, '<')
    .to('#shot4', { // шарик вместе с ширмой опускаются
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
    .call(() => { // перенос лого в navbar
        const shot3 = document.querySelector("#shot3");
        const navbar = document.querySelector("#navbar");
        const line = document.querySelector("#line");
        const state = Flip.getState(shot3);

        navbar.style.height = '70px';
        navbar.style.padding = '10px 0px';
        shot3.style.margin = '5px';


        function changeScale() {

            shot3.appendChild(line);
            line.style.transform = "translateY(-10px)";
            line.style.height = "110%";
            navbar.appendChild(shot3);

            const baseSize = window.innerWidth * 0.2; // вычисляем 20vw в пикселях
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

        }
        changeScale();
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

        window.addEventListener("resize", changeScale);
    })
    .call(() => { // удаляем блок опенинга
        const openingBlock = document.querySelector('#openingBlock');
        openingBlock.remove();
    })
    .call(() => { // запускаем скрипт анимации фона
        const stars = backgroundStars({
            fadeInDuration: 120,
        });
        stars.start();
    })
    .call(() => { // запускаем анимацию курсора
        cursorTick();
    })
    .call(() => { // анимация лейбла
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
    })
    .call(() => { // анимация стрелки пролистывания
        const scrollArrow = document.querySelector('#scrollArrow');

        window.addEventListener('scroll', () => {
            gsap.to('#scrollArrow', {
                ease: 'expo.out',
                duration: 1,

                bottom: '50vh',
                opacity: 0,

                onComplete: () => {
                    scrollArrow.classList.remove("star-obstacle")
                }
            })
        });

        gsap.to('#scrollArrow', {
            bottom: '5vh'
        })
    })
    .call(() => { // анимация второго заготовка
        let sitePart1h2 = new SplitText('#sitePart1 h2', {
            type: 'chars, words, lines',
            charsClass: 'labelChar',
        });

        // Анимация появления слов
        tl.fromTo(sitePart1h2.words, {
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

                function tick() {
                    chars.forEach((char) => {
                        const rect = char.getBoundingClientRect();
                        const cx = rect.left + rect.width / 2;
                        const cy = rect.top + rect.height / 2;

                        const dx = mouse.x - cx;
                        const dy = mouse.y - cy;
                        const dist = Math.sqrt(dx * dx + dy * dy);

                        // сила ослабляется по мере удаления
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
    })