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
      this.setState({ jsxData: this.createMenuJSX() });
    }

    menuClickEvent(i) {
      let submenu = this.state.submenu;
      let tmpmenu = submenu[i];
      let sub = tmpmenu.sub.current;
      let caret = tmpmenu.caret.current;

      if (tmpmenu.active === false) {
        tmpmenu.active = true;

        gsap.to(caret, 1, {
          transform: 'rotate(180deg)',
          ease: "elastic.out(1, 0.3)"
        });

        gsap.to(sub, 1, {
          height: sub.scrollHeight,
          visibility: 'visible',
          ease: "elastic.out(1, 0.3)"
        });
      } else {
        tmpmenu.active = false;

        gsap.to(caret, 1, {
          transform: 'rotate(0deg)',
          ease: "elastic.out(1, 0.3)"
        });

        gsap.to(sub, 0.5, {
          height: 0,
          ease: "bounce.out"
        }).eventCallback('onComplete', () => {
          gsap.to(sub, 0, {
            visibility: 'hidden'
          });
        });
      }

      submenu[i] = tmpmenu;

      this.setState({ submenu: submenu });
    }

    createMenuJSX(menu = this.props.menu) {
      let link = [];

      for (let i in menu) {
        let m = menu[i];
        let ic = <i className="cpc-icon cpc-hidden fas fa-caret-down"></i>;

        if (typeof m.icon !== 'undefined') {
          ic = <i className={'cpc-icon ' + m.icon}></i>;
        }

        if (typeof m.menu === 'undefined') {
          link.push(
            <li key={i}>
              <a href={m.link}>
                {ic}
                <span>{i}</span>
                <i className="cpc-caret cpc-hidden fas fa-caret-down"></i>
              </a>
            </li>
          );
        } else if (typeof m.menu === 'object') {
          let tmpSubmenu = this.state.submenu;
          let tmpLength = tmpSubmenu.length;

          tmpSubmenu.push({
            'id': m.link,
            'active': false,
            'caret': React.createRef(),
            'sub': React.createRef()
          });
          
          link.push(
            <li key={i}>
              <a
                href={m.link}
                onClick={this.menuClickEvent.bind(this, tmpLength)}
              >
                {ic}
                <span>{i}</span>
                <i
                  className="cpc-caret fas fa-caret-down"
                  ref={tmpSubmenu[tmpLength].caret}
                ></i>
              </a>
              <ul className="cpc-sub" ref={tmpSubmenu[tmpLength].sub}>
                {this.createMenuJSX(m.menu)}
              </ul>
            </li>
          );

          this.setState({ submenu: tmpSubmenu });
        }
      }

      return link;
    }

    render() {
      return (
        <nav className="cpc-menu">
          <ul className="cpc-main">
            {this.state.jsxData}
          </ul>
        </nav>
      );
    }
  }

  const menu = {
    'Home': {
      'link': '/',
      'icon': 'fas fa-home'
    },
    'Activities': {
      'link': '#activities',
      'icon': 'fa-solid fa-gamepad',
      'menu': {
        'Lightening Flash': {
          'link': '/activities/lightening-flash',
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
    <CpcNavigation menu={menu} />,
    document.querySelector('#app')
  );
}

setTimeout(delayedFunction, 10000);
