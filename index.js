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

const center = {
  x: canvas.width / 2,
  y: canvas.height / 2,
};

const player = new Player(center.x, center.y, 30, "blue");

const projectiles = [];

function animation() {
  requestAnimationFrame(animation);
  c.clearRect(0, 0, canvas.width, canvas.height);

  projectiles.forEach((projectile) => projectile.update());
  player.draw();
}

addEventListener("click", ({ clientX, clientY }) => {
  const angle = Math.atan2(
    clientY - canvas.height / 2,
    clientX - canvas.width / 2
  );

  projectiles.push(
    new Projectile(center.x, center.y, 5, "red", {
      x: Math.cos(angle),
      y: Math.sin(angle),
    })
  );

  animation();
});

animation();
