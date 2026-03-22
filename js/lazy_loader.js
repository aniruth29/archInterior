/**
 * lazy_loader.js — Lazy loading for videos across Arch Interior pages.
 *
 * Strategy:
 *  - Images: Native `loading="lazy"` attribute is used in HTML (zero JS needed).
 *  - Videos: IntersectionObserver defers loading until the video scrolls into view.
 *    HTML videos have class="lazy-video" and <source data-src="..."> instead of src.
 *    When visible, data-src is moved to src, video.load() called, then video.play().
 */

(function () {
    'use strict';

    /* ── Video Lazy Loader ─────────────────────────────────── */
    function initLazyVideos() {
        const lazyVideos = document.querySelectorAll('video.lazy-video');
        if (!lazyVideos.length) return;

        // If IntersectionObserver isn't supported, load all videos immediately
        if (!('IntersectionObserver' in window)) {
            lazyVideos.forEach(loadVideo);
            return;
        }

        const videoObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    loadVideo(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '100px 0px',   // start loading 100px before entering viewport
            threshold: 0.01
        });

        lazyVideos.forEach(function (video) {
            videoObserver.observe(video);
        });
    }

    function loadVideo(video) {
        const sources = video.querySelectorAll('source[data-src]');
        if (!sources.length) return;

        sources.forEach(function (source) {
            source.src = source.dataset.src;
            source.removeAttribute('data-src');
        });

        video.load();

        // Autoplay muted videos (respects existing autoplay attribute)
        if (video.hasAttribute('autoplay')) {
            video.play().catch(function () {
                // Autoplay blocked by browser policy — silently ignore
            });
        }

        video.classList.remove('lazy-video');
        video.classList.add('lazy-video-loaded');
    }

    /* ── Init on DOM ready ─────────────────────────────────── */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLazyVideos);
    } else {
        initLazyVideos();
    }

})();
