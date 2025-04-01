import React from 'react';
import { Helmet } from 'react-helmet';
import "./team.css";

function Team() {
    return (
        <>
            <Helmet>
                <title>Meet the Team - Xanton AI</title>
                <meta name="description" content="Learn about the team behind Xanton AI. If you're interested in joining, submit the feedback form." />
                <meta name="keywords" content="Xanton AI team, join Xanton AI, team members, Xanton AI developers" />
                <meta name="robots" content="index, follow" />
                <meta property="og:title" content="Meet the Team - Xanton AI" />
                <meta property="og:description" content="Learn about the team behind Xanton AI. If you're interested in joining, submit the feedback form." />
                <meta property="og:url" content="https://www.xantonai.com/team" />
                <meta property="og:type" content="website" />
                <meta property="og:image" content="https://www.xantonai.com/og-team-image.jpg" />
            </Helmet>
            <div className="team-page-container-container">
                <div className="team-page-container">
                    <h1>This website was made by Nate Yoo. If you want to join the team, submit the feedback form.</h1>
                </div>
            </div>
        </>
    );
}

export default Team;
