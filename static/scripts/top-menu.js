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
          'Lightening Flash': {
            'link': '#light',
            'icon': 'fa-solid fa-bolt'
          },
          'Orbit Around': {
            'link': '/activities/orbit-around',
            'icon': 'fa-solid fa-circle-dot'
          },
          'Doodle Rain': {
            'link': '/activities/doodle-rain',
            'icon': 'fa-solid fa-cloud-rain'
          },
          'Angry Birds': {
            'link': '/activities/angry-birds',
            'icon': 'fa-solid fa-dove'
          },
        }
      },
      'Services': {
        'link': '#services',
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
        'link': '#projects',
        'icon': 'fa-solid fa-lightbulb',
        'menu': {
          'Automatic Attendance': {
            'link': '/projects/automatic-attendance',
            'icon': 'fa-solid fa-video'
          }
        }
      },
      'About': {
        'link': '/about',
        'icon': 'fas fa-info-circle'
      }
    };



ReactDOM.render(
React.createElement(CpcNavigation, { menu: menu }),
document.querySelector('#app'));
