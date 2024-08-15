        window.onload = function() {
            // Ensure the data is properly escaped and parsed
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
        };
