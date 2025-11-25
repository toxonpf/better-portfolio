// Align the navigation block with the current position of #shot3.
const shot3 = document.querySelector('#shot3');
const navigate = document.querySelector('#navigate');
let navOpenWidth = 0;
let opened = false;

const cacheNavOpenWidth = () => {
    if (!navigate) return;
    const rect = navigate.getBoundingClientRect();
    const width = navigate.scrollWidth || rect.width;
    if (width > 0) {
        navOpenWidth = width;
    }
};

function moveNavigateToShot3() {
    if (!shot3 || !navigate || typeof gsap === 'undefined') return;

    const shotRect = shot3.getBoundingClientRect();
    const navRect = navigate.getBoundingClientRect();

    const shotCenterX = shotRect.left + shotRect.width / 2;
    const shotCenterY = shotRect.top;

    const deltaX = shotCenterX - navRect.left;
    const deltaY = shotCenterY - navRect.top;
    const targetPaddingLeft = opened ? shotRect.width / 1.2 : 0;
    const targetPaddingRight = opened ? '30px' : '0px';
    const targetWidth = opened
        ? navOpenWidth || navigate.scrollWidth || navRect.width
        : 0;

    navigate.style.position = 'absolute';
    navigate.style.left = `${navRect.left + window.scrollX}px`;
    navigate.style.top = `${navRect.top + window.scrollY}px`;

    gsap.to(navigate, {
        x: deltaX,
        y: deltaY,
        height: shotRect.height,
        paddingLeft: targetPaddingLeft,
        paddingRight: targetPaddingRight,
        width: targetWidth,
        duration: 0,
        ease: 'expo.out'
    });

    cacheNavOpenWidth();
};

moveNavigateToShot3();
window.addEventListener('resize', moveNavigateToShot3);

window.addEventListener('load', () => {
    moveNavigateToShot3();
    window.addEventListener('resize', moveNavigateToShot3);
});

cacheNavOpenWidth();

shot3.addEventListener('click', () => {
    if (!navigate) return;

    cacheNavOpenWidth();

    const shotRect = shot3.getBoundingClientRect();
    const targetWidth = navOpenWidth || navigate.scrollWidth || navigate.getBoundingClientRect().width;

    if (opened) {
        gsap.to(navigate, {
            ease: "power4.out",

            width: '0px',
            paddingLeft: '0px',
            paddingRight: '0px'
        });
        opened = false;
    } else {
        gsap.to(navigate, {
            ease: "power4.out",

            width: targetWidth,
            paddingLeft: shotRect.width / 1.2,
            paddingRight: '30px'
        });
        opened = true;
    }
});
