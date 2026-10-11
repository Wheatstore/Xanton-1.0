import Navbar from "../../components/navbar/navbar"
import BotsDirectory from "../../components/BotsDirectory/BotsDirectory"
import { MuseumFooter } from "../../components/museum/MuseumPage"

function BotsDirectoryPage () {
    return (
        <>

            <div className="mp-page"><Navbar /><BotsDirectory /><MuseumFooter /></div>
        </>
    )

}

export default BotsDirectoryPage
