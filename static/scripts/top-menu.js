class CpcNavigation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      jsxData: [],
      submenu: [] };

  }

  componentDidMount() {
    this.setState({ jsxData: this.createMenuJSX() });
  }

  menuClickEvent(i) {
    let submenu = this.state.submenu;
    let tmpmenu = submenu[i];
    let sub = tmpmenu.sub.current;
    let caret = tmpmenu.caret.current;

    if (tmpmenu.active === false) {
      tmpmenu.active = true;

      TweenLite.to(caret, 1, {
        transform: 'rotate(180deg)',
        ease: Elastic.easeOut.config(1, 0.3) });


      TweenLite.to(sub, 1, {
        height: sub.scrollHeight,
        visibility: 'visible',
        ease: Elastic.easeOut.config(1, 0.3) });

    } else {
      tmpmenu.active = false;

      TweenLite.to(caret, 1, {
        transform: 'rotate(0deg)',
        ease: Elastic.easeOut.config(1, 0.3) });


      TweenLite.to(sub, 0.5, {
        height: 0,
        ease: Bounce.easeOut }).
      eventCallback('onComplete', () => {
        TweenLite.to(sub, 0, {
          visibility: 'hidden' });

      });
    }

    submenu[i] = tmpmenu;

    this.setState({ submenu: submenu });
  }

  createMenuJSX(menu = this.props.menu) {
    let link = [];

    for (let i in menu) {
      let m = menu[i];
      let ic = /*#__PURE__*/React.createElement("i", { className: "cpc-icon cpc-hidden fas fa-caret-down" });

      if (typeof m.icon !== 'undefined') {
        ic = /*#__PURE__*/React.createElement("i", { className: 'cpc-icon ' + m.icon });
      }

      if (typeof m.menu === 'undefined') {
        link.push( /*#__PURE__*/
        React.createElement("li", null, /*#__PURE__*/
        React.createElement("a", { href: m.link },
        ic, /*#__PURE__*/
        React.createElement("span", null, i), /*#__PURE__*/
        React.createElement("i", { className: "cpc-caret cpc-hidden fas fa-caret-down" }))));



      } else if (typeof m.menu === 'object') {
        let tmpSubmenu = this.state.submenu;
        let tmpLength = tmpSubmenu.length;

        tmpSubmenu.push({
          'id': m.link,
          'active': false,
          'caret': React.createRef(),
          'sub': React.createRef() });


        link.push( /*#__PURE__*/
        React.createElement("li", null, /*#__PURE__*/
        React.createElement("a", {
          href: m.link,
          onClick: this.menuClickEvent.bind(this, tmpLength) },

        ic, /*#__PURE__*/
        React.createElement("span", null, i), /*#__PURE__*/
        React.createElement("i", {
          className: "cpc-caret fas fa-caret-down",
          ref: tmpSubmenu[tmpLength].caret })), /*#__PURE__*/


        React.createElement("ul", { className: "cpc-sub", ref: tmpSubmenu[tmpLength].sub },
        this.createMenuJSX(m.menu))));




        this.setState({ submenu: tmpSubmenu });
      }
    }

    return link;
  }

  render() {
    return /*#__PURE__*/(
      React.createElement("nav", { className: "cpc-menu" }, /*#__PURE__*/
      React.createElement("ul", { className: "cpc-main" },
      this.state.jsxData)));



  }}


// Navigation menu builder
    const menu = {
      'Home': {
        'link': '/',
        'icon': 'fas fa-home'
      },
      'Effects': {
        'link': '#',
        'icon': 'fa-solid fa-gamepad',
        'menu': {
          'Lightening': {
            'link': '#light',
            'icon': 'fa-solid fa-bolt'
          },
          'Rain': {
            'link': '#rain',
            'icon': 'fa-solid fa-cloud-rain'
          },
        }
      },
      'Services': {
        'link': '#',
        'icon': 'fas fa-cogs',
        'menu': {
          'Chat Bot': {
            'link': '/services/chat-bot',
            'icon': 'fa-solid fa-robot'
          },
          'Home Tab': {
            'link': '/services/home-tab',
            'icon': 'fa-brands fa-searchengin'
          }
        }
      },
      'Projects': {
        'link': '#',
        'icon': 'fa-solid fa-lightbulb',
        'menu': {
          'Automatic Attendance': {
            'link': '/projects/automatic-attendance',
            'icon': 'fa-solid fa-video'
          },
          'AI Navigator': {
            'link': '/projects/ai-navigator',
            'icon': 'fa-solid fa-location-dot'
          }
        }
      },
      'About': {
        'link': '/about',
        'icon': 'fas fa-info-circle'
      },
      'Feedback': {
        'link': '/feedback',
        'icon': 'fa-solid fa-comment-dots'
      }
    };



ReactDOM.render(
React.createElement(CpcNavigation, { menu: menu }),
document.querySelector('#app'));


var c = document.getElementById("canvas-club");
var ctx = c.getContext("2d");
var w = c.width = window.innerWidth;
var h = c.height = window.innerHeight;
var clearColor = 'rgba(0, 0, 0, 0)'; // Transparent background
var max = 1000;
var drops = [];

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function O() {}

O.prototype = {
    init: function() {
        this.x = random(0, w);
        this.y = 0;
        this.color = '#FFFFFF';
        this.w = 2;
        this.h = 1;
        this.vy = random(4, 5);
        this.vw = 3;
        this.vh = 1;
        this.size = 2;
        this.hit = random(h * 0.89, h);
        this.a = 1;
        this.va = .96;
    },
    draw: function() {
        if (this.y > this.hit) {
            ctx.beginPath();
            ctx.moveTo(this.x, this.y - this.h / 2);

            ctx.bezierCurveTo(
                this.x + this.w / 2, this.y - this.h / 2,
                this.x + this.w / 2, this.y + this.h / 2,
                this.x, this.y + this.h / 2
            );

            ctx.bezierCurveTo(
                this.x - this.w / 2, this.y + this.h / 2,
                this.x - this.w / 2, this.y - this.h / 2,
                this.x, this.y - this.h / 2
            );

            ctx.strokeStyle = 'rgba(255, 255, 255, ' + this.a + ')'; 
            ctx.stroke();
            ctx.closePath();

        } else {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.size, this.size * 3); // Adjust this multiplier
        }
        this.update();
    },
    update: function() {
        if(this.y < this.hit){
            this.y += this.vy;
        } else {
            if(this.a > .03){
                this.w += this.vw;
                this.h += this.vh;
                if(this.w > 100){
                    this.a *= this.va;
                    this.vw *= .98;
                    this.vh *= .98;
                }
            } else {
                this.init();
            }
        }
    }
}

function resize(){
    w = c.width = window.innerWidth;
    h = c.height = window.innerHeight;
}

function setup(){
    drops = []; // Reset the array to avoid duplication
    for(var i = 0; i < max; i++){
        (function(j){
            setTimeout(function(){
                var o = new O();
                o.init();
                drops.push(o);
            }, j * 200);
        }(i));
    }
}

function anim() {
    ctx.clearRect(0, 0, w, h); // Clears the canvas without filling it with a color
    for(var i in drops){
        drops[i].draw();
    }
    requestAnimationFrame(anim);
}

window.addEventListener("resize", resize);

function onHashChange() {
    if (location.hash === '#rain') {
        setup();
        anim();
    }
}

window.addEventListener("hashchange", onHashChange);
