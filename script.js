document.addEventListener('DOMContentLoaded', () => {


    /* =========================================
       Navigation & Mobile Menu
       ========================================= */
    const navbar = document.getElementById('navbar');
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    // Sticky Nav on Scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    mobileBtn.addEventListener('click', () => {
        mobileBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileBtn.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    /* =========================================
       Hero Carousel Logic
       ========================================= */
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    let currentSlide = 0;
    const slideCount = slides.length;
    let slideInterval;

    const goToSlide = (n) => {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');

        currentSlide = (n + slideCount) % slideCount;

        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    };

    const nextSlide = () => goToSlide(currentSlide + 1);
    const prevSlide = () => goToSlide(currentSlide - 1);

    // Initial Trigger for Hero Text animations
    setTimeout(() => {
        document.querySelectorAll('.hero-content .animate-up').forEach(el => {
            el.classList.add('visible');
        });
    }, 100);

    // Start Auto Play
    const startSlideShow = () => {
        slideInterval = setInterval(nextSlide, 4000);
    };

    const resetSlideShow = () => {
        clearInterval(slideInterval);
        startSlideShow();
    };

    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetSlideShow();
    });

    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetSlideShow();
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
            resetSlideShow();
        });
    });

    startSlideShow();

    /* =========================================
       Intersection Observer for Scroll Animations
       ========================================= */
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // If the target is the about section animated list, add visible to it
                if (entry.target.classList.contains('animated-list')) {
                    entry.target.classList.add('visible');
                }

                // Optional: Stop observing once revealed
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all reveal elements
    document.querySelectorAll('.reveal').forEach(el => {
        revealOnScroll.observe(el);
    });

    // Separately observe the unordered list for stagger effect
    const animatedList = document.querySelector('.animated-list');
    if (animatedList) {
        revealOnScroll.observe(animatedList);
    }

    /* =========================================
       Form Submission interaction (Ripple Effect)
       ========================================= */
    const form = document.getElementById('contactForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = form.querySelector('.submit-btn');
        btn.innerHTML = 'Message Sent! ✓';
        btn.style.backgroundColor = '#4bb543'; // Success color
        btn.style.color = '#fff';

        setTimeout(() => {
            form.reset();
            btn.innerHTML = '<span class="btn-text">Send Message</span><span class="ripple"></span>';
            btn.style.backgroundColor = '';
            btn.style.color = '';
        }, 3000);
    });

    /* =========================================
       Factory Video Controls
       ========================================= */
    const factoryCards = document.querySelectorAll('.factory-card');

    factoryCards.forEach(card => {
        const video = card.querySelector('.factory-video');
        const playPauseBtn = card.querySelector('.play-pause');
        const muteBtn = card.querySelector('.mute-toggle');
        const fullscreenBtn = card.querySelector('.fullscreen-btn');

        if (video && playPauseBtn) {
            playPauseBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (video.paused) {
                    video.play();
                    playPauseBtn.querySelector('.material-symbols-outlined').textContent = 'pause';
                } else {
                    video.pause();
                    playPauseBtn.querySelector('.material-symbols-outlined').textContent = 'play_arrow';
                }
            });
        }

        if (video && muteBtn) {
            muteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                video.muted = !video.muted;
                muteBtn.querySelector('.material-symbols-outlined').textContent =
                    video.muted ? 'volume_off' : 'volume_up';
            });
        }

        if (video && fullscreenBtn) {
            fullscreenBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (video.requestFullscreen) {
                    video.requestFullscreen();
                } else if (video.webkitRequestFullscreen) {
                    video.webkitRequestFullscreen();
                } else if (video.msRequestFullscreen) {
                    video.msRequestFullscreen();
                }
            });
        }
    });
});
