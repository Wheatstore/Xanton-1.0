export const siteUrl = 'https://echoesofhistoryai.org';
export const socialImage = `${siteUrl}/images/og-image.jpg`;
export const pages = {
  '/': { title: 'Echoes of History — Explore History & Talk to Historical Figures', description: 'Meet the minds that shaped our world. Explore historical lives, timelines, documents, and ideas, then start an AI-powered conversation across time.' },
  '/about': { title: 'About Echoes of History — A More Human Way to Explore the Past', description: 'Discover the story behind Echoes of History, an interactive platform for exploring historical lives, evidence, ideas, and AI-powered conversations.' },
  '/features': { title: 'Interactive History Timelines, Documents & AI Conversations | Echoes', description: 'Explore history through biographies, interactive timelines, historical documents, ideas, and AI conversations with figures from the past.' },
  '/bots': { title: 'Explore Historical Figures & AI Conversations | Echoes of History', description: 'Browse historical leaders, thinkers, scientists, and artists. Discover their lives and ideas, then begin an AI-powered conversation with the past.' },
  '/articles': { title: 'History Articles & Essays — The Reading Room | Echoes of History', description: 'Read historical essays, stories, and perspectives from Echoes of History. Follow the people, ideas, and events that shaped our world.' },
  '/partners': { title: 'Educational & Museum Partnerships | Echoes of History', description: 'Partner with Echoes of History on education, exhibitions, and public historical interpretation for schools, libraries, museums, and cultural organizations.' },
  '/privacy': { title: 'Privacy Policy | Echoes of History', description: 'Learn how Echoes of History handles personal information and protects your privacy when you explore our interactive history platform.' },
  '/terms': { title: 'Terms of Service | Echoes of History', description: 'Read the terms for using Echoes of History and its AI-powered historical learning experiences.' },
  '/sitemap': { title: 'Sitemap — Explore Echoes of History', description: 'Find the historical collection, reading room, features, partnerships, and information pages on Echoes of History.' },
};
export const organization = { '@context': 'https://schema.org', '@type': 'Organization', '@id': `${siteUrl}/#organization`, name: 'Echoes of History', url: `${siteUrl}/`, logo: `${siteUrl}/logo.png` };
export const website = { '@context': 'https://schema.org', '@type': 'WebSite', '@id': `${siteUrl}/#website`, name: 'Echoes of History', alternateName: 'Echoes of History AI', url: `${siteUrl}/`, description: pages['/'].description, publisher: { '@id': `${siteUrl}/#organization` }, inLanguage: 'en' };
