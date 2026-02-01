// pages/bots/BotsDirectory.jsx
import { Helmet } from 'react-helmet-async';

function BotsDirectory() {
  const historicalFigures = [
    {
      name: "Albert Einstein",
      slug: "einstein",
      description: "Physicist who developed the theory of relativity",
      image: "/images/einstein.jpg",
      topics: ["Physics", "Philosophy", "Science"]
    },
    {
      name: "Nikola Tesla", 
      slug: "tesla",
      description: "Inventor and electrical engineer",
      image: "/images/tesla.jpg",
      topics: ["Electricity", "Innovation", "Engineering"]
    }//Complete this bots directory
  ];

  return (
    <>
      <Helmet>
        <title>Chat with Historical Figures | Echoes of History AI</title>
        <meta name="description" content="Explore our collection of AI-powered historical figures. Chat with Einstein, Tesla, Da Vinci, and more. Free educational conversations." />
        <link rel="canonical" href="https://echoesofhistoryai.org/bots" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Historical Figures Available for Chat",
            "itemListElement": historicalFigures.map((figure, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "item": {
                "@type": "Person",
                "name": figure.name,
                "description": figure.description,
                "image": `https://echoesofhistoryai.org${figure.image}`
              }
            }))
          })}
        </script>
      </Helmet>

      <div className="bots-directory">
        <h1>Chat with Historical Figures</h1>
        <p>Explore conversations with history's greatest minds</p>
        
        <div className="bots-grid">
          {historicalFigures.map(figure => (
            <article key={figure.slug} className="bot-card">
              <img src={figure.image} alt={figure.name} />
              <h2>{figure.name}</h2>
              <p>{figure.description}</p>
              <div className="topics">
                {figure.topics.map(topic => (
                  <span key={topic} className="topic-tag">{topic}</span>
                ))}
              </div>
              <a href={`/signup?bot=${figure.slug}`}>Start Chatting</a>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}

export default BotsDirectory