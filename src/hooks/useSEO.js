import { useEffect } from 'react';

const BASE_URL = 'https://bunk-learn-hub.vercel.app';
const SITE_NAME = 'Bunk & Learn Hub';

/**
 * Enhanced SEO hook — dynamically updates all critical meta tags
 * (title, description, keywords, canonical, OG, Twitter) per view.
 */
export function useSEO({ title, description, keywords, path = '' }) {
    useEffect(() => {
        const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
        const pageUrl = `${BASE_URL}${path ? '/#' + path : '/'}`;

        // --- Document Title ---
        document.title = fullTitle;

        // --- Helper: upsert a meta tag ---
        function setMeta(attr, attrValue, content) {
            let el = document.querySelector(`meta[${attr}="${attrValue}"]`);
            if (!el) {
                el = document.createElement('meta');
                el.setAttribute(attr, attrValue);
                document.head.appendChild(el);
            }
            el.setAttribute('content', content);
        }

        // --- Helper: upsert a link tag ---
        function setLink(rel, href) {
            let el = document.querySelector(`link[rel="${rel}"]`);
            if (el) {
                el.setAttribute('href', href);
            }
        }

        // Primary meta tags
        if (description) {
            setMeta('name', 'description', description);
        }
        if (keywords) {
            setMeta('name', 'keywords', keywords);
        }
        setMeta('name', 'title', fullTitle);

        // Canonical URL
        setLink('canonical', pageUrl);

        // Open Graph
        setMeta('property', 'og:title', fullTitle);
        setMeta('property', 'og:url', pageUrl);
        if (description) {
            setMeta('property', 'og:description', description);
        }

        // Twitter
        setMeta('name', 'twitter:title', fullTitle);
        setMeta('name', 'twitter:url', pageUrl);
        if (description) {
            setMeta('name', 'twitter:description', description);
        }

    }, [title, description, keywords, path]);
}
