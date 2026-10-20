/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";

function References({ ids = [] }) {
  return <span className="article-references">{ids.map(id => <a key={id} href={`#source-${id}`} aria-label={`Source ${id}`}>[{id}]</a>)}</span>;
}

export default function ArticleBody({ article }) {
  return <>
    <nav className="article-contents" aria-label="In this article">
      <p className="mp-index">IN THIS ARTICLE</p>
      {article.sections.map(section => <a key={section.id} href={`#${section.id}`}>{section.heading}</a>)}
    </nav>
    {article.sections.map(section => <section id={section.id} key={section.id}>
      <h2>{section.heading}</h2>
      {section.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}{index === section.paragraphs.length - 1 && <References ids={section.sources}/>}</p>)}
    </section>)}
    <section><h2>A brief timeline</h2><ol className="article-timeline">{article.timeline.map(item => <li key={item.date}><strong>{item.date}</strong><p>{item.event}<References ids={item.sources}/></p></li>)}</ol></section>
    <section className="article-conversation">
      <p className="mp-index">CONTINUE THE CONVERSATION</p>
      <h2>Explore the decision with {article.figure}.</h2>
      <p>Try these questions in an AI-powered historical conversation:</p>
      <ul>{article.questions.map(question => <li key={question}>{question}</li>)}</ul>
      <Link className="mp-button" to={`/bots?search=${encodeURIComponent(article.figure)}`}>Find {article.figure} →</Link>
      <p className="article-disclosure">Conversations are AI interpretations, not historical testimony. Check their answers against the sources below.</p>
    </section>
    <section className="article-sources"><h2>Sources &amp; further reading</h2>
      <ol>{article.sources.map(source => <li key={source.id} id={`source-${source.id}`} value={source.id}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a><p>{source.note}</p></li>)}</ol>
      <p className="article-disclosure">{article.editorialNote}</p>
    </section>
  </>;
}
