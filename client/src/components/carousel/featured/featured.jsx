import "./featured.css"

function Featured(){
    const companies = [
        { name: "Company A", logo: "https://media.theresanaiforthat.com/featured-on-taaft.png?width=600" },
        { name: "Company B", logo: "/images/kisspng-reddit-logo-computer-icons-reddit-alien-5b16a57b946c57.285836041528210811608.png" },
        { name: "Company C", logo: "/images/ph-logo-1.png" },
        { name: "Company D", logo: "/images/hacker-news1.webp" },
    ];

    return (
        <div className="featured-container">   
            <div className="logos-grid">
            {companies.map((company, index) => (
            <div key={index} className="logo-item">
                <img src={company.logo} alt={`${company.name} logo`} loading="lazy" />
            </div>
            ))}
        </div>
        </div>
    )
}

export default Featured