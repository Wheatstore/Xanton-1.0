import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";

// Get server URL from environment variable
const SERVER_URL = process.env.REACT_APP_SERVER_URL || "https://xanton-1-0-server.vercel.app";

function Feedback() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    email: "",
    description: ""
  });
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // Submit feedback
  const sendFeedback = async () => {
    try {
      const body = {
        sender: user,
        title: formData.title,
        email: formData.email,
        description: formData.description
      };
      
      const response = await axios.post(`${SERVER_URL}/api/feedback`, body);
      
      if (response.status === 200) {
        navigate("/user");
      }
    } catch (error) {
      console.error("There was an error submitting feedback", error);
    }
  };

  return (
    <div className="w-full pt-20 pb-50 max-w-5xl mx-auto p-6 my-8 bg-black">
      <div className="bg-black rounded-lg shadow-lg overflow-hidden border border-gray-800">
        <div className="p-6 bg-black text-white">
          <h1 className="text-2xl font-bold mb-2">Help us improve the site</h1>
          <p className="text-purple-200">
            All requests, feedback, and submissions will be closely considered and worked upon by me.
            Please be honest and truthful.
          </p>
        </div>
        
        <div className="p-6 space-y-4 bg-black">
          <div className="space-y-4">
            <div>
              <input
                className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                placeholder="Title the problem"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <input
                className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                placeholder="What is an email so that I can contact you further if needed"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <textarea
                className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition h-32 resize-none"
                placeholder="Describe the problem in detail..."
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              ></textarea>
            </div>
          </div>
          
          <button 
            className="w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 ease-in-out transform hover:-translate-y-1"
            onClick={sendFeedback}
          >
            Submit Feedback
          </button>
        </div>
        
        <div className="border-t border-gray-800 p-4 bg-gray-800 flex items-center justify-center">
          <a 
            href="mailto:support@xantonai.com" 
            className="flex items-center text-gray-300 hover:text-purple-400 transition"
          >
            <span>support@xantonai.com</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Feedback;