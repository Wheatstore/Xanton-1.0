export const chapterInfo = {
  overview: ["Life story", "Meet the person behind the name."],
  timeline: ["Timeline", "Follow the moments that shaped a life."],
  ideas: ["Ideas & beliefs", "Understand what guided their choices."],
  documents: ["Documents", "Look closer at the surviving record."],
  relationships: ["People", "Discover the connections around them."],
  context: ["Their world", "See the conditions they lived in."],
  controversies: ["Debates", "Compare different interpretations."],
  legacy: ["Legacy", "Trace what happened afterward."],
  sources: ["Sources", "Explore the references for this life."],
  conversationGuide: ["Questions to ask", "Take your curiosity into a conversation."],
};

export const list = value => Array.isArray(value) ? value.filter(item => item !== null && item !== undefined && item !== "") : [];
export const clean = (value = "") => typeof value === "string" ? value.trim() : typeof value === "number" ? String(value) : Array.isArray(value) ? value.map(clean).filter(Boolean).join("\n\n") : value ? clean(value.summary || value.description || value.title || "") : "";
export const eventDate = event => clean(event.dateDisplay || event.startDate || event.date) || "Date unknown";

// Parse historical years explicitly; Date.parse does not handle BCE consistently.
// Unknown dates stay after dated entries, in the original record order.
export function historicalDate(value) {
  const text = clean(value);
  if (!text || /^(unknown|undated|date (unknown|uncertain))$/i.test(text)) return null;
  const iso = text.match(/^(-?\d{1,6})(?:-(\d{2})(?:-(\d{2}))?)?$/);
  const range = text.match(/^(?:c\.?\s*|circa\s*)?(\d{1,6})\s*[–—-]\s*\d{1,6}\s*(?:B\.?C\.?E?\.?|A\.?D\.?|C\.?E\.?)?$/i);
  const era = text.match(/(\d{1,6})\s*(?:B\.?C\.?E?\.?|A\.?D\.?|C\.?E\.?)\b/i);
  const yearToken = text.match(/\b\d{4}\b/);
  const plainYear = text.match(/^(?:c\.?\s*|circa\s*)?(\d{1,4})(?:\s*[–—-]\s*\d{1,4})?$/i);
  const yearText = iso?.[1] || range?.[1] || era?.[1] || yearToken?.[0] || plainYear?.[1];
  if (!yearText) return null;
  let year = Number(yearText);
  if (/\bB\.?C\.?E?\.?\b/i.test(text)) year = -Math.abs(year);
  let month = Number(iso?.[2] || 0);
  let day = Number(iso?.[3] || 0);
  if (!iso) {
    const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
    const monthMatch = text.match(/\b(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\b/i);
    if (monthMatch) {
      month = months.indexOf(monthMatch[0].slice(0, 3).toLowerCase()) + 1;
      const dayMatch = text.match(/\b(\d{1,2})(?:st|nd|rd|th)?\s+[A-Za-z]/) || text.match(/[A-Za-z]+\s+(\d{1,2})(?:st|nd|rd|th)?(?:,|\s)/);
      day = Number(dayMatch?.[1] || 0);
    }
  }
  return { year, order: year * 10000 + month * 100 + day };
}

export function orderedEvents(details) {
  const timeline = list(details.timeline);
  return (timeline.length ? timeline : list(details.keyMoments))
    .map((item, index) => ({ ...(typeof item === "string" ? { title: item } : item), recordIndex: index }))
    .sort((a, b) => {
      const first = historicalDate(a.startDate || a.date || a.dateDisplay);
      const second = historicalDate(b.startDate || b.date || b.dateDisplay);
      return (first?.order ?? Infinity) - (second?.order ?? Infinity) || a.recordIndex - b.recordIndex;
    });
}

export function excerpt(value, length = 290) {
  const text = clean(value);
  if (text.length <= length) return text;
  const first = text.slice(0, length);
  const sentence = first.match(/^([\s\S]*[.!?])(?:\s|$)/)?.[1];
  return sentence?.length > length / 2 ? `${sentence} …` : `${first.slice(0, first.lastIndexOf(" ") > 0 ? first.lastIndexOf(" ") : length)}…`;
}

export function sourceHref(value) {
  try { const url = new URL(value); return ["https:", "http:"].includes(url.protocol) ? url.href : undefined; }
  catch { return undefined; }
}
