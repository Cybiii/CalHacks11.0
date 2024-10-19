import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import recipes from '../config/recipes'; // Import the recipes array
import Header from '../components/Header'; // Assuming you have a Header component

const Recipe = () => {
  const { name } = useParams(); // Get the recipe name from the URL
  const recipe = recipes.find((r) => r.name === decodeURIComponent(name));

  const [currentStep, setCurrentStep] = useState(0); // Track the current step for highlight
  const [chatMessages, setChatMessages] = useState([]); // Track chat messages

  if (!recipe) {
    return <p>Recipe not found</p>;
  }

  // Function to handle chatbot interaction
  const handleChatSubmit = (message) => {
    const newMessage = { text: message, sender: 'user' };
    setChatMessages((prevMessages) => [...prevMessages, newMessage]);

    // Simulate a response from the AI
    setTimeout(() => {
      const aiResponse = { text: 'Let me help you with that step!', sender: 'ai' };
      setChatMessages((prevMessages) => [...prevMessages, aiResponse]);
    }, 1000);
  };

  return (
    <div>
      <Header />
      <div className="max-w-7xl mx-auto p-6 flex flex-col lg:flex-row lg:space-x-6">
        {/* Left Side: Title, Ingredients, and Recipe Instructions */}
        <div className="flex-grow">
          {/* Title */}
          <h1 className="text-5xl font-bold mb-6">{recipe.name}</h1>

          {/* Ingredients */}
          <div className="bg-gray-100 p-4 rounded-lg shadow-lg mb-6">
            <h2 className="text-2xl font-semibold mb-4">Ingredients</h2>
            <ul className="text-lg space-y-2">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="text-lg">{ingredient}</li>
              ))}
            </ul>
          </div>

          {/* Recipe Instructions */}
          <div className="relative overflow-auto h-96 bg-gray-50 p-4 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Step-by-Step Instructions</h2>
            <ul className="space-y-4">
              {recipe.steps.map((step, index) => (
                <li
                  key={index}
                  className={`p-4 rounded-lg ${index === currentStep ? 'bg-blue-200' : 'bg-white'}`}
                >
                  {step}
                </li>
              ))}
            </ul>
            <button
              className="mt-4 text-blue-500 hover:underline"
              onClick={() => setCurrentStep((prev) => (prev < recipe.steps.length - 1 ? prev + 1 : prev))}
            >
              Next Step
            </button>
          </div>
        </div>

        {/* Right Side: Map and AI Cooking Assistant */}
        <div className="flex-none lg:w-1/3">
          {/* Map Component Placeholder */}
          <div className="bg-gray-100 p-4 rounded-lg shadow-lg mb-6 h-96">
            <h2 className="text-2xl font-semibold mb-4">Location</h2>
            <p>Map will be displayed here.</p> {/* Replace with actual map component */}
          </div>

          {/* AI Cooking Assistant */}
          <div className="bg-white p-6 rounded-lg shadow-lg h-96">
            <h2 className="text-2xl font-semibold mb-4">AI Cooking Assistant</h2>
            <div className="flex flex-col h-full overflow-auto p-4 bg-gray-100 rounded-lg space-y-4">
              {/* Chat Messages */}
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`${msg.sender === 'user' ? 'text-right' : 'text-left'}`}
                >
                  <p
                    className={`inline-block px-4 py-2 rounded-lg ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}
                  >
                    {msg.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Input Field for Chat */}
            <div className="mt-4 flex space-x-2">
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                placeholder="Ask the AI assistant..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    handleChatSubmit(e.target.value);
                    e.target.value = ''; // Clear input after submission
                  }
                }}
              />
              <button
                onClick={() => handleChatSubmit('Generate an image of the recipe')}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                Generate Image
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recipe;
