  var canvasLightning = function(c, cw, ch) {
    var _this = this;
    this.c = c;
    this.ctx = c.getContext('2d');
    this.cw = cw;
    this.ch = ch;
    this.lightning = [];
    this.lightTimeCurrent = 0;
    this.lightTimeTotal = 50;
    this.loopActive = true; // Variable to control the loop

    this.init = function() {
      this.loopActive = true;
      this.loop();
    };

    this.rand = function(rMi, rMa) {
      return ~~((Math.random() * (rMa - rMi + 1)) + rMi);
    };

    this.createL = function(x, y, canSpawn) {
      this.lightning.push({
        x: x,
        y: y,
        xRange: this.rand(5, 30),
        yRange: this.rand(5, 25),
        path: [{
          x: x,
          y: y
        }],
        pathLimit: this.rand(10, 35),
        canSpawn: canSpawn,
        hasFired: false
      });
    };

    this.updateL = function() {
      var i = this.lightning.length;
      while (i--) {
        var light = this.lightning[i];
        light.path.push({
          x: light.path[light.path.length - 1].x + (this.rand(0, light.xRange) - (light.xRange / 2)),
          y: light.path[light.path.length - 1].y + (this.rand(0, light.yRange))
        });

        if (light.path.length > light.pathLimit) {
          this.lightning.splice(i, 1);
        }
        light.hasFired = true;
      }
    };

    this.renderL = function() {
      var i = this.lightning.length;
      while (i--) {
        var light = this.lightning[i];
        this.ctx.strokeStyle = 'hsla(0, 100%, 100%, ' + this.rand(10, 100) / 100 + ')';
        this.ctx.lineWidth = 1;
        if (this.rand(0, 30) == 0) {
          this.ctx.lineWidth = 2;
        }
        if (this.rand(0, 60) == 0) {
          this.ctx.lineWidth = 3;
        }
        if (this.rand(0, 90) == 0) {
          this.ctx.lineWidth = 4;
        }
        if (this.rand(0, 120) == 0) {
          this.ctx.lineWidth = 5;
        }
        if (this.rand(0, 150) == 0) {
          this.ctx.lineWidth = 6;
        }

        this.ctx.beginPath();

        var pathCount = light.path.length;
        this.ctx.moveTo(light.x, light.y);
        for (var pc = 0; pc < pathCount; pc++) {
          this.ctx.lineTo(light.path[pc].x, light.path[pc].y);

          if (light.canSpawn) {
            if (this.rand(0, 100) == 0) {
              light.canSpawn = false;
              this.createL(light.path[pc].x, light.path[pc].y, false);
            }
          }
        }

        if (!light.hasFired) {
          this.ctx.fillStyle = 'rgba(255, 255, 255, ' + this.rand(4, 12) / 100 + ')';
          this.ctx.fillRect(0, 0, this.cw, this.ch);
        }

        if (this.rand(0, 30) == 0) {
          this.ctx.fillStyle = 'rgba(255, 255, 255, ' + this.rand(1, 3) / 100 + ')';
          this.ctx.fillRect(0, 0, this.cw, this.ch);
        }

        this.ctx.stroke();
      }
    };

    this.lightningTimer = function() {
      this.lightTimeCurrent++;
      if (this.lightTimeCurrent >= this.lightTimeTotal) {
        var newX = this.rand(100, cw - 100);
        var newY = this.rand(0, ch / 2);
        var createCount = this.rand(1, 3);
        while (createCount--) {
          this.createL(newX, newY, true);
        }
        this.lightTimeCurrent = 0;
        this.lightTimeTotal = this.rand(30, 100);
      }
    };

    this.clearCanvas = function() {
      this.ctx.globalCompositeOperation = 'destination-out';
      this.ctx.fillStyle = 'rgba(0,0,0,' + this.rand(1, 30) / 100 + ')';
      this.ctx.fillRect(0, 0, this.cw, this.ch);
      this.ctx.globalCompositeOperation = 'source-over';
    };

    this.stop = function() {
      this.loopActive = false; // Stop the loop
      this.ctx.clearRect(0, 0, this.cw, this.ch); // Clear the canvas
    };

    window.addEventListener('resize', function() {
      _this.cw = _this.c.width = window.innerWidth;
      _this.ch = _this.c.height = window.innerHeight;
    });

    this.loop = function() {
      var loopIt = function() {
        if (!_this.loopActive) return; // Exit the loop if not active
        requestAnimationFrame(loopIt, _this.c);
        _this.clearCanvas();
        _this.updateL();
        _this.lightningTimer();
        _this.renderL();
      };
      loopIt();
    };

  };

  var isCanvasSupported = function() {
    var elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
  };

  var cl; // Declare cl in the global scope

  function startLightning() {
    if (isCanvasSupported() && window.location.hash === '#light') {
      var c = document.getElementById('canvas');
      var cw = c.width = window.innerWidth;
      var ch = c.height = window.innerHeight;
      cl = new canvasLightning(c, cw, ch); // Assign to global variable
      cl.init();
    }
  }

  function stopLightning() {
    if (cl) {
      cl.stop(); // Stop the lightning effect and clear the canvas
    }
  }

  window.addEventListener('DOMContentLoaded', function() {
    startLightning(); // Start lightning on page load if hash is #light
  });

  window.addEventListener('hashchange', function() {
    if (window.location.hash === '#light') {
      startLightning(); // Start lightning if hash changes to #light
    } else if (window.location.hash === '#activities') {
      stopLightning(); // Stop lightning if hash changes to #activities
    }
  });
