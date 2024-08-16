window.onload = function() {
    try {
        const resources = JSON.parse('{{ static_files | tojson | safe }}');
        resources.forEach(function(resource) {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = `/${resource}`;
            link.as = resource.includes('.css') ? 'style' :
                      resource.includes('.js') ? 'script' :
                      resource.includes('.svg') ? 'image' : '';
            document.head.appendChild(link);
        });
    } catch (error) {
        console.error('JSON Parsing Error:', error);
    }
};
