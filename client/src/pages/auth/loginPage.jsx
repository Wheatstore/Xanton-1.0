import Login from "../../authenticationComponents/loginForm";
import { Helmet } from "react-helmet";
import Navbar from "../../components/navbar/navbar";

function LoginPage() {
  return (
    <>
      <Navbar />
      <Helmet>
        <title>Login | Echoes of History AI</title>

        <meta
          name="description"
          content="Log in to Echoes of History AI to continue exploring history through interactive conversations with historical figures."
        />

        {/* Auth pages should not be indexed */}
        <meta name="robots" content="noindex, nofollow" />

        {/* Open Graph (mostly irrelevant for login pages, but kept clean) */}
        <meta property="og:title" content="Login | Echoes of History AI" />
        <meta
          property="og:description"
          content="Log in to Echoes of History AI and continue learning through AI-powered conversations with historical figures."
        />
        <meta
          property="og:url"
          content="https://echoesofhistoryai.org/login"
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://echoesofhistoryai.org/images/og-image.jpg"
        />
      </Helmet>

      <div className="login-page-home-container-div">
        <Login />
      </div>
    </>
  );
}

export default LoginPage;
