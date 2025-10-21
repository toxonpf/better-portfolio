// h1 -----------------------------

let shot1 = new SplitText('#sitePart1 h1', {
    type: 'chars',
    charsClass: 'labelChar',
});

const charsContainer = document.querySelector('#sitePart1 h1');
const chars = shot1.chars;

// 2 копии текста
const originalText = chars.map(c => c.textContent).join('');
charsContainer.innerHTML = '';

for (let i = 0; i < 3; i++) {
    for (const char of originalText) {
        const span = document.createElement('span');
        span.className = 'labelChar';
        span.textContent = char;
        charsContainer.appendChild(span);
    }
}

let speed = 50;
let position = 0;

// движение текста
gsap.ticker.add(() => {
    position -= speed / 60;
    charsContainer.style.transform = `translateX(${position}px)`;

    const totalWidth = charsContainer.scrollWidth / 3;
    if (Math.abs(position) >= totalWidth) position = 0;

    speed = gsap.utils.interpolate(speed, 50, 0.05);
});

// прокрутку
let lastScrollY = window.scrollY;
let lastTime = performance.now();

window.addEventListener('scroll', () => {
    const now = performance.now();
    const deltaTime = now - lastTime;
    const deltaScroll = Math.abs(window.scrollY - lastScrollY);
    const scrollSpeed = deltaScroll / deltaTime * 100;
    const newSpeed = gsap.utils.clamp(50, 800, 50 + scrollSpeed * 10);
    speed = gsap.utils.interpolate(speed, newSpeed, 0.3);

    lastScrollY = window.scrollY;
    lastTime = now;
});



const allChars = Array.from(charsContainer.querySelectorAll('.labelChar'));

// Набор анимаций
const animations = [
    (el) => gsap.fromTo(el, {
        y: 0
    }, {
        y: -20,
        duration: 0.4,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut"
    }),
    (el) => gsap.fromTo(el, {
        scale: 1
    }, {
        scale: 1.2,
        duration: 0.3,
        yoyo: true,
        repeat: 1,
        ease: "back.inOut(2)"
    }),
    (el) => gsap.fromTo(el, {
        color: '#fff'
    }, {
        color: 'transparent',
        duration: 0.3,
        yoyo: true,
        repeat: 1,
        ease: "sine.inOut"
    }),
    (el) => gsap.fromTo(el, {
        x: 0
    }, {
        x: gsap.utils.random(-15, 15),
        duration: 0.25,
        yoyo: true,
        repeat: 1,
        ease: "power1.inOut"
    }),
    (el) => gsap.fromTo(el, {
        scaleY: 1
    }, {
        transformOrigin: "50% 40%",
        duration: 0.5,
        yoyo: true,
        repeat: 1,
        ease: "power1.inOut",
        scaleY: -1,
    }),
    (el) => gsap.fromTo(el, {
        textShadow: "0px 0px 0px rgba(255,255,255,0)"
    }, {
        textShadow: "2px 2px 15px rgba(255,255,255,1)",
        duration: 1,
        repeat: 1,
        yoyo: true,
        ease: "power1.inOut"
    }),
    (el) => gsap.fromTo(el, {
        color: '#fff'
    }, {
        color: 'transparent',
        duration: 1,
        repeat: 1,
        yoyo: true,
        ease: CustomEase.create("custom", "M0,0 C0,0 0.01017,0.05568 0.02,0.06016 0.03598,0.06745 0.0602,-0.00461 0.08,-0.01106 0.11528,-0.02256 0.19442,0.02672 0.23,0.05372 0.26382,0.07939 0.33242,0.14055 0.355,0.19447 0.3749,0.24199 0.37469,0.38381 0.395,0.42325 0.40677,0.44611 0.43661,0.4465 0.45,0.4581 0.46431,0.4705 0.49597,0.4946 0.505,0.51978 0.51309,0.54234 0.49927,0.62586 0.515,0.62685 0.54344,0.62865 0.52148,0.41963 0.545,0.38975 0.55481,0.37729 0.56965,0.39588 0.58,0.40332 0.60214,0.41921 0.65385,0.46096 0.67,0.50117 0.68684,0.54308 0.67716,0.68265 0.7,0.70917 0.71947,0.73178 0.76583,0.6534 0.785,0.66794 0.79651,0.67667 0.80566,0.71709 0.81,0.73981 0.81694,0.77617 0.79933,0.90033 0.82,0.90399 0.84112,0.90774 0.82509,0.75805 0.845,0.74126 0.86671,0.72294 0.91459,0.7907 0.93,0.82859 0.94743,0.87145 0.93589,1.02585 0.96,1.04573 0.97257,1.05609 1,1 1,1 "),
    }),
];

function randomLetterAnimation() {
    const randomChar = gsap.utils.random(allChars);
    const randomAnim = gsap.utils.random(animations);

    randomAnim(randomChar);

    const nextDelay = 0.2;
    gsap.delayedCall(nextDelay, randomLetterAnimation);

    allChars.forEach((char) => {
        char.classList.add('cursorPointer')
        if (!char.dataset.hasListener) {
            char.addEventListener('click', () => {
                const anim = gsap.utils.random(animations);
                anim(char);
            });
            char.dataset.hasListener = 'true';
        }
    });
}

randomLetterAnimation();

// lorem -------------------------

