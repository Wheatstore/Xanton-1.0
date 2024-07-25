import Footer from "../../components/footer/footer"
import "./blog.css"
import { db } from "../../firebase";
import { collection, getDocs, query, addDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import NavbarSpec from "../../components/navbar/navbarSpec";

function Blog(){
    const [blogList, setBlogList] = useState([])

    useEffect(() => {
        const getBlogs = async () => {
            try {
                const blogRef = collection(db, 'blogs');
                const q = query(blogRef);
                const snapshot = await getDocs(q);

                const blogList = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setBlogList(blogList);
            } catch (error) {
                console.error("Error fetching blogs: ", error);
            }
        };

        getBlogs();
    }, []);
    return (
        <>
            <div className="blog-page-container">
                <NavbarSpec />
                <div className="heading-blog-container">
                    <h1>Welcome to the Xanton blog</h1>
                    <h3>Browse our collection of articles</h3>
                </div>
                <div className="blog-collection-container">
                    {blogList.map(blog => (
                        <div className="blog-card" key={blog.id}>
                            <div className="blog-card-image">
                                <img src={blog.image} alt={`${blog.id}-image`} loading="lazy"/>
                            </div>
                            <div className="blog-card-content">
                                <h1 className="blog-card-title">{blog.title}</h1>
                                <h2 className="blog-card-description">{blog.description}</h2>
                                <h3>By {blog.author}</h3>
                            </div>
                        </div>
                    ))}
                </div>
                <Footer />
            </div>
        </>
    )
}

export default Blog