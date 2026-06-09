// ============ PARTICLE CANVAS ============
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.color = ['#00f3ff', '#ff00ff', '#bd00ff', '#00ff41'][Math.floor(Math.random() * 4)];
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

const particles = [];
for (let i = 0; i < 50; i++) {
    particles.push(new Particle());
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    // Connect particles
    particles.forEach((a, i) => {
        particles.slice(i + 1).forEach(b => {
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                ctx.strokeStyle = a.color;
                ctx.globalAlpha = 0.2 * (1 - distance / 100);
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.stroke();
                ctx.globalAlpha = 1;
            }
        });
    });

    requestAnimationFrame(animateParticles);
}

animateParticles();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// ============ COUNTER ANIMATION ============
const counters = document.querySelectorAll('.stat-number');
counters.forEach(counter => {
    const target = parseInt(counter.dataset.target);
    let count = 0;
    const increment = target / 100;

    const updateCounter = () => {
        count += increment;
        if (count < target) {
            counter.textContent = Math.ceil(count);
            setTimeout(updateCounter, 20);
        } else {
            counter.textContent = target;
        }
    };

    setTimeout(updateCounter, 500);
});

// ============ FILTERS AND SEARCH ============
const filterButtons = document.querySelectorAll('.filter-btn');
const termCards = document.querySelectorAll('.term-card');
const searchInput = document.getElementById('searchInput');

// Обработка кликов по фильтрам
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Звуковой эффект (визуальный feedback)
        button.style.transform = 'scale(0.95)';
        setTimeout(() => button.style.transform = '', 100);

        // Удалить активный класс со всех кнопок
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Добавить активный класс к нажатой кнопке
        button.classList.add('active');

        const category = button.dataset.category;

        // Фильтрация карточек с анимацией
        termCards.forEach((card, index) => {
            if (category === 'all' || card.dataset.category === category) {
                card.classList.remove('hidden');
                card.style.animation = 'none';
                setTimeout(() => {
                    card.style.animation = `cardFloat 0.8s ease-out ${index * 0.05}s both`;
                }, 10);
            } else {
                card.classList.add('hidden');
            }
        });
    });
});

// Поиск терминов
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();

    termCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();

        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });

    // Если есть активный фильтр, применить его тоже
    const activeFilter = document.querySelector('.filter-btn.active');
    if (activeFilter && activeFilter.dataset.category !== 'all') {
        termCards.forEach(card => {
            if (!card.classList.contains('hidden')) {
                if (card.dataset.category !== activeFilter.dataset.category) {
                    card.classList.add('hidden');
                }
            }
        });
    }
});

// Анимация при скролле
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

termCards.forEach(card => {
    observer.observe(card);
});

// ============ MOUSE TRAIL EFFECT (DISABLED) ============
/*
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Create trail particle
    if (Math.random() > 0.9) {
        const trail = document.createElement('div');
        trail.className = 'mouse-trail';
        trail.style.left = mouseX + 'px';
        trail.style.top = mouseY + 'px';
        document.body.appendChild(trail);

        setTimeout(() => trail.remove(), 1000);
    }
});
*/

// ============ CARD 3D TILT EFFECT ============
termCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-15px) scale(1.03)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// ============ GLITCH TEXT EFFECT (DISABLED) ============
/*
const glitchText = document.querySelector('.glitch');
setInterval(() => {
    if (Math.random() > 0.95) {
        glitchText.style.textShadow = `
            ${Math.random() * 10 - 5}px ${Math.random() * 10 - 5}px 0 #ff00ff,
            ${Math.random() * 10 - 5}px ${Math.random() * 10 - 5}px 0 #00f3ff
        `;
        setTimeout(() => {
            glitchText.style.textShadow = '';
        }, 50);
    }
}, 100);
*/


// ============ MODAL WINDOW ============
const modal = document.getElementById('termModal');
const modalOverlay = modal.querySelector('.modal-overlay');
const modalClose = document.getElementById('modalClose');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const modalBadge = document.getElementById('modalBadge');

// Открыть модальное окно при клике на карточку
termCards.forEach(card => {
    card.addEventListener('click', () => {
        const title = card.querySelector('h3').textContent;
        const description = card.querySelector('p').textContent;
        const badge = card.querySelector('.badge').textContent;

        modalTitle.textContent = title;
        modalDescription.textContent = description;
        modalBadge.textContent = badge;

        // Добавляем эффект вспышки
        const flash = document.createElement('div');
        flash.style.position = 'fixed';
        flash.style.top = '0';
        flash.style.left = '0';
        flash.style.width = '100%';
        flash.style.height = '100%';
        flash.style.background = 'rgba(0, 243, 255, 0.3)';
        flash.style.zIndex = '9999';
        flash.style.pointerEvents = 'none';
        flash.style.animation = 'flashEffect 0.3s ease-out';
        document.body.appendChild(flash);

        setTimeout(() => flash.remove(), 300);

        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    });
});

// Закрыть модальное окно
function closeModal() {
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', closeModal);

// Закрыть по нажатию Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('show')) {
        closeModal();
    }
});
