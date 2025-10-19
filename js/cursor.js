// ---------------- Курсор ----------------

const circleElement = document.querySelector("#cursor");
const cursorImg = circleElement.querySelector("img");

let offsetX = 0;
let offsetY = 0;

function updateOffsets() {
    const circleRect = circleElement.getBoundingClientRect();
    offsetX = circleRect.width / 2;
    offsetY = circleRect.height / 2;
}

if (cursorImg && !cursorImg.complete) {
    cursorImg.onload = updateOffsets;
} else {
    updateOffsets();
}

const windowHeight = window.innerHeight;

const mouse = { x: 0, y: windowHeight / 2 };
const previounsMouse = { x: 0, y: windowHeight / 2 };
const circle = { x: 0, y: windowHeight / 2 };

let currentScale = 0;
let currentAngle = 0;
let lastAngle = 0;

window.addEventListener("mousemove", (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

const speed = 0.17;

const cursorTick = () => {
    circle.x += (mouse.x - circle.x) * speed;
    circle.y += (mouse.y - circle.y) * speed;

    const translateTransform = `translate(${circle.x - offsetX}px, ${circle.y - offsetY}px)`;

    const deltaMouseX = mouse.x - previounsMouse.x;
    const deltaMouseY = mouse.y - previounsMouse.y;
    previounsMouse.x = mouse.x;
    previounsMouse.y = mouse.y;

    const mouseVelocity = Math.min(
        Math.sqrt(deltaMouseX ** 2 + deltaMouseY ** 2) * 5,
        150
    );

    const scaleValue = (mouseVelocity / 150) * 0.5;
    currentScale += (scaleValue - currentScale) * speed;
    const sclaeTransform = `scale(${1 + currentScale}, ${1 - currentScale})`;

    let angle = currentAngle;
    if (deltaMouseX !== 0 || deltaMouseY !== 0) {
        angle = (Math.atan2(deltaMouseY, deltaMouseX) * 180) / Math.PI;
    }

    let deltaAngle = angle - lastAngle;
    deltaAngle = ((deltaAngle + 180) % 360) - 180;
    lastAngle += deltaAngle * speed;
    currentAngle = lastAngle;

    const rotationTransform = `rotate(${currentAngle}deg)`;

    circleElement.style.transform = `${translateTransform} ${rotationTransform} ${sclaeTransform}`;

    requestAnimationFrame(cursorTick);
};

window.cursorTick = cursorTick;
circleElement.style.opacity = "1";

// ---------------- Поведение при уходе ----------------

$(document).ready(function () {
    const $circle = $("#cursor");

    $(document).on("mouseleave", function () {
        $circle.css("opacity", "0");
    });

    $(document).on("mouseenter", function () {
        $circle.css("opacity", "1");
    });

    $("iframe").on("mouseleave", function () {
        $circle.css("opacity", "1");
    });

    $("iframe").on("mouseenter", function () {
        $circle.css("opacity", "0");
    });
});

// ---------------- Hover-поведение ----------------

const elementToScale = document.querySelector("#sircCursor");
const hoverTest = document.querySelector("#hoverTest");

// Проверяем, имеет ли элемент стиль cursor:pointer
function hasPointerCursor(elem) {
    if (!elem || elem === document.body) return false;
    const computed = window.getComputedStyle(elem);
    return computed.cursor === "pointer";
}

// Проверяем, имеет ли элемент нужный класс или pointer-курсор
function isInteractiveElement(elem) {
    return (
        (elem && elem.classList && elem.classList.contains("cursorPointer")) ||
        hasPointerCursor(elem)
    );
}

// Плавное движение hoverTest
let hoverPos = { x: 0, y: 0 };
let targetPos = { x: 0, y: 0 };
const hoverSpeed = 0.2;
const showOffsetX = 20;
const showOffsetY = 20;

function updateHoverPosition() {
    hoverPos.x += (targetPos.x - hoverPos.x) * hoverSpeed;
    hoverPos.y += (targetPos.y - hoverPos.y) * hoverSpeed;

    hoverTest.style.transform = `translate(${hoverPos.x}px, ${hoverPos.y}px)`;
    requestAnimationFrame(updateHoverPosition);
}

updateHoverPosition();

document.addEventListener("mousemove", (e) => {
    const elemBelow = document.elementFromPoint(e.clientX, e.clientY);
    const isTarget = isInteractiveElement(elemBelow);

    targetPos.x = e.clientX + showOffsetX;
    targetPos.y = e.clientY + showOffsetY;

    if (isTarget) {
        elementToScale.style.transform = "scale(1)";
        hoverTest.style.opacity = "1";
    } else {
        elementToScale.style.transform = "scale(0)";
        hoverTest.style.opacity = "0";
    }
});
