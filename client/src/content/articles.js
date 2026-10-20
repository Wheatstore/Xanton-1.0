import records from "./articles.json";

export const articles = records.map(article => ({ ...article, id: article.slug }));
export const findArticle = slug => articles.find(article => article.slug === slug);
export const articleSchema = article => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: article.title,
  description: article.excerpt,
  datePublished: article.date,
  mainEntityOfPage: `https://echoesofhistoryai.org/articles/${article.slug}`,
  author: { "@type": "Organization", name: article.author },
  publisher: { "@type": "Organization", name: "Echoes of History" },
  citation: article.sources.map(source => source.url),
});
