document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initTypedText();
    initScrollProgress();
    initRevealAnimations();
    initSkillBars();
    initContactForm();
    initBackToTop();
    initSmoothNavClose();
    initHobbyFilter();
    initHobbyLightbox()
    initVlogPlayer(); 
});

/* ---- Navbar scroll effect & active links ---- */
function initNavbar() {
    const navbar = document.getElementById('mainNav');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);

        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

/* ---- Typing animation ---- */
function initTypedText() {
    const el = document.getElementById('typedText');
    if (!el) return;

    const phrases = [
        'Computer Science Student',
        'Aspiring Full Stack Developer',
        'AI Enthusiast',
        'Problem Solver'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const current = phrases[phraseIndex];

        if (isDeleting) {
            el.textContent = current.substring(0, charIndex - 1);
            charIndex--;
        } else {
            el.textContent = current.substring(0, charIndex + 1);
            charIndex++;
        }

        let speed = isDeleting ? 40 : 80;

        if (!isDeleting && charIndex === current.length) {
            speed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            speed = 500;
        }

        setTimeout(type, speed);
    }

    type();
}

/* ---- Scroll progress bar ---- */
function initScrollProgress() {
    const bar = document.getElementById('scrollProgress');
    if (!bar) return;

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        bar.style.width = `${progress}%`;
    });
}

/* ---- Scroll reveal animations ---- */
function initRevealAnimations() {
    const reveals = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * 80);
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    reveals.forEach(el => observer.observe(el));
}

/* ---- Animated skill bars ---- */
function initSkillBars() {
    const bars = document.querySelectorAll('.skill-fill');

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const width = entry.target.dataset.width;
                    entry.target.style.width = `${width}%`;
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );

    bars.forEach(bar => observer.observe(bar));
}



/* ---- Hobbies: category filter ---- */
function initHobbyFilter() {
    const buttons = document.querySelectorAll('.hobby-filter-btn');
    const cols = document.querySelectorAll('.hobby-col');
    if (!buttons.length) return;

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;
            cols.forEach(col => {
                const show = filter === 'all' || col.dataset.category === filter;
                col.classList.toggle('hobby-hidden', !show);
            });
        });
    });
}

/* ---- Hobbies: pop-up photo gallery (lightbox) ---- */
function initHobbyLightbox() {
    const lightbox = document.getElementById('hobbyLightbox');
    if (!lightbox) return;

    const imageEl = document.getElementById('lightboxImage');
    const titleEl = document.getElementById('lightboxTitle');
    const descEl = document.getElementById('lightboxDesc');
    const counterEl = document.getElementById('lightboxCounter');
    const closeBtn = document.getElementById('lightboxClose');
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');

    let currentImages = [];
    let currentIndex = 0;
    let currentTitle = '';
    let currentDesc = '';

    function renderSlide() {
        if (!currentImages.length) return;
        imageEl.src = currentImages[currentIndex];
        imageEl.alt = currentTitle;
        titleEl.textContent = currentTitle;
        descEl.textContent = currentDesc;
        counterEl.textContent = currentImages.length > 1
            ? `Photo ${currentIndex + 1} of ${currentImages.length}`
            : '';

        const multiple = currentImages.length > 1;
        prevBtn.classList.toggle('hidden', !multiple);
        nextBtn.classList.toggle('hidden', !multiple);
    }

    function openLightbox(card) {
        const title = card.dataset.title || '';
        const desc = card.dataset.desc || '';
        let images = [];

        try {
            images = JSON.parse(card.dataset.images || '[]');
        } catch (err) {
            images = [];
        }

        // fall back to the card's own cover image if data-images is empty/invalid
        if (!images.length) {
            const coverImg = card.querySelector('.hobby-media img');
            if (coverImg && coverImg.getAttribute('src')) {
                images = [coverImg.getAttribute('src')];
            }
        }

        if (!images.length) return; // nothing to show yet

        currentImages = images;
        currentIndex = 0;
        currentTitle = title;
        currentDesc = desc;

        renderSlide();
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function showNext() {
        if (!currentImages.length) return;
        currentIndex = (currentIndex + 1) % currentImages.length;
        renderSlide();
    }

    function showPrev() {
        if (!currentImages.length) return;
        currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
        renderSlide();
    }

    document.querySelectorAll('.hobby-card').forEach(card => {
        card.querySelector('.hobby-media').addEventListener('click', () => openLightbox(card));
    });

    closeBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', showNext);
    prevBtn.addEventListener('click', showPrev);

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
    });
}

/* ---- Hobbies vlog: custom play button over the native video ---- */
function initVlogPlayer() {
    const player = document.getElementById('vlogPlayer');
    if (!player) return;   // bail out quietly if this section isn't on the page

    const video = document.getElementById('vlogVideo');
    const playBtn = document.getElementById('vlogPlayBtn');

    // Clicking the big button plays the video and shows native controls
    playBtn.addEventListener('click', () => {
        video.setAttribute('controls', '');  // reveal the browser's
                                              // built-in scrubber/volume/etc.
                                              // only once playback starts
        video.play();
    });

    // Clicking the video while paused also starts it (same as clicking the button)
    video.addEventListener('click', () => {
        if (video.paused) {
            video.setAttribute('controls', '');
            video.play();
        }
    });

    // 'play' fires the instant playback begins -- hide our custom button
    video.addEventListener('play', () => {
        player.classList.add('is-playing');
    });

    // 'pause' fires if the user pauses OR when the video ends -- bring
    // the button back so they can clearly see how to resume/replay
    video.addEventListener('pause', () => {
        player.classList.remove('is-playing');
    });
}
 //Contact validation
function initContactForm() {
    const form = document.getElementById('contactForm');
    const feedback = document.getElementById('formFeedback');
    if (!form) return;

    let feedbackTimeout; // so we can cancel a stale timer on re-submit

    function showFeedback(text, type) {
        clearTimeout(feedbackTimeout);
        feedback.className = 'form-feedback';
        feedback.textContent = text;
        feedback.classList.add(type);
        feedbackTimeout = setTimeout(() => {
            feedback.textContent = '';
            feedback.className = 'form-feedback';
        }, 5000);
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !subject || !message) {
            showFeedback('Please fill in all fields.', 'error');
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            showFeedback('Please enter a valid email address.', 'error');
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;

        fetch('https://formspree.io/f/xojgyvoo', {
            method: 'POST',
            headers: { 'Accept': 'application/json' },
            body: new FormData(form)
        })
        .then(async (response) => {
            if (response.ok) {
                showFeedback('Thank you! Your message has been sent.', 'success');
                form.reset();
            } else {
                const data = await response.json().catch(() => null);
                console.error('Formspree responded with an error:', response.status, data);
                showFeedback('Something went wrong — please try again.', 'error');
            }
        })
        .catch((err) => {
            console.error('Network error reaching Formspree:', err);
            showFeedback('Network error — check your connection.', 'error');
        })
        .finally(() => {
            submitBtn.disabled = false;
        });
    });
}

/* ---- Back to top button ---- */
function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        btn.classList.toggle('show', window.scrollY > 400);
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ---- Close mobile nav on link click ---- */
function initSmoothNavClose() {
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const navbarCollapse = document.getElementById('navbar');

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse.classList.contains('show')) {
                const toggler = document.querySelector('.navbar-toggler');
                toggler.click();
            }
        });
    });
}
