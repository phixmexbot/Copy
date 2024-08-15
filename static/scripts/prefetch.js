window.onload = function() {
    const resources = {{ static_files | tojson }};
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
