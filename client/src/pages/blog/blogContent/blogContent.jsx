// src/components/Blog/BlogPost.jsx
import React, { useEffect, useState } from 'react';
import { db } from '../../../firebase';
import { collection, getDocs, query, addDoc, doc, getDoc, setDoc, where } from "firebase/firestore";
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import NavbarSpec from '../../../components/navbar/navbarSpec';
import Footer from '../../../components/landing/footer/footer';

function BlogPost() {
    const url = useLocation()
    const pathname = url.pathname
    const id = pathname.replace("/blog/", "")
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogsById = async () => {
            try {
                const blogsRef = collection(db, 'blogs');
                console.log(id)
                const q = query(blogsRef, where('id', '==', id));
                const querySnapshot = await getDocs(q);

                const fetchedBlog = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setBlog(fetchedBlog);
            } catch (err) {
                console.error("Error fetching blogs by title:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogsById();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!blog) {
        return <div>Blog post not found.</div>;
    }

    console.log(blog)

    return (
        <>
            <div>
                <NavbarSpec />
                {blog.map(blog => (
                    <div className="blog-card" key={blog.title}>
                        <div className="blog-image">
                            <img src={blog.image} alt={`${blog.id}-image`} loading="lazy"/>
                        </div>
                            <div className="blog-card-content">
                                <h1 className="blog-card-title">{blog.title}</h1>
                                <h2 className="blog-card-description">{blog.description}</h2>
                                <h3>By {blog.author}</h3>
                            </div>
                        </div>
                    ))}
                <Footer />
            </div>
        </>
    );
}

export default BlogPost;
