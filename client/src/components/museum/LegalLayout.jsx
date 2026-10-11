/* eslint-disable react/prop-types */
import { MuseumPageHero } from "./MuseumPage";
export default function LegalLayout({ title, sections, children }) {
  return <><MuseumPageHero eyebrow="THE DETAILS, CLEARLY" title={title} description="Last updated February 2, 2026" image="/images/page-legal-ledgers.webp" imageAlt="Antique linen-bound ledgers with a blue ribbon in soft window light"/><main className="legal-layout"><aside><nav aria-label={`${title} sections`}><p className="mp-index">ON THIS PAGE</p>{sections.map(([id,label]) => <a key={id} href={`#${id}`}>{label}</a>)}</nav></aside><article className="legal-prose">{children}</article></main></>;
}
