import { Helmet } from "react-helmet-async";
import Navbar from "../../components/navbar/navbar";
import BotsDirectory from "../../components/BotsDirectory/BotsDirectory";
import { MuseumFooter } from "../../components/museum/MuseumPage";

function AuthenticatedPage() {
  return (
    <div className="mp-page">
      <Helmet>
        <title>Portrait Gallery | Echoes of History</title>
        <meta
          name="description"
          content="Browse the historical portrait collection and begin a conversation."
        />
      </Helmet>
      <Navbar />
      <BotsDirectory />
      <MuseumFooter />
    </div>
  );
}

export default AuthenticatedPage;
