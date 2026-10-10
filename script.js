document.addEventListener("DOMContentLoaded", () => {
    // ===== Navbar scroll shadow =====
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.style.boxShadow = window.scrollY > 30
            ? '0 4px 16px rgba(0,0,0,0.4)'
            : 'none';
    });

    // ===== Carousel drag scroll & Auto-play =====
    const carousel = document.getElementById('carousel');
    if (carousel) {
        let isDown = false, startX, scrollL;
        let autoPlayInterval;
        const slides = carousel.querySelectorAll('.carousel-slide');
        const dotsWrap = document.getElementById('carouselDots');

        const track = carousel.querySelector('.carousel-track');
        const originalSlides = Array.from(slides);
        
        // Clone slides 3 times to simulate infinite loop (4 sets total)
        for(let i=0; i<3; i++) {
            originalSlides.forEach(s => {
                track.appendChild(s.cloneNode(true));
            });
        }
        
        const allSlides = carousel.querySelectorAll('.carousel-slide');

        const startAutoPlay = () => {
            stopAutoPlay();
            autoPlayInterval = setInterval(() => {
                const maxScroll = carousel.scrollWidth - carousel.clientWidth;
                const gap = window.innerWidth <= 600 ? 24 : 24;
                const slideWidth = allSlides[0].offsetWidth + gap;
                let nextScroll = carousel.scrollLeft + slideWidth;
                
                // If we reach near the end, jump back to middle silently
                if (nextScroll > maxScroll - slideWidth) {
                    carousel.style.scrollBehavior = 'auto';
                    carousel.scrollLeft = nextScroll - (5 * slideWidth);
                    carousel.style.scrollBehavior = 'smooth';
                    nextScroll = carousel.scrollLeft + slideWidth;
                }
                
                carousel.scrollTo({ left: nextScroll, behavior: 'smooth' });
            }, 4000);
        };

        const stopAutoPlay = () => {
            if (autoPlayInterval) clearInterval(autoPlayInterval);
        };

        const handleInteractionStart = () => stopAutoPlay();
        const handleInteractionEnd = () => startAutoPlay();

        carousel.addEventListener('touchstart', handleInteractionStart, {passive: true});
        carousel.addEventListener('touchend', handleInteractionEnd);
        carousel.addEventListener('mouseenter', handleInteractionStart);
        carousel.addEventListener('mouseleave', handleInteractionEnd);

        // Make clicking any slide center it
        allSlides.forEach(slide => {
            slide.style.cursor = 'pointer';
            slide.addEventListener('click', () => {
                stopAutoPlay();
                slide.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                startAutoPlay();
            });
        });

        // Dots (only 5 dots)
        originalSlides.forEach((_, i) => {
            const d = document.createElement('span');
            d.classList.add('dot');
            d.addEventListener('click', () => {
                stopAutoPlay();
                // Scroll to the copy of this slide in the second set (index 5 to 9)
                allSlides[i + 5].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                startAutoPlay();
            });
            dotsWrap.appendChild(d);
        });

        const dots = dotsWrap.querySelectorAll('.dot');
        carousel.addEventListener('scroll', () => {
            // Find active slide by center position
            const carouselCenter = carousel.scrollLeft + carousel.clientWidth / 2;
            let minDiff = Infinity;
            let activeIdx = 0;
            
            allSlides.forEach((s, i) => {
                const sCenter = s.offsetLeft + s.offsetWidth / 2;
                const diff = Math.abs(sCenter - carouselCenter);
                if (diff < minDiff) {
                    minDiff = diff;
                    activeIdx = i;
                }
            });
            
            const originalIdx = activeIdx % 5;
            dots.forEach((d, i) => d.classList.toggle('active', i === originalIdx));
            
            // Infinite scroll check (if user scrolls too far left or right manually)
            const gap = 24;
            const slideWidth = allSlides[0].offsetWidth + gap;
            if (carousel.scrollLeft <= 0) {
                carousel.scrollLeft += 5 * slideWidth;
            } else if (carousel.scrollLeft >= carousel.scrollWidth - carousel.clientWidth) {
                carousel.scrollLeft -= 5 * slideWidth;
            }
        });

        // Initialize: center slide 3 of the second set (index 7)
        setTimeout(() => {
            allSlides[7].scrollIntoView({ behavior: 'auto', inline: 'center', block: 'nearest' });
            startAutoPlay();
        }, 100);
    }

    // ===== Scroll reveal =====
    const revealEls = document.querySelectorAll(
        '.hero-inner, .selected-section, .work-block, .skill-phone, .about-inner'
    );

    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.style.opacity = '1';
                e.target.style.transform = 'translateY(0)';
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.12 });

    revealEls.forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(28px)';
        el.style.transition = `opacity 0.7s ease ${i * 0.05}s, transform 0.7s ease ${i * 0.05}s`;
        obs.observe(el);
    });

    // ===== Modal Logic =====
    const letsTalkBtn = document.getElementById('letsTalkBtn');
    const contactModal = document.getElementById('contactModal');
    const closeModal = document.getElementById('closeModal');

    if (letsTalkBtn && contactModal) {
        letsTalkBtn.addEventListener('click', (e) => {
            e.preventDefault();
            contactModal.classList.add('active');
        });
        closeModal.addEventListener('click', () => {
            contactModal.classList.remove('active');
        });
        contactModal.addEventListener('click', (e) => {
            if (e.target === contactModal) {
                contactModal.classList.remove('active');
            }
        });
    }
});
