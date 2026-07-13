import { useEffect } from 'react';

export function useSEO({ title, description, keywords }) {
    useEffect(() => {
        // Update title
        if (title) {
            document.title = `${title} | Bunk & Learn Hub`;
        } else {
            document.title = 'Bunk & Learn Hub';
        }

        // Update meta description
        if (description) {
            let metaDesc = document.querySelector('meta[name="description"]');
            if (!metaDesc) {
                metaDesc = document.createElement('meta');
                metaDesc.name = 'description';
                document.head.appendChild(metaDesc);
            }
            metaDesc.content = description;
            
            // Open Graph
            let ogDesc = document.querySelector('meta[property="og:description"]');
            if (!ogDesc) {
                ogDesc = document.createElement('meta');
                ogDesc.setAttribute('property', 'og:description');
                document.head.appendChild(ogDesc);
            }
            ogDesc.content = description;
        }

        // Update meta keywords
        if (keywords) {
            let metaKey = document.querySelector('meta[name="keywords"]');
            if (!metaKey) {
                metaKey = document.createElement('meta');
                metaKey.name = 'keywords';
                document.head.appendChild(metaKey);
            }
            metaKey.content = keywords;
        }
    }, [title, description, keywords]);
}
