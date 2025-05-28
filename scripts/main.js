document.addEventListener('DOMContentLoaded', () => {
    const heroSection = document.querySelector('.hero');
    const heroImg = heroSection.querySelector('.hero-bg-img');
    const heroNameSpans = heroSection.querySelectorAll('.first-name, .last-name');
    const aboutSection = document.querySelector('#about');
    const header = document.querySelector('header');
    const fogWrapper = document.querySelector('.fogwrapper');

    setTimeout(() => {
        heroImg.classList.add('fade-in');
        heroNameSpans.forEach(span => span.classList.add('fade-in'));
        heroSection.classList.add('vignette-in');
        if (fogWrapper) fogWrapper.classList.add('fade-in');
    }, 100);

    function toggleHeaderAndScrollbar() {
        if (window.scrollY <= 0) {
            header.classList.add('header-hidden');
            document.documentElement.classList.add('hide-scrollbar');
        } else {
            header.classList.remove('header-hidden');
            document.documentElement.classList.remove('hide-scrollbar');
        }
    }
    toggleHeaderAndScrollbar();

    window.addEventListener('scroll', () => {
        toggleHeaderAndScrollbar();

        // if (window.scrollY > heroSection.offsetHeight) {
        //     aboutSection.scrollIntoView({ behavior: 'smooth' });
        // }

        if (window.scrollY > 10) {
            heroSection.classList.add('shrink');
            header.classList.add('header-visible');
        } else {
            heroSection.classList.remove('shrink');
            header.classList.remove('header-visible');
        }
    });

    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            targetSection.scrollIntoView({ behavior: 'smooth' });
        });
    });

    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Form submitted!');
        });
    }
});