import Footer from "../../components/landing/footer/footer"
import "./blog.css"
import { db } from "../../firebase";
import { collection, getDocs, query, addDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import NavbarSpec from "../../components/navbar/navbarSpec";

function Blog(){
    const [blogList, setBlogList] = useState([])

    useEffect(() => {
        const getBlogs = async () => {
            try {
                const blogRef = collection(db, 'blogs');
                const q = query(blogRef);
                const snapshot = await getDocs(q);
                console.log(snapshot)

                const blogList = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                console.log(blogList)

                setBlogList(blogList);
            } catch (error) {
                console.error("Error fetching blogs: ", error);
            }
        };

        getBlogs();
    }, []);
    return (
        <>
            <Helmet>
                <title>Xanton AI Blog - Articles and Insights</title>
                <meta name="description" content="Welcome to the Xanton AI blog. Browse our collection of articles on history, education, and technology." />
                <meta name="keywords" content="Xanton AI blog, history articles, education insights, technology blog, historical figures, interactive learning" />
                <meta name="robots" content="index, follow" />
                <meta property="og:title" content="Xanton AI Blog - Articles and Insights" />
                <meta property="og:description" content="Welcome to the Xanton AI blog. Browse our collection of articles on history, education, and technology." />
                <meta property="og:url" content="https://www.xantonai.com/blog" />
                <meta property="og:type" content="website" />
                <meta property="og:image" content="https://www.xantonai.com/og-blog-image.jpg" />
            </Helmet>
            <div className="blog-page-container">
                <NavbarSpec />
                <div className="heading-blog-container">
                    <h1>Welcome to the Xanton blog</h1>
                    <h3>Browse our collection of articles</h3>
                </div>
                <div className="blog-collection-container">
                    {blogList.map(blog => (
                        <div className="blog-card" key={blog.id}>
                            <Link to={`/blog/${blog.id}`}>
                                <div className="blog-card-image">
                                    <img src={blog.image} alt={`${blog.id}-image`} loading="lazy"/>
                                </div>
                                <div className="blog-card-content">
                                    <h1 className="blog-card-title">{blog.title}</h1>
                                    <h2 className="blog-card-description">{blog.description}</h2>
                                    <h3>By {blog.author}</h3>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
                <Footer />
            </div>
        </>
    )
}

export default Blog