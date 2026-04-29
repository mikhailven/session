// === Navigation ===
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;
let current = 0;

const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progressBar = document.getElementById('progressBar');
const trackerCurrent = document.getElementById('trackerCurrent');
const trackerTotal = document.getElementById('trackerTotal');

trackerTotal.textContent = totalSlides;

function showSlide(index) {
    slides.forEach(s => s.classList.remove('active'));
    slides[index].classList.add('active');
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === totalSlides - 1;
    progressBar.style.width = ((index + 1) / totalSlides * 100) + '%';
    trackerCurrent.textContent = index + 1;
}

prevBtn.addEventListener('click', () => { if (current > 0) { current--; showSlide(current); } });
nextBtn.addEventListener('click', () => { if (current < totalSlides - 1) { current++; showSlide(current); } });

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); if (current < totalSlides - 1) { current++; showSlide(current); } }
    if (e.key === 'ArrowLeft') { e.preventDefault(); if (current > 0) { current--; showSlide(current); } }
});

showSlide(0);

// === Slide 1: Interactive slider ===
const axisTrack = document.getElementById('axisTrack');
const thumbMain = document.getElementById('thumbMain');
const thumbController = document.getElementById('thumbController');
const distanceBar = document.getElementById('distanceBar');
const controllerBox = document.getElementById('controllerBox');
const controllerStatus = document.getElementById('controllerStatus');
const controllerConnector = document.getElementById('controllerConnector');
const tensionPercent = document.getElementById('tensionPercent');
const labelMain = document.getElementById('labelMain');
const labelController = document.getElementById('labelController');

let mainPos = 30;
let controllerPos = 70;
let dragging = null;

function lerp(a, b, t) { return a + (b - a) * t; }

function update() {
    thumbMain.style.left = mainPos + '%';
    thumbController.style.left = controllerPos + '%';
    labelMain.style.left = mainPos + '%';
    labelController.style.left = controllerPos + '%';

    const distance = Math.abs(mainPos - controllerPos);
    const tension = Math.min(distance / 45 * 100, 100);

    distanceBar.style.left = Math.min(mainPos, controllerPos) + '%';
    distanceBar.style.width = distance + '%';

    const t = tension / 100;
    const r = Math.round(lerp(74, 248, t));
    const g = Math.round(lerp(222, 113, t));
    const b = Math.round(lerp(128, 113, t));
    const color = `rgb(${r}, ${g}, ${b})`;

    distanceBar.style.background = `rgba(${r}, ${g}, ${b}, 0.3)`;
    controllerBox.style.borderColor = `rgba(${r}, ${g}, ${b}, 0.5)`;
    controllerConnector.style.background = `rgba(${r}, ${g}, ${b}, 0.4)`;
    tensionPercent.style.color = color;
    tensionPercent.textContent = Math.round(tension) + '%';

    if (tension < 20) {
        controllerStatus.textContent = 'Спокоен';
        controllerStatus.style.background = 'rgba(74, 222, 128, 0.15)';
        controllerStatus.style.color = '#16a34a';
        controllerBox.classList.remove('tense');
    } else if (tension < 45) {
        controllerStatus.textContent = 'Настороже';
        controllerStatus.style.background = 'rgba(251, 191, 36, 0.15)';
        controllerStatus.style.color = '#b45309';
        controllerBox.classList.remove('tense');
    } else if (tension < 70) {
        controllerStatus.textContent = 'Тревога';
        controllerStatus.style.background = 'rgba(251, 146, 60, 0.2)';
        controllerStatus.style.color = '#c2410c';
        controllerBox.classList.add('tense');
    } else {
        controllerStatus.textContent = 'ПАНИКА';
        controllerStatus.style.background = 'rgba(248, 113, 113, 0.25)';
        controllerStatus.style.color = '#dc2626';
        controllerBox.classList.add('tense');
    }
}

function getPos(e) {
    const rect = axisTrack.getBoundingClientRect();
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    return Math.max(5, Math.min(95, ((x - rect.left) / rect.width) * 100));
}

thumbMain.addEventListener('mousedown', (e) => { e.preventDefault(); dragging = 'main'; });
thumbMain.addEventListener('touchstart', (e) => { e.preventDefault(); dragging = 'main'; }, { passive: false });
thumbController.addEventListener('mousedown', (e) => { e.preventDefault(); dragging = 'ctrl'; });
thumbController.addEventListener('touchstart', (e) => { e.preventDefault(); dragging = 'ctrl'; }, { passive: false });

document.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    if (dragging === 'main') mainPos = getPos(e);
    else controllerPos = getPos(e);
    update();
});
document.addEventListener('touchmove', (e) => {
    if (!dragging) return;
    if (dragging === 'main') mainPos = getPos(e);
    else controllerPos = getPos(e);
    update();
}, { passive: false });
document.addEventListener('mouseup', () => { dragging = null; });
document.addEventListener('touchend', () => { dragging = null; });

update();
