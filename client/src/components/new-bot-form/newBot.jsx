import { useState } from "react";
import axios from "axios";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";

// Get server URL from environment variable
const SERVER_URL = process.env.REACT_APP_SERVER_URL || "https://xanton-1-0-server.vercel.app";

function NewBot() {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    greeting: "",
    description: "",
    additionalMessage: ""
  });
  
  const [filledOut, setFilled] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.greeting || !formData.description) {
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await axios.post(`${SERVER_URL}/api/create-new-bot`, {
        name: formData.name,
        creator: user.displayName,
        creatorId: user.uid,
        greeting: formData.greeting,
        description: formData.description,
        additionalMessage: formData.additionalMessage
      });
      
      setFilled(true);
      setLoading(false);
      
      if (response.status === 200) {
        navigate("/submitted");
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  // Guidelines for creating a bot
  const guidelines = [
    {
      title: "Choose a Well-Known Figure",
      description: "Select historical figures that are widely recognized and have substantial documented information available."
    },
    {
      title: "Craft an Authentic Greeting",
      description: "Write a greeting that captures the figure's personality, speaking style, and era."
    },
    {
      title: "Be Detailed in Description",
      description: "Include key achievements, time period, areas of expertise, and unique characteristics."
    },
    {
      title: "Add Context",
      description: "Consider including historical context, contemporaries, and significant events from their lifetime."
    }
  ];

  return (
    <div className="w-full min-h-screen pt-20 bg-black p-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Create a New Historical Bot</h1>
          <p className="text-gray-400">Bring history to life with an AI-powered historical figure</p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form Section */}
          <div className="lg:w-2/3 bg-gray-900 rounded-xl shadow-xl overflow-hidden">
            <div className="p-6 bg-gray-800 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white">Bot Details</h2>
              <p className="text-gray-400 text-sm mt-1">All fields marked with * are required</p>
            </div>
            
            <form className="p-6 space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                  Historical Figure Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="E.g., Albert Einstein, Marie Curie"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="greeting" className="block text-sm font-medium text-gray-300">
                  Greeting Message *
                </label>
                <textarea
                  id="greeting"
                  name="greeting"
                  value={formData.greeting}
                  onChange={handleChange}
                  rows="3"
                  placeholder="How your bot will greet users (in the figure's authentic voice)"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
                  required
                ></textarea>
                <p className="text-xs text-gray-500">Write in first person as if the historical figure is speaking</p>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-300">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Describe the historical figure's background, achievements, and personality"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
                  required
                ></textarea>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="additionalMessage" className="block text-sm font-medium text-gray-300">
                  Additional Information <span className="text-gray-500">(Optional)</span>
                </label>
                <textarea
                  id="additionalMessage"
                  name="additionalMessage"
                  value={formData.additionalMessage}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Any extra details or specific characteristics you want to emphasize"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
                ></textarea>
              </div>
              
              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full px-6 py-3 bg-blue-900 hover:bg-blue-800 text-white font-medium rounded-lg transition duration-200 ease-in-out transform hover:-translate-y-1 flex justify-center items-center"
                >
                  {loading ? (
                    <span className="inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  ) : null}
                  {loading ? "Creating Bot..." : "Create Historical Bot"}
                </button>
              </div>
            </form>
          </div>
          
          {/* Guidelines Section */}
          <div className="lg:w-1/3">
            <div className="bg-gray-900 rounded-xl shadow-xl overflow-hidden sticky top-6">
              <div className="p-4 bg-blue-900 text-white">
                <h3 className="font-semibold">Bot Creation Guidelines</h3>
              </div>
              <div className="p-4">
                <ul className="space-y-4">
                  {guidelines.map((guideline, index) => (
                    <li key={index} className="pb-3 border-b border-gray-800">
                      <h4 className="text-white font-medium text-sm">{guideline.title}</h4>
                      <p className="text-gray-400 text-xs mt-1">{guideline.description}</p>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-6 p-3 bg-gray-800 rounded-lg">
                  <p className="text-xs text-gray-300">
                    <span className="font-semibold block mb-1">Pro Tip:</span>
                    Provide specific details and context about your historical figure to create a more accurate and engaging bot experience.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewBot;