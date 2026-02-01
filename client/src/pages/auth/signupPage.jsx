import Signup from "../../authenticationComponents/signupForm";
import { Helmet } from "react-helmet";
import Navbar from "../../components/navbar/navbar";

function SignupPage() {
  return (
    <>
      <Navbar />
      <Helmet>
        <title>Sign Up | Echoes of History AI</title>

        <meta
          name="description"
          content="Create an account on Echoes of History AI to explore history through interactive conversations with historical figures."
        />

        {/* Auth pages should not be indexed */}
        <meta name="robots" content="noindex, nofollow" />

        {/* Open Graph (optional on auth pages, but kept consistent) */}
        <meta property="og:title" content="Sign Up | Echoes of History AI" />
        <meta
          property="og:description"
          content="Create an account on Echoes of History AI and start learning through AI-powered conversations with historical figures."
        />
        <meta
          property="og:url"
          content="https://echoesofhistoryai.org/signup"
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://echoesofhistoryai.org/images/og-image.jpg"
        />
      </Helmet>

      <div className="signup-page-home-container">
        <Signup />
      </div>
    </>
  );
}

export default SignupPage;
