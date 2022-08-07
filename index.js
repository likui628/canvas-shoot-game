console.log(gsap);
const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Player {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }
}

class Projectile {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }

  update() {
    this.draw();
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}

class Enemy {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }

  update() {
    this.draw();
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}

const center = {
  x: canvas.width / 2,
  y: canvas.height / 2,
};

const player = new Player(center.x, center.y, 10, "white");
const projectiles = [];
const enemies = [];
let animationFrameHandler;

function spawnEnemies() {
  setInterval(() => {
    const radius = Math.random() * (30 - 4) + 4;

    let x, y;
    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? canvas.width + radius : 0 - radius;
      y = Math.random() * canvas.height;
    } else {
      x = Math.random() * canvas.width;
      y = Math.random() < 0.5 ? canvas.height + radius : 0 - radius;
    }

    const color = `hsl(${Math.random() * 360}, 50%, 50%)`;

    const angle = Math.atan2(center.y - y, center.x - x);
    const velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle),
    };

    enemies.push(new Enemy(x, y, radius, color, velocity));
  }, 1000);
}

function projectileHit(enemy, enemyIndex) {
  projectiles.forEach((projectile, projectileIndex) => {
    const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);

    if (dist < enemy.radius + projectile.radius + 1) {
      if (enemy.radius > 20) {
        gsap.to(enemy, {
          radius: enemy.radius - 10,
        });
      } else {
        setTimeout(() => {
          enemies.splice(enemyIndex, 1);
        }, 0);
      }
      setTimeout(() => {
        projectiles.splice(projectileIndex, 1);
      }, 0);
    }
  });
}

function playerHit() {
  enemies.forEach((enemy) => {
    const dist = Math.hypot(center.x - enemy.x, center.y - enemy.y);
    if (dist < enemy.radius + player.radius + 1) {
      cancelAnimationFrame(animationFrameHandler);
    }
  });
}

function projectileOffScreen(projectile, projectileIndex) {
  const { x, y, radius } = projectile;
  if (
    x - radius < 0 ||
    x + radius > canvas.width ||
    y - radius < 0 ||
    y + radius > canvas.height
  ) {
    setTimeout(() => {
      projectiles.splice(projectileIndex, 1);
    }, 0);
  }
}

function animation() {
  animationFrameHandler = requestAnimationFrame(animation);

  c.fillStyle = "rgba(0, 0, 0, 0.1)";
  c.fillRect(0, 0, canvas.width, canvas.height);

  projectiles.forEach((projectile, index) => {
    projectile.update();
    projectileOffScreen(projectile, index);
  });
  player.draw();

  enemies.forEach((enemy, index) => {
    enemy.update();
    projectileHit(enemy, index);
    playerHit();
  });
}

function eventHandler() {
  addEventListener("click", ({ clientX, clientY }) => {
    const angle = Math.atan2(
      clientY - canvas.height / 2,
      clientX - canvas.width / 2
    );

    projectiles.push(
      new Projectile(center.x, center.y, 5, "white", {
        x: Math.cos(angle) * 6,
        y: Math.sin(angle) * 6,
      })
    );
  });
}

function start() {
  spawnEnemies();
  animation();
  eventHandler();
}

start();
