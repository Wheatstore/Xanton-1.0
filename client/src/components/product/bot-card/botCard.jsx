/* eslint-disable react/prop-types */
import DirectoryFigureCard from "../../BotsDirectory/DirectoryFigureCard";

// Older collection entry points share the same accessible portrait card.
export default function BotCard({ person }) {
  return <DirectoryFigureCard figure={person} />;
}
