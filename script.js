/* ===========================================
   PARA EL AMOR DE MI VIDA — Script
   =========================================== */

// ====== 1. CANVAS DE PÉTALOS CAYENDO ======
(function petalsAnimation() {
  const canvas = document.getElementById('petals-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width  = canvas.width  = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width  = canvas.width  = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Colores realistas de pétalos de rosa
  const petalColors = [
    'rgba(196, 30, 58, 0.75)',
    'rgba(139, 10, 31, 0.7)',
    'rgba(255, 77, 109, 0.7)',
    'rgba(230, 57, 70, 0.75)',
    'rgba(255, 107, 122, 0.65)',
    'rgba(122, 13, 28, 0.8)',
  ];

  class Petal {
    constructor() { this.reset(); this.y = Math.random() * height; }

    reset() {
      this.x = Math.random() * width;
      this.y = -20;
      this.size = 10 + Math.random() * 14;
      this.speedY = 0.4 + Math.random() * 1.0;
      this.speedX = (Math.random() - 0.5) * 0.6;
      this.angle = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.03;
      this.color = petalColors[Math.floor(Math.random() * petalColors.length)];
      this.swayAmp = 0.5 + Math.random() * 1.5;
      this.swayPhase = Math.random() * Math.PI * 2;
    }

    update() {
      this.swayPhase += 0.02;
      this.x += this.speedX + Math.sin(this.swayPhase) * this.swayAmp * 0.3;
      this.y += this.speedY;
      this.angle += this.rotSpeed;
      if (this.y > height + 20 || this.x < -20 || this.x > width + 20) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.fillStyle = this.color;
      // Forma de pétalo (gota/lágrima)
      const s = this.size;
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.5);
      ctx.bezierCurveTo(s * 0.6, -s * 0.4, s * 0.6, s * 0.4, 0, s * 0.5);
      ctx.bezierCurveTo(-s * 0.6, s * 0.4, -s * 0.6, -s * 0.4, 0, -s * 0.5);
      ctx.fill();
      // Línea central sutil
      ctx.strokeStyle = 'rgba(0,0,0,0.1)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.4);
      ctx.lineTo(0, s * 0.4);
      ctx.stroke();
      ctx.restore();
    }
  }

  const petals = [];
  const count = window.innerWidth < 600 ? 20 : 35;
  for (let i = 0; i < count; i++) petals.push(new Petal());

  function animate() {
    ctx.clearRect(0, 0, width, height);
    petals.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
})();

// ====== 2. APARICIÓN DEL TEXTO AL CARGAR ======
(function revealText() {
  const paragraphs = document.querySelectorAll('[data-reveal]');
  paragraphs.forEach((p, i) => {
    setTimeout(() => p.classList.add('visible'), 1400 + i * 600);
  });
})();

// ====== 3. CLIC EN LA ROSA = EXPLOSIÓN DE CORAZONES ======
(function clickBurst() {
  const rose = document.querySelector('.rose');
  if (!rose) return;

  rose.addEventListener('click', (e) => {
    const rect = rose.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2.5;

    for (let i = 0; i < 14; i++) {
      const burst = document.createElement('div');
      burst.textContent = '❤';
      burst.style.cssText = `
        position: fixed;
        left: ${cx}px;
        top: ${cy}px;
        font-size: ${14 + Math.random() * 12}px;
        color: ${['#c41e3a', '#ff4d6d', '#ff6b9d', '#e63946', '#8b0a1f'][Math.floor(Math.random() * 5)]};
        pointer-events: none;
        z-index: 9999;
        text-shadow: 0 0 8px rgba(255, 100, 120, 0.6);
        transform: translate(-50%, -50%);
      `;
      document.body.appendChild(burst);

      const angle = (i / 14) * Math.PI * 2;
      const distance = 80 + Math.random() * 80;
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance;

      burst.animate([
        { transform: 'translate(-50%, -50%) scale(0)', opacity: 1 },
        { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(1.5)`, opacity: 0 }
      ], { duration: 1200, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' });

      setTimeout(() => burst.remove(), 1200);
    }
  });
})();
