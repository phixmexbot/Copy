        window.onload = function() {
            try {
                // The `tojson` filter in Jinja2 should automatically convert your Python list to a valid JSON array.
                const resources = {{ static_files | tojson | safe }};
                
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
