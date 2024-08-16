window.onload = function() {
    // Hardcoded list of resources
    const resources = [
        "static/assets/cactus.svg",
        "static/scripts/background.js",
        "static/scripts/fire.js",
        "static/scripts/form.js",
        "static/scripts/initial.js",
        "static/scripts/light.js",
        "static/scripts/pizza.js",
        "static/scripts/prefetch.js",
        "static/scripts/rain.js",
        "static/scripts/rating.js",
        "static/scripts/timer.js",
        "static/scripts/top-menu.js",
        "static/styles/background.css",
        "static/styles/bottom-menu.css",
        "static/styles/fire.css",
        "static/styles/footer.css",
        "static/styles/form.css",
        "static/styles/home-appearance.css",
        "static/styles/initial.css",
        "static/styles/logo.css",
        "static/styles/message.css",
        "static/styles/pizza.css",
        "static/styles/rating.css",
        "static/styles/rocket.css",
        "static/styles/tom-menu.css"
    ];
    
    resources.forEach(function(resource) {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = `/${resource}`;
        link.as = resource.includes('.css') ? 'style' :
                  resource.includes('.js') ? 'script' :
                  resource.includes('.svg') ? 'image' : '';
        document.head.appendChild(link);
    });
};
