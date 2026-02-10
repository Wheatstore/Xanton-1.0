import Navbar from "../../components/navbar/navbar"
import BotsDirectory from "../../components/BotsDirectory/BotsDirectory"
import Footer from "../../components/landing/footer/footer"
import { Helmet } from "react-helmet-async"

function BotsDirectoryPage () {
    return (
        <>
            <Helmet>
                <title>Chat with Historical Figures | Echoes of History AI</title>
                <meta
                name="description"
                content="Explore our collection of AI-powered historical figures. Chat with Einstein, Tesla, Da Vinci, and more. Free educational conversations."
                />
                <link rel="canonical" href="https://echoesofhistoryai.org/bots" />
            </Helmet>
            <Navbar />
            <BotsDirectory />
            <Footer />
        </>
    )

}

export default BotsDirectoryPage