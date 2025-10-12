const slider = document.querySelector('#openingRange');

// ANIMATIONS------------------------------

gsap.registerPlugin(SplitText);

let shot1 = SplitText.create('#shot1 div', {
    type: 'chars, words, lines',
    wordsClass: 'chars',
    mask: 'chars'
});

let tl = gsap.timeline();

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
            const direction = i < 3 ? 1 : -1; // слева направо / справа налево
            const distance = Math.abs(i - 3);
            const falloff = 1; // чем больше — тем плавнее затухание
            return direction * -70 / (1 + distance * falloff);
        },
        skewY: (i) => {
            if (i === 3) return 0;
            const direction = i < 3 ? 1 : -1; // слева направо / справа налево
            const distance = Math.abs(i - 3);
            const falloff = 1; // чем больше — тем плавнее затухание
            return direction * 110 / (1 + distance * falloff);
        },
        scaleY: (i) => {
            if (i === 3) return 2
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
        ease: CustomEase.create("custom", "M0,0 C0,0 0.028,0.215 0.045,0.276 0.051,0.299 0.061,0.326 0.07,0.34 0.076,0.351 0.07,0.356 0.1,0.375 0.25,0.472 0.71,0.543 0.875,0.612 0.907,0.626 0.906,0.626 0.915,0.634 0.925,0.644 0.939,0.67 0.945,0.683 0.952,0.699 0.96,0.729 0.965,0.751 0.977,0.807 1,1 1,1 "),
        duration: 1,
        
        top: '102vh'
    }, '<+=0.5');

const 
    shot3 = document.querySelector('#shot3'),
    navbar = document.querySelector('#navbar'),
    state = Flip.getState(shot3);

tl.add()