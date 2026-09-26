/**
 * Pradip Ghutukade Portfolio - Interactive Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('header');
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    const navAnchors = document.querySelectorAll('.nav-links a');
    const heroVisual = document.getElementById('heroVisual');
    const modelWrapper = document.querySelector('.model-wrapper');

    // 1. Navbar Scroll Blur Effect
    const handleScroll = () => {
        if (window.scrollY > 30) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // 2. Mobile Navigation Toggle
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
            document.body.style.overflow = isActive ? 'hidden' : '';
        });

        // Close when clicking nav anchor
        navAnchors.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });

        // Close on clicking outside
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
    }

    // 3. Active Nav Anchor on Scroll
    const sections = document.querySelectorAll('section[id]');
    const updateActiveNav = () => {
        const scrollY = window.pageYOffset;
        const windowHeight = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight;
        const isBottom = (scrollY + windowHeight) >= (docHeight - 60);

        if (isBottom) {
            navAnchors.forEach(link => link.classList.remove('active'));
            const contactLink = document.querySelector('.nav-links a[href*="contact"]');
            if (contactLink) contactLink.classList.add('active');
            return;
        }

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 120;
            const sectionId = section.getAttribute('id');
            const targetLink = document.querySelector(`.nav-links a[href*="${sectionId}"]`);
            
            if (targetLink) {
                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    targetLink.classList.add('active');
                } else {
                    targetLink.classList.remove('active');
                }
            }
        });
    };
    window.addEventListener('scroll', updateActiveNav, { passive: true });

    // 4. Subtle 3D Model Parallax (Desktop Only)
    if (window.matchMedia('(pointer: fine)').matches && heroVisual && modelWrapper) {
        let mouseX = 0, mouseY = 0;
        let targetX = 0, targetY = 0;
        let isHovering = false;

        heroVisual.addEventListener('mouseenter', () => {
            isHovering = true;
        });

        heroVisual.addEventListener('mousemove', (e) => {
            const rect = heroVisual.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            targetX = x * 8; // subtle degrees
            targetY = -y * 8;
        });

        heroVisual.addEventListener('mouseleave', () => {
            isHovering = false;
            targetX = 0;
            targetY = 0;
        });

        const animateParallax = () => {
            mouseX += (targetX - mouseX) * 0.08;
            mouseY += (targetY - mouseY) * 0.08;
            
            if (Math.abs(mouseX) > 0.01 || Math.abs(mouseY) > 0.01 || isHovering) {
                modelWrapper.style.transform = `perspective(1000px) rotateY(${mouseX.toFixed(2)}deg) rotateX(${mouseY.toFixed(2)}deg) translateY(-${Math.abs(mouseX * 0.5).toFixed(2)}px)`;
            } else {
                modelWrapper.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0)';
            }
            requestAnimationFrame(animateParallax);
        };
        requestAnimationFrame(animateParallax);
    }
});
