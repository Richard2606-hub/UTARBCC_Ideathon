document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    mobileToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        const icon = mobileToggle.querySelector('.material-symbols-outlined');
        if (mobileMenu.classList.contains('active')) {
            icon.textContent = 'close';
        } else {
            icon.textContent = 'menu';
        }
    });

    // Close mobile menu when a link is clicked
    const mobileLinks = document.querySelectorAll('.mobile-link');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            mobileToggle.querySelector('.material-symbols-outlined').textContent = 'menu';
        });
    });

    // 2. Navbar active state on scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobLinks = document.querySelectorAll('.mobile-link');

    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });

        mobLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // 3. GSAP Animations & ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Hero Section Animation
    const heroTl = gsap.timeline();
    heroTl.from(".badge", { y: 20, opacity: 0, duration: 0.6, ease: "power3.out" })
          .from(".hero-title", { y: 30, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.4")
          .from(".hero-desc", { y: 20, opacity: 0, duration: 0.6, ease: "power3.out" }, "-=0.6")
          .from(".hero-actions .btn", { y: 20, opacity: 0, duration: 0.6, stagger: 0.2, ease: "power3.out" }, "-=0.4")
          .from(".countdown-card", { x: 50, opacity: 0, duration: 0.8, ease: "power3.out", rotationY: 15 }, "-=0.8");

    // Parallax background orbs
    gsap.to(".orb-1", {
        y: "300px",
        x: "150px",
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: 1.5
        }
    });
    
    gsap.to(".orb-2", {
        y: "-300px",
        x: "-150px",
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: 1.5
        }
    });

    // Scroll Animations for Sections
    const sectionsToAnimate = [
        { selector: ".about-card", y: 50 },
        { selector: ".stats-grid .stat-card", y: 40, stagger: 0.1, scale: 0.9 },
        { selector: ".tracks-grid .track-card", y: 50, stagger: 0.15 },
        { selector: ".judging-criteria", y: 50 },
        { selector: ".podium-card", y: 80, stagger: 0.2, scale: 0.8 },
        { selector: ".special-awards .award-card", y: 40, stagger: 0.15 },
        { selector: ".judges-list .judge-card", x: 50, stagger: 0.2 },
        { selector: ".sponsor-tier", y: 30, stagger: 0.15 }
    ];

    sectionsToAnimate.forEach(anim => {
        const targets = gsap.utils.toArray(anim.selector);
        if (targets.length > 0) {
            gsap.from(targets, {
                scrollTrigger: {
                    trigger: targets[0], // Use first element as trigger to sync stagger
                    start: "top 85%",
                    once: true // Only animate once to avoid reverse layout jumps
                },
                y: anim.y || 0,
                x: anim.x || 0,
                scale: anim.scale || 1,
                opacity: 0,
                duration: 0.8,
                stagger: anim.stagger || 0,
                ease: "back.out(1.2)",
                clearProps: "all", // Clean up inline transforms after animation
                onStart: () => {
                    // Temporarily disable CSS transitions so they don't fight GSAP
                    targets.forEach(t => t.style.transition = 'none');
                },
                onComplete: () => {
                    // Restore CSS transitions for hover effects
                    targets.forEach(t => t.style.transition = '');
                }
            });
        }
    });

    // Normal CSS hover effects are now used instead of JS-based movement for buttons and cards.

    // 4. FAQ Accordion
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            
            // Close other open items
            const activeItem = document.querySelector('.accordion-item.active');
            if (activeItem && activeItem !== item) {
                activeItem.classList.remove('active');
            }

            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // 5. Countdown Timer (Target: June 21 - Registration Closes)
    const targetDate = new Date(`June 21, 2026 23:59:59`).getTime();

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minsEl = document.getElementById('minutes');
    const secsEl = document.getElementById('seconds');
    
    const daysMobEl = document.getElementById('days-mobile');
    const hoursMobEl = document.getElementById('hours-mobile');
    const minsMobEl = document.getElementById('minutes-mobile');
    const secsMobEl = document.getElementById('seconds-mobile');

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            // Already passed
            if(daysEl) daysEl.textContent = '00';
            if(hoursEl) hoursEl.textContent = '00';
            if(minsEl) minsEl.textContent = '00';
            if(secsEl) secsEl.textContent = '00';
            
            if(daysMobEl) daysMobEl.textContent = '00';
            if(hoursMobEl) hoursMobEl.textContent = '00';
            if(minsMobEl) minsMobEl.textContent = '00';
            if(secsMobEl) secsMobEl.textContent = '00';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        const dStr = days.toString().padStart(2, '0');
        const hStr = hours.toString().padStart(2, '0');
        const mStr = minutes.toString().padStart(2, '0');
        const sStr = seconds.toString().padStart(2, '0');

        if(daysEl) daysEl.textContent = dStr;
        if(hoursEl) hoursEl.textContent = hStr;
        if(minsEl) minsEl.textContent = mStr;
        if(secsEl) secsEl.textContent = sStr;
        
        if(daysMobEl) daysMobEl.textContent = dStr;
        if(hoursMobEl) hoursMobEl.textContent = hStr;
        if(minsMobEl) minsMobEl.textContent = mStr;
        if(secsMobEl) secsMobEl.textContent = sStr;
    }

    // Update initially and then every second
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // 6. Timeline Logic
    function updateTimeline() {
        const now = new Date().getTime();
        const timelineItems = document.querySelectorAll('.timeline-item');
        let latestReachedIndex = -1;

        // Find the latest reached index
        timelineItems.forEach((item, index) => {
            const itemDate = new Date(item.getAttribute('data-date')).getTime();
            if (now >= itemDate) {
                latestReachedIndex = index;
            }
        });

        // Apply classes
        timelineItems.forEach((item, index) => {
            const node = item.querySelector('.timeline-node');
            
            // Reset
            item.classList.remove('dull');
            if (node) node.classList.remove('pulse-node');

            if (index <= latestReachedIndex) {
                // Time reached: glow
                if (node) node.classList.add('pulse-node');
            } else {
                // Future events: dull
                item.classList.add('dull');
            }
        });
    }

    updateTimeline();
});
