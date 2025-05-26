// Click light effect
document.addEventListener('click', function(e) {
    const bodyRect = document.body.getBoundingClientRect();
    const x = e.clientX - bodyRect.left;
    const y = e.clientY - bodyRect.top;

    const clickLight = document.createElement('div');
    clickLight.className = 'click-light';
    clickLight.style.left = `${x}px`;
    clickLight.style.top = `${y}px`;
    document.body.appendChild(clickLight);
    clickLight.addEventListener('animationend', () => clickLight.remove());
});

//  ------------ SCROLL INPUT HANDLING -------------
const scrollInputPerSecond = 50;
const scrollInputMax = 50;
const scrollInputDream = 25;
const phrases = [
    "something.",
    "anything.",
    "the world.",
    "the sky.",
    "the moment.",
    "the feeling.",
    "your breath.",
    "your heartbeat.",
    "your need.",
    "your truth.",
    "your reality.",
    "your dreams."
];
let scrollInputCount = 0;

let lastScrollTime = 0;
const scrollThrottleDelay = 1000 / scrollInputPerSecond;

function throttledHandleScrollInput() {
    const now = Date.now();
    if (now - lastScrollTime >= scrollThrottleDelay) {
        handleScrollInput();
        lastScrollTime = now;
    }
}

// Listen for wheel events (desktop)
window.addEventListener('wheel', (e) => {
    if (e.deltaY > 0) {
        throttledHandleScrollInput();
    }
});

// Listen for touch events (mobile)
let lastTouchY = null;
window.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches.length > 0) {
        lastTouchY = e.touches[0].clientY;
    }
});
window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches.length > 0 && lastTouchY !== null) {
        const currentY = e.touches[0].clientY;
        if (currentY < lastTouchY) { // Swiping up = scrolling down
            throttledHandleScrollInput();
        }
        lastTouchY = currentY;
    }
});

// Scroll indicator visibility logic
const scrollIndicator = document.getElementById('scroll-indicator');
let scrollTimeout;
handleScrollIndicator();

function showScrollIndicator() {
    if (scrollIndicator) scrollIndicator.style.opacity = '1';
}
function hideScrollIndicator() {
    if (scrollIndicator) scrollIndicator.style.opacity = '0';
}
function handleScrollIndicator() {
    if (!scrollIndicator) return;
    hideScrollIndicator();
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(showScrollIndicator, 250);
}

// Scroll input logic
const altText = document.getElementById('alternate-text');
const scrollText = document.getElementById('scroll-text');
const maxPulseScale = 2;
const maxIndex = phrases.length - 1;
let percentage = 0;
let scale = 1;
let index = 0;
let phraseOpacity, phraseBlur;
let complete = false;

function handleScrollInput() {
    scrollInputCount++;
    // Calculate progress as a percentage (0 to 1)
    percentage = Math.min(scrollInputCount / scrollInputMax, 1);

    // Scale the pulse light: base 1, up to maxPulseScale at 100%
    scale = 1 + (maxPulseScale - 1) * percentage;
    document.documentElement.style.setProperty('--pulse-scale', scale);

    if (complete) {
        if (percentage === 1) complete = true;
        return;
    }

    if (altText && phrases.length > 0) {
        // Calculate which phrase to show
        index = Math.min(Math.floor(percentage * maxIndex), maxIndex);

        // Calculate opacity and blur
        phraseOpacity = percentage < 1 ? 0.2 + 0.8 * percentage : 1;
        phraseBlur = percentage < 1 ? 6 - 5 * percentage : 0.5;

        altText.textContent = phrases[index];
        altText.setAttribute('data-title', phrases[index]);
        altText.style.opacity = phraseOpacity;
        altText.style.filter = `blur(${phraseBlur}px)`;
    }

    if (percentage == 1) {
        if (altText) {
            altText.classList.remove('shaky-text');
            altText.classList.add('pulse-text');
            altText.style.color = "rgba(220, 20, 60, 0.8)";
        }
        if (scrollIndicator) {
            document.documentElement.style.setProperty('--scroll-color', "rgba(220, 20, 60, 0.8)");
            scrollText.style.opacity = '1';
            scrollText.textContent = "DREAM";
            scrollText.setAttribute('data-title', "DREAM");
        }
        complete = true;
    } else {
        handleScrollIndicator();
    }
}

// ------------ SCROLL INPUT HANDLING END -------------