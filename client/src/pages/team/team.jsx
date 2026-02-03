import React from 'react';
import { Helmet } from 'react-helmet';
import "./team.css";

function Team() {
    return (
        <>
            <Helmet>
                <title>Meet the Team - Echoes of History AI</title>
                <meta name="description" content="Learn about the team behind Echoes of History AI. If you're interested in joining, submit the feedback form." />
                <meta name="keywords" content="Echoes History AI team, join Echoes AI, team members, Echoes of History AI developers" />
                <meta name="robots" content="index, follow" />
                <meta property="og:title" content="Meet the Team - Echoes of History AI" />
                <meta property="og:description" content="Learn about the team behind Echoes AI. If you're interested in joining, submit the feedback form." />
                <meta property="og:url" content="https://www.echoesofhistoryai.org/team" />
                <meta property="og:type" content="website" />
                <meta property="og:image" content="https://echoesofhistoryai.org/og-team-image.jpg" />
            </Helmet>
            <div className="team-page-container-container">
                <div className="team-page-container">
                    <h1>If you want to join the team, submit the feedback form.</h1>
                </div>
            </div>
        </>
    );
}

export default Team;
