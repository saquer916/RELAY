// ==============================
// Particle Background System
// ==============================

const canvasContainer = document.getElementById("particle-canvas");

if (!canvasContainer) {
  throw new Error("particle-canvas div not found");
}

// Create canvas
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
canvasContainer.appendChild(canvas);

// Resize handling
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// ==============================
// Configuration
// ==============================

const CONFIG = {
  particleCount: 120,
  particleColor: "#999",
  lineColor: "#999",
  maxDistance: 120,
  speed: 0.6,
};

// ==============================
// Particle Class
// ==============================

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * CONFIG.speed;
    this.vy = (Math.random() - 0.5) * CONFIG.speed;
    this.radius = 1.5;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = CONFIG.particleColor;
    ctx.fill();
  }
}

// ==============================
// Initialization
// ==============================

const particles = [];
for (let i = 0; i < CONFIG.particleCount; i++) {
  particles.push(new Particle());
}

// Mouse interaction
const mouse = {
  x: null,
  y: null,
};

canvas.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

canvas.addEventListener("mouseleave", () => {
  mouse.x = null;
  mouse.y = null;
});

// ==============================
// Drawing Logic
// ==============================

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < CONFIG.maxDistance) {
        ctx.strokeStyle = CONFIG.lineColor;
        ctx.globalAlpha = 1 - distance / CONFIG.maxDistance;
        ctx.lineWidth = 0.7;

        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }

  ctx.globalAlpha = 1;
}

// ==============================
// Animation Loop
// ==============================

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((particle) => {
    particle.update();
    particle.draw();
  });

  drawConnections();
  requestAnimationFrame(animate);
}

animate();
