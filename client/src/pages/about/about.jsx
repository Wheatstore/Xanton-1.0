import React from 'react';
import { Helmet } from 'react-helmet';
import Footer from "../../components/footer/footer";
import NavbarSpec from "../../components/navbar/navbarSpec";
import "./about.css";

function About() {
    return (
        <>
            <Helmet>
                <title>About Xanton AI - Meet the Creator</title>
                <meta name="description" content="Learn about Xanton AI and its 15-year-old creator. Discover the journey from a side project to a dynamic educational resource." />
                <meta name="keywords" content="Xanton AI, about Xanton AI, meet the creator, educational platform, interactive learning" />
                <meta name="robots" content="index, follow" />
                <meta property="og:title" content="About Xanton AI - Meet the Creator" />
                <meta property="og:description" content="Learn about Xanton AI and its 15-year-old creator. Discover the journey from a side project to a dynamic educational resource." />
                <meta property="og:url" content="https://www.xantonai.com/about" />
                <meta property="og:type" content="website" />
                <meta property="og:image" content="https://upload.wikimedia.org/wikipedia/commons/a/a3/Vehn%C3%A4pelto_6.jpg" />
            </Helmet>
            <div className="about-page-container-div">
                <NavbarSpec />
                <div className="about-xanton-section">
                    <h1>Welcome to Xanton. A little bit about it. I am the 15 year old who created it.</h1>
                    <p>Xanton started as a side project, born from my desire to deepen my understanding of full stack web development. My primary goal was to create a platform that would make learning school subjects more engaging and enjoyable. I envisioned an interactive environment where students could explore topics in a way that felt less like traditional studying and more like an immersive, hands-on experience. This project allowed me to experiment with various technologies and frameworks, ultimately transforming a simple learning tool into a dynamic educational resource.</p>
                    <br />
                    <p>Ultimately, I decided to develop a chat-based bot that would interact with users directly, creating a more personal and engaging learning experience. This decision stemmed from my belief that a conversational interface would make the process of acquiring knowledge feel more natural and less like a chore. By allowing users to ask questions and receive instant responses, I aimed to replicate the feel of a one-on-one tutoring session, which I hoped would be more effective and enjoyable than traditional methods.</p>
                    <br />
                    <p className="creditor-wheatstore">- Wheatstore</p>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/a/a3/Vehn%C3%A4pelto_6.jpg" alt="Wheat field" />
                </div>
                <Footer />
            </div>
        </>
    );
}

export default About;
