let OPT = {
  selector: "#sparks",
  amount: 200,
  speed: 0.1,
  lifetime: 800,
  direction: { x: -0.5, y: 1 },
  size: [2.5, 2.5],
  maxopacity: 1,
  color: "255, 255, 255",
  randColor: false,
  acceleration: [30, 50]
};

if (window.innerWidth < 520) {
  OPT.speed = 0.05;
}

let animationActive = false;

function startSparkAnimation() {
  if (animationActive) return; // Prevent starting multiple instances
  animationActive = true;

  const canvas = document.querySelector(OPT.selector);
  const ctx = canvas.getContext("2d");
  let sparks = [];

  function setCanvasWidth() {
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', setCanvasWidth);
  setCanvasWidth();

  function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function init() {
    setCanvasWidth();

    setInterval(() => {
      if (sparks.length < OPT.amount) {
        addSpark();
      }
    }, 1000 / OPT.amount);

    requestAnimationFrame(draw);
  }

  function draw() {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    sparks.forEach((spark, i) => {
      if (spark.opacity <= 0) {
        sparks.splice(i, 1);
      } else {
        drawSpark(spark);
      }
    });

    requestAnimationFrame(draw);
  }

  function Spark(x, y) {
    this.x = x;
    this.y = y;
    this.age = 0;
    this.acceleration = rand(OPT.acceleration[0], OPT.acceleration[1]);
    this.color = OPT.randColor ? `${rand(0, 255)},${rand(0, 255)},${rand(0, 255)}` : OPT.color;
    this.opacity = OPT.maxopacity - this.age / (OPT.lifetime * rand(1, 10));

    this.go = function () {
      this.x += OPT.speed * OPT.direction.x * this.acceleration / 2;
      this.y += OPT.speed * OPT.direction.y * this.acceleration / 2;

      if (this.y > window.innerHeight * 0.80) {
        let fadeRange = window.innerHeight * 0.20;
        let distanceFromBottom = this.y - window.innerHeight * 0.80;
        this.opacity = Math.max(0, OPT.maxopacity * (1 - distanceFromBottom / fadeRange));
      } else {
        this.opacity = OPT.maxopacity - ++this.age / OPT.lifetime;
      }
    };
  }

  function addSpark() {
    let x = rand(-200, window.innerWidth + 200);
    let y = rand(-200, window.innerHeight + 200);
    sparks.push(new Spark(x, y));
  }

  function drawSpark(spark) {
    spark.go();
    ctx.beginPath();
    ctx.fillStyle = `rgba(${spark.color}, ${spark.opacity})`;
    ctx.arc(spark.x, spark.y, OPT.size[0], 0, Math.PI * 2);
    ctx.fill();
  }

  init();
}

// Monitor hash changes
window.addEventListener('hashchange', () => {
  console.log("Hash changed to:", location.hash);
  if (location.hash === '#snow') {
    startSparkAnimation();
  } else {
    animationActive = false; // Reset if hash changes to something else
  }
});
