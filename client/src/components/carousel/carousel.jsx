import "./carousel.css"
import Marquee from "react-fast-marquee"
import Testimonial from "./testimonials/testimonialCard"

function Carousel(){
    return (
    <div className="carousel-container">
        <div className="testimonials-container-product">
            <h1>Don't take it from us, talk to our users</h1>
            <div className="h3-container">
                <h3>Discover the user feedback that we recieved from our users</h3>
            </div>
            <Marquee autoFill={true} direction="right">
                <Testimonial />
            </Marquee>
        </div>
    </div>
    )
}

export default Carousel