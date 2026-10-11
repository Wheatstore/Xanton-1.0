const text = value => typeof value === "string" || typeof value === "number" ? String(value) : "";
const list = value => Array.isArray(value) ? value.map(text).filter(Boolean).join(", ") : text(value);

// Support both the original flat records and the richer historical-profile schema.
export function normalizeFigure(figure) {
  const profile = figure.profile || {};
  const biography = figure.biography || {};
  return {
    ...figure,
    name: text(figure.name) || text(profile.fullName) || "Historical figure",
    img: text(figure.img) || text(figure.image) || text(figure.profileImage),
    role: text(figure.role) || text(figure.occupation) || list(profile.occupations) || text(figure.knownFor) || text(figure.title) || "Historical figure",
    description: text(figure.description) || text(biography.short) || text(biography) || text(figure.bio) || text(figure.about),
    period: text(figure.lifespan) || text(figure.years) || text(figure.dates) || list(profile.eras) || text(figure.era) || [figure.birthYear, figure.deathYear].map(text).filter(Boolean).join("–"),
    place: text(figure.birthPlace) || text(figure.location) || text(figure.country) || text(figure.nationality) || list(profile.nationalities),
  };
}

export function figureText(figure) {
  return [figure.name, figure.description, figure.role, figure.period, figure.place, figure.profile?.subtitle, list(figure.conversation?.coreTopics)].filter(Boolean).join(" ").toLowerCase();
}
