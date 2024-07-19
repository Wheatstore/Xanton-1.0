import "./testimonialCard.css"

function Testimonial(){
    const reviews = [
        {
            user: "Emma Johnson",
            picture: "https://randomuser.me/api/portraits/women/1.jpg",
            review: "Chatting with Gandhi was an enlightening experience. His insights on non-violence and peace are incredibly relevant even today. Xanton makes history come alive in a way I've never seen before. The interface is user-friendly."
        },
        {
            user: "Liam Smith",
            picture: "https://randomuser.me/api/portraits/men/1.jpg",
            review: "Florence Nightingale provided me with incredible insights on healthcare and nursing. Her passion for helping others was evident in our conversation. I highly recommend Xanton for anyone interested in historical figures and their thoughts."
        },
        {
            user: "Olivia Brown",
            picture: "https://randomuser.me/api/portraits/women/2.jpg",
            review: "Alan Turing's discussions on computing were fascinating. As someone in the tech industry, I found our conversation enlightening and inspiring. Xanton is a must-try for tech enthusiasts looking to learn from the pioneers of the field."
        },
        {
            user: "Noah Wilson",
            picture: "https://randomuser.me/api/portraits/men/2.jpg",
            review: "Talking to Einstein about physics blew my mind. He explained complex theories in a way that was easy to understand. Xanton is an amazing application that brings historical geniuses to life. It's a valuable tool for students and curious minds alike."
        },
        {
            user: "Ava Martinez",
            picture: "https://randomuser.me/api/portraits/women/3.jpg",
            review: "Discussing nursing with Florence Nightingale was an extraordinary experience. Her dedication and insights on patient care were truly inspiring. Xanton has made it possible to learn directly from the legends!"
        },
        {
            user: "William Lee",
            picture: "https://randomuser.me/api/portraits/men/3.jpg",
            review: "Chatting with Genghis Khan about his military strategies and leadership was a unique experience. His perspectives on unity and strength were quite intriguing. Xanton offers a fascinating way to delve into history."
        },
        {
            user: "Sophia Taylor",
            picture: "https://randomuser.me/api/portraits/women/4.jpg",
            review: "Conversations with Einstein on relativity were beyond amazing. He made complex topics so understandable. Xanton is an exceptional educational tool for anyone interested in science and history."
        },
        {
            user: "James Anderson",
            picture: "https://randomuser.me/api/portraits/men/4.jpg",
            review: "Learning about computer science from Alan Turing was incredibly insightful. His visionary ideas on computing were astonishing. Xanton is a revolutionary app that brings the wisdom of the past to the present."
        },
        {
            user: "Isabella Thomas",
            picture: "https://randomuser.me/api/portraits/women/5.jpg",
            review: "Chatting with Florence Nightingale gave me a new appreciation for the history of nursing. Her dedication to patient care and hygiene was inspiring. Xanton is a treasure trove of knowledge."
        },
        {
            user: "Benjamin Rodriguez",
            picture: "https://randomuser.me/api/portraits/men/5.jpg",
            review: "Gandhi's views on peace and non-violence were incredibly profound. His philosophy on life has given me much to think about. Xanton allows for these extraordinary interactions, making learning a deeply personal experience."
        }
    ];

    return (
        <div className="testimonials-container">
            {reviews.map((review, index) => (
                <div className="testimonial-card" key={index}>
                    <img src={review.picture} alt={`${review.user}'s profile`} className="profile-picture" />
                    <h3>{review.user}</h3>
                    <p>{review.review}</p>
                    <small>- {review.figure}</small>
                </div>
            ))}
        </div>
    )
}

export default Testimonial