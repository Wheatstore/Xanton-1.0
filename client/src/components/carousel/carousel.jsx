import "./carousel.css"
import Marquee from "react-fast-marquee"
import Testimonial from "./testimonials/testimonialCard"
import Featured from "./featured/featured"

function Carousel(){
    return (
    <div className="carousel-container">
        <h1>Featured on</h1>
        <Marquee direction="left" autoFill={true} speed={30}>
            <Featured />
        </Marquee>
        <Marquee direction="right" autoFill={true}>
            <Testimonial />
        </Marquee>
    </div>
    )
}

export default Carousel