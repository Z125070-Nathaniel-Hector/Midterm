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
// Cache DOM elements
const elements = {
    scrollIndicator: document.getElementById('scroll-indicator'),
    altText: document.getElementById('alternate-text'),
    scrollText: document.getElementById('scroll-text'),
    redGradient: document.getElementById('red-gradient'),
    redTransition: document.getElementById('red-transition')
};

const config = {
    scrollInputPerSecond: 45,
    scrollInputMax: 50,
    scrollInputDream: 30,
    maxPulseScale: 2,
    fadeStartPercent: 0.5,
    phrases: [
        "something.", "anything.", "the world.", "the sky.", "the moment.", 
        "the feeling.", "your breath.", "your heartbeat.", "your need.",
        "your truth.", "your reality.", "your dreams."
    ]
};

// State management
const state = {
    scrollInputCount: 0,
    lastFrameTime: 0,
    percentage: 0,
    scale: 1,
    index: 0,
    complete: false,
    postDreamScrollCount: 0,
    redFadedIn: false,
    isIndicatorVisible: false,
    pendingScrollInput: false,
    indicatorTimeoutId: null
};

// Consolidated scroll input handler with requestAnimationFrame
function processScrollInput(timestamp) {
    if (!state.pendingScrollInput) return;
    state.pendingScrollInput = false;
    
    // Limit to desired frame rate
    if (timestamp - state.lastFrameTime < (1000 / config.scrollInputPerSecond)) {
        requestAnimationFrame(processScrollInput);
        return;
    }
    
    state.lastFrameTime = timestamp;
    state.scrollInputCount++;
    
    // Calculate progress
    state.percentage = Math.min(state.scrollInputCount / config.scrollInputMax, 1);
    state.scale = 1 + (config.maxPulseScale - 1) * state.percentage;
    
    // Schedule DOM updates
    requestAnimationFrame(updateUI);
}

// Handle all input types
function handleScrollInput() {
    if (!state.pendingScrollInput) {
        state.pendingScrollInput = true;
        requestAnimationFrame(processScrollInput);
    }
    
    // Handle indicator visibility
    if (elements.scrollIndicator && !state.isIndicatorVisible) {
        updateScrollIndicator(false);
        clearTimeout(state.indicatorTimeoutId);
        state.indicatorTimeoutId = setTimeout(() => updateScrollIndicator(true), 250);
    }
}

// Update the UI based on the current state
function updateUI() {
    // Update pulse scale
    document.documentElement.style.setProperty('--pulse-scale', state.scale);
    
    if (state.complete) {
        handleCompletedState();
        return;
    }
    
    if (elements.altText && config.phrases.length > 0) {
        // Calculate which phrase to show
        state.index = Math.min(Math.floor(state.percentage * (config.phrases.length - 1)), config.phrases.length - 1);
        
        // Update text and styling
        const phraseOpacity = state.percentage < 1 ? 0.2 + 0.8 * state.percentage : 1;
        const phraseBlur = state.percentage < 1 ? 6 - 5 * state.percentage : 0.5;
        
        elements.altText.textContent = config.phrases[state.index];
        elements.altText.setAttribute('data-title', config.phrases[state.index]);
        elements.altText.style.opacity = phraseOpacity;
        elements.altText.style.filter = `blur(${phraseBlur}px)`;
    }
    
    // Check if we've reached completion
    if (state.percentage >= 1 && !state.complete) {
        completeInitialPhase();
    }
}

function updateScrollIndicator(show) {
    if (!elements.scrollIndicator) return;
    
    elements.scrollIndicator.style.opacity = show ? '1' : '0';
    state.isIndicatorVisible = show;
}

function completeInitialPhase() {
    state.complete = true;
    
    if (elements.altText) {
        elements.altText.classList.remove('shaky-text');
        elements.altText.classList.add('pulse-text');
        elements.altText.style.color = "rgba(220, 20, 60, 0.8)";
    }
    
    if (elements.scrollIndicator) {
        document.documentElement.style.setProperty('--scroll-color', "rgba(220, 20, 60, 0.8)");
        elements.scrollText.style.opacity = '1';
        elements.scrollText.textContent = "DREAM";
        elements.scrollText.setAttribute('data-title', "DREAM");
    }
}

function handleCompletedState() {
    state.postDreamScrollCount++;
    let fadePercentage = 0;
    let gradFadePercentage = 0;
    
    if (state.postDreamScrollCount > config.scrollInputDream * config.fadeStartPercent) {
        fadePercentage = Math.min(
            (state.postDreamScrollCount - config.scrollInputDream * config.fadeStartPercent) / (config.scrollInputDream * config.fadeStartPercent),
            1
        );
    }
    
    gradFadePercentage = Math.min(state.postDreamScrollCount / config.scrollInputDream, 1);
    
    elements.redTransition.style.opacity = fadePercentage;
    elements.redGradient.style.opacity = gradFadePercentage;
    elements.redGradient.style.height = `${gradFadePercentage * 100}%`;
    
    if (fadePercentage === 1 && !state.redFadedIn) {
        state.redFadedIn = true;
        setTimeout(() => {
            window.location.href = "./pages/main.html";
        }, 2000);
    }
}

// Event listeners with passive option for better performance
window.addEventListener('wheel', (e) => {
    if (e.deltaY > 0) handleScrollInput();
}, { passive: true });

// Touch event handling
let lastTouchY = null;
window.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches.length > 0) {
        lastTouchY = e.touches[0].clientY;
    }
}, { passive: true });

window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches.length > 0 && lastTouchY !== null) {
        const currentY = e.touches[0].clientY;
        if (currentY < lastTouchY) handleScrollInput();
        lastTouchY = currentY;
    }
}, { passive: true });

// Initialize scroll indicator
updateScrollIndicator(false);
setTimeout(() => updateScrollIndicator(true), 250);

// ------------ SCROLL INPUT HANDLING END -------------