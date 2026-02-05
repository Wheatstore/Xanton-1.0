import { Helmet } from "react-helmet-async";

import Feedback from "../../components/feedback/feedback";
import Footer from "../../components/landing/footer/footer";
import Navbar from "../../components/navbar/navbar";

function FeedbackPage() {
  return (
    <>
      <Helmet>
        <title>Feedback – Echoes of History AI</title>
        <meta
          name="description"
          content="Share feedback to help improve Echoes of History AI. Your suggestions help shape better educational conversations with historical figures."
        />
        <link
          rel="canonical"
          href="https://echoesofhistoryai.org/feedback"
        />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Echoes of History AI" />
        <meta
          property="og:title"
          content="Feedback – Echoes of History AI"
        />
        <meta
          property="og:description"
          content="Share feedback to help improve Echoes of History AI."
        />
        <meta
          property="og:url"
          content="https://echoesofhistoryai.org/feedback"
        />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Feedback – Echoes of History AI"
        />
        <meta
          name="twitter:description"
          content="Share feedback to help improve Echoes of History AI."
        />
      </Helmet>

      <div className="feedback-page-container">
        <Navbar />
        <Feedback />
        <Footer />
      </div>
    </>
  );
}

export default FeedbackPage;
