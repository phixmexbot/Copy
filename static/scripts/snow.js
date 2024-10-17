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



function getLocationFromIP() {
  // Fetch user's location based on IP address
  fetch('https://ipapi.co/json/')
    .then(response => response.json())
    .then(data => {
      const lat = data.latitude;
      const lon = data.longitude;
      const city = data.city;
      const region = data.region;
      const country = data.country_name;

      console.log(`Approximate location: ${city}, ${region}, ${country}`);
      console.log(`Latitude: ${lat}, Longitude: ${lon}`);

      getWeather(lat, lon);
    })
    .catch(error => console.error('Error fetching location from IP:', error));
}

function getWeather(lat, lon) {
  const apiKey = '960a7824230191f4a129fa07e1769fe7'; 
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

  fetch(weatherUrl)
    .then(response => response.json())
    .then(data => {
      const weatherConditions = data.weather.map(condition => condition.main.toLowerCase());
      console.log("Weather conditions: ", weatherConditions);

      const hashTags = [];

      if (weatherConditions.includes('rain')) {
        hashTags.push('#rain');
      }
      if (weatherConditions.includes('snow')) {
        hashTags.push('#snow');
      }
      if (weatherConditions.includes('thunderstorm')) {
        hashTags.push('#light');
      }

      if (hashTags.length > 0) {
        cycleThroughHashes(hashTags);
      }
    })
    .catch(error => console.error("Error fetching weather data: ", error));
}

function cycleThroughHashes(hashTags) {
  let index = 0;

  function changeHash() {
    if (index < hashTags.length) {
      window.location.hash = hashTags[index]; 
      index++;
      setTimeout(changeHash, 1000); 
    }
  }

  changeHash();
}

getLocationFromIP();
