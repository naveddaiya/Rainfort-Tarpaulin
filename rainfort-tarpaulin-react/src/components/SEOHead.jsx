import { useEffect } from 'react';

/**
 * SEO Head Component - injects structured data into <head> using native DOM
 * Meta tags are already in index.html; this only handles dynamic structured data
 */
const SEOHead = ({ structuredData = null }) => {
  useEffect(() => {
    if (!structuredData) return;

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    script.id = 'seo-structured-data';

    // Remove previous if exists
    const existing = document.getElementById('seo-structured-data');
    if (existing) existing.remove();

    document.head.appendChild(script);

    return () => {
      const el = document.getElementById('seo-structured-data');
      if (el) el.remove();
    };
  }, [structuredData]);

  return null;
};

export default SEOHead;
