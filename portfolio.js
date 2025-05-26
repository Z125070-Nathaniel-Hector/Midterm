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

/* // SCROLL INDICATOR VISIBILITY LOGIC
const scrollIndicator = document.getElementById('scroll-indicator');
let scrollTimeout;

// Start hidden
if (scrollIndicator) {
    scrollIndicator.style.opacity = '0.1';

    function showScrollIndicator() {
        scrollIndicator.style.opacity = '1';
    }
    function hideScrollIndicator() {
        scrollIndicator.style.opacity = '0';
    }

    window.addEventListener('scroll', () => {
        hideScrollIndicator();
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(showScrollIndicator, 1000);
    });

    // Show after 1s if not scrolled on load
    window.addEventListener('DOMContentLoaded', () => {
        setTimeout(showScrollIndicator, 1000);
    });
}
*/
