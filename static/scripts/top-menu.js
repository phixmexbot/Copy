import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";

function delayedFunction() {
    
class CpcNavigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      jsxData: [],
      submenu: []
    };
  }
  componentDidMount() {
    this.setState({
      jsxData: this.createMenuJSX()
    });
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
        ease: Elastic.easeOut.config(1, 0.3)
      });
      TweenLite.to(sub, 1, {
        height: sub.scrollHeight,
        visibility: 'visible',
        ease: Elastic.easeOut.config(1, 0.3)
      });
    } else {
      tmpmenu.active = false;
      TweenLite.to(caret, 1, {
        transform: 'rotate(0deg)',
        ease: Elastic.easeOut.config(1, 0.3)
      });
      TweenLite.to(sub, 0.5, {
        height: 0,
        ease: Bounce.easeOut
      }).eventCallback('onComplete', () => {
        TweenLite.to(sub, 0, {
          visibility: 'hidden'
        });
      });
    }
    submenu[i] = tmpmenu;
    this.setState({
      submenu: submenu
    });
  }
  createMenuJSX(menu = this.props.menu) {
    let link = [];
    for (let i in menu) {
      let m = menu[i];
      let ic = /*#__PURE__*/_jsx("i", {
        className: "cpc-icon cpc-hidden fas fa-caret-down"
      });
      if (typeof m.icon !== 'undefined') {
        ic = /*#__PURE__*/_jsx("i", {
          className: 'cpc-icon ' + m.icon
        });
      }
      if (typeof m.menu === 'undefined') {
        link.push( /*#__PURE__*/_jsx("li", {
          children: /*#__PURE__*/_jsxs("a", {
            href: m.link,
            children: [ic, /*#__PURE__*/_jsx("span", {
              children: i
            }), /*#__PURE__*/_jsx("i", {
              className: "cpc-caret cpc-hidden fas fa-caret-down"
            })]
          })
        }));
      } else if (typeof m.menu === 'object') {
        let tmpSubmenu = this.state.submenu;
        let tmpLength = tmpSubmenu.length;
        tmpSubmenu.push({
          'id': m.link,
          'active': false,
          'caret': React.createRef(),
          'sub': React.createRef()
        });
        link.push( /*#__PURE__*/_jsxs("li", {
          children: [/*#__PURE__*/_jsxs("a", {
            href: m.link,
            onClick: this.menuClickEvent.bind(this, tmpLength),
            children: [ic, /*#__PURE__*/_jsx("span", {
              children: i
            }), /*#__PURE__*/_jsx("i", {
              className: "cpc-caret fas fa-caret-down",
              ref: tmpSubmenu[tmpLength].caret
            })]
          }), /*#__PURE__*/_jsx("ul", {
            className: "cpc-sub",
            ref: tmpSubmenu[tmpLength].sub,
            children: this.createMenuJSX(m.menu)
          })]
        }));
        this.setState({
          submenu: tmpSubmenu
        });
      }
    }
    return link;
  }
  render() {
    return /*#__PURE__*/_jsx("nav", {
      className: "cpc-menu",
      children: /*#__PURE__*/_jsx("ul", {
        className: "cpc-main",
        children: this.state.jsxData
      })
    });
  }
}

// Navigation menu builder
const menu = {
  'Home': {
    'link': '#home',
    'icon': 'fas fa-home'
  },
  'About': {
    'link': '#about',
    'icon': 'fas fa-info-circle'
  },
  'Clients': {
    'link': '#clients',
    'icon': 'fas fa-user-tie',
    'menu': {
      'Burger King': {
        'link': '#burger_king',
        'icon': 'fas fa-check'
      },
      'Southwest Airlines': {
        'link': '#southwest_airlines',
        'icon': 'fas fa-check'
      },
      'Levi Strauss': {
        'link': '#levi_strauss',
        'icon': 'fas fa-check'
      }
    }
  },
  'Services': {
    'link': '#services',
    'icon': 'fas fa-cogs',
    'menu': {
      'Print Design': {
        'link': '#print_design',
        'icon': 'fas fa-check'
      },
      'Web Design': {
        'link': '#web_design',
        'icon': 'fas fa-check'
      },
      'Mobile App Development': {
        'link': '#mobile_app_development',
        'icon': 'fas fa-check'
      }
    }
  },
  'Contact': {
    'link': '#contact',
    'icon': 'fas fa-phone-square'
  }
};
ReactDOM.render( /*#__PURE__*/_jsx(CpcNavigation, {
  menu: menu
}), document.querySelector('#app'));
    
}

setTimeout(delayedFunction, 10000);
