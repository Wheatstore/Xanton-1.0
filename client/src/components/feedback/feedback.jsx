import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";

const SERVER_URL =
  process.env.REACT_APP_SERVER_URL ||
  "https://historia-backend-ycj7.onrender.com";

function Feedback() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    email: "",
    description: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const sendFeedback = async () => {
    try {
      const body = {
        senderUid: user?.uid || null,
        senderEmail: user?.email || null,
        title: formData.title,
        email: formData.email,
        description: formData.description
      };

      const response = await axios.post(
        `${SERVER_URL}/api/feedback`,
        body
      );

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
          <h1 className="text-2xl font-bold mb-2">
            Help improve Echoes of History AI
          </h1>
          <p className="text-purple-200">
            All feedback is reviewed carefully. Please be honest and specific.
          </p>
        </div>

        <div className="p-6 space-y-4 bg-black">
          <input
            className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            placeholder="Title the issue"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <input
            className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            placeholder="Email (optional, for follow-up)"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />

          <textarea
            className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition h-32 resize-none"
            placeholder="Describe the issue or suggestion in detail…"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />

          <button
            className="w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold py-3 px-4 rounded-lg transition transform hover:-translate-y-1"
            onClick={sendFeedback}
          >
            Submit Feedback
          </button>
        </div>

        <div className="border-t border-gray-800 p-4 bg-gray-900 flex justify-center text-gray-400 text-sm">
          Feedback is reviewed directly by the Echoes of History AI team.
        </div>
      </div>
    </div>
  );
}

export default Feedback;
