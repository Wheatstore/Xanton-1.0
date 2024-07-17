import "./carousel.css"
import Marquee from "react-fast-marquee"
import Testimonial from "./testimonials/testimonialCard"

function Carousel(){
    return (
    <Marquee>
        <Testimonial />
    </Marquee>
    )
}

export default Carousel