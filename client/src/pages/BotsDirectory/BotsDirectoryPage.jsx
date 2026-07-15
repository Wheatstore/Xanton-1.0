import Navbar from "../../components/navbar/navbar"
import BotsDirectory from "../../components/BotsDirectory/BotsDirectory"
import { MuseumFooter } from "../../components/museum/MuseumPage"
import { Helmet } from "react-helmet-async"

function BotsDirectoryPage () {
    return (
        <>
            <Helmet>
                <title>Portrait Gallery | Echoes of History</title>
                <meta
                name="description"
                content="Explore a living portrait gallery of historical figures and begin a conversation with the past."
                />
                <link rel="canonical" href="https://echoesofhistoryai.org/bots" />
            </Helmet>
            <div className="mp-page"><Navbar /><BotsDirectory /><MuseumFooter /></div>
        </>
    )

}

export default BotsDirectoryPage
