import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import recipes from "../config/recipes"; // Import the recipes array
import Header from "../components/Header"; // Assuming you have a Header component
import Groq from "groq-sdk";
import { useTTS } from '@cartesia/cartesia-js/react'; // Import TTS hook

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true, // NOT FOR PRODUCTION!
});

const Recipe = () => {
  const { name } = useParams(); // Get the recipe name from the URL
  const recipe = recipes.find((r) => r.name === decodeURIComponent(name));

  const [currentStep, setCurrentStep] = useState(0); // Track the current step for highlight
  const [completedSteps, setCompletedSteps] = useState([]); // Track completed steps
  const [chatMessages, setChatMessages] = useState([]); // Track chat messages
  const [inputValue, setInputValue] = useState(""); // State for the input field
  const [isTTSEnabled, setIsTTSEnabled] = useState(true); // State to toggle TTS
  const chatContainerRef = useRef(null); // Reference for scrolling behavior

  // Initialize TTS hook
  const tts = useTTS({
    apiKey: '34e8e31f-99be-4214-ad0f-bb4a889e7ef6', // Replace with your API key
    sampleRate: 44100,
  });

  if (!recipe) {
    return <p>Recipe not found</p>;
  }

  // Function to fetch Groq AI's response with a custom prompt
  const fetchGroqResponse = async (message, recipe, stepbystep, completedSteps) => {
    try {
      const prompt = `
      You are a helpful cooking assistant. You must **only** say "next step" if you are completely certain the user is ready to proceed based on their explicit input. 
      If the user confirms they have completed a step or provides enough context that they are ready to move forward, **always say "next step"** and proceed. 
      Avoid asking if they are ready to move on if they have already confirmed progress.

      If there is any ambiguity (e.g., the user hasn't explicitly stated they have finished a step or the context is unclear), 
      you can ask once (without saying "next step") but do not repeat steps or information unless specifically requested by the user. 

      Here is the context of the recipe: You have completed the following steps: ${completedSteps.join(', ')}

      Provide short and concise (max 3 lines) feedback and assistance based on the following user input 
      related to cooking this part of a recipe for "${recipe}":
      Steps: ${stepbystep}.

      Current step: "${message}". Do not mention any of the previous steps unless explicitly prompted by the user to do so.

      Guide the user through steps, answer questions thoroughly, and offer suggestions or feedback on cooking 
      techniques or ingredient substitutions. Do not repeat information unless asked for clarification. 
      Say "next step" only when the user is ready to move forward, based on their input.
`;

      const response = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "llama3-70b-8192", // Specify the model you want to use
        stop: "```", // Stop generating after the closing JSON block
      });

      // Extract AI response directly from the response object
      const aiMessage =
        response.choices[0]?.message?.content ||
        "Sorry, I couldn't understand that.";

      // Return the response or a default error message
      return aiMessage;
    } catch (error) {
      console.error("Error fetching AI response:", error);
      return "Error fetching response from AI.";
    }
  };

  // Function to handle chatbot interaction
  const handleChatSubmit = async (message) => {
    const newMessage = { text: message, sender: "user" };
    setChatMessages((prevMessages) => [...prevMessages, newMessage]);

    // Fetch AI response using Groq with the updated prompt, passing recipe name, steps, and completed steps
    const aiResponseText = await fetchGroqResponse(
      message,
      recipe.name,
      recipe.steps,
      completedSteps
    );

    // Add AI's response to chat messages
    const aiResponse = { text: aiResponseText, sender: "ai" };
    setChatMessages((prevMessages) => [...prevMessages, aiResponse]);

    // If TTS is enabled, play the chatbot response
    if (isTTSEnabled) {
      await tts.buffer({
        model_id: "sonic-english",
        voice: {
          mode: "id",
          id: "a0e99841-438c-4a64-b679-ae501e7d6091", // You can customize the voice ID
        },
        transcript: aiResponseText,
      });
      await tts.play(); // Play the TTS audio after buffering
    }

    // Check if the AI response contains "next step"
    if (aiResponseText.toLowerCase().includes("next step")) {
      handleNextStep(); // Move to the next step and update completed steps
    }
  };

  // Function to move to the next step and track completed steps
  const handleNextStep = () => {
    if (currentStep < recipe.steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
      setCompletedSteps((prevSteps) => [...prevSteps, currentStep]); // Track completed step
    }
  };

  // Scroll to the bottom when new messages are added to simulate upward scrolling
  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight; // Scrolls to the latest message
    }
  }, [chatMessages]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      handleChatSubmit(inputValue);
      setInputValue(""); // Clear input after submission
    }
  };

  const handleButtonClick = () => {
    if (inputValue.trim()) {
      handleChatSubmit(inputValue);
      setInputValue(""); // Clear input after submission
    }
  };

  // Function to toggle TTS on or off
  const toggleTTS = () => {
    setIsTTSEnabled((prev) => !prev); // Toggle TTS state
  };

  return (
    <div>
      <Header />
      <div className="py-20 max-w-7xl mx-auto p-6 flex flex-col lg:flex-row lg:space-x-6">
        {/* Left Side: Title, Ingredients, and Recipe Instructions */}
        <div className="flex-grow">
          <h1 className="text-5xl font-bold mb-6">{recipe.name}</h1>

          <div className="bg-gray-100 p-4 rounded-lg shadow-lg mb-6">
            <h2 className="text-2xl font-semibold mb-4">Ingredients</h2>
            <ul className="text-lg space-y-2">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="text-lg">
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative overflow-auto h-96 bg-gray-50 p-4 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">
              Step-by-Step Instructions
            </h2>
            <ul className="space-y-4">
              {recipe.steps.map((step, index) => (
                <li
                  key={index}
                  className={`p-4 rounded-lg ${
                    index === currentStep ? "bg-blue-200" : "bg-white"
                  }`}
                >
                  {step}
                </li>
              ))}
            </ul>
            <button
              className="mt-4 text-blue-500 hover:underline"
              onClick={handleNextStep}
            >
              Next Step
            </button>
          </div>
        </div>

        {/* Right Side: AI Cooking Assistant */}
        <div className="flex-none lg:w-1/3">
          <div className="bg-white p-6 rounded-lg shadow-lg h-[600px] flex flex-col">
            <h2 className="text-2xl font-semibold mb-4">
              AI Cooking Assistant
            </h2>

            {/* TTS Toggle */}
            <div className="mb-4">
              <label className="mr-2">Enable TTS</label>
              <input
                type="checkbox"
                checked={isTTSEnabled}
                onChange={toggleTTS}
              />
            </div>

            <div
              ref={chatContainerRef}
              className="flex-1 overflow-auto p-4 bg-gray-100 rounded-lg flex flex-col-reverse"
            >
              {chatMessages
                .slice()
                .reverse()
                .map((msg, index) => (
                  <div
                    key={index}
                    className={`flex mb-4 ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <p
                      className={`inline-block px-4 py-2 rounded-xl max-w-[80%] ${
                        msg.sender === "user"
                          ? "bg-blue-500 text-white ml-auto"
                          : "bg-gray-300 text-black mr-auto"
                      }`}
                    >
                      {msg.text}
                    </p>
                  </div>
                ))}
            </div>

            {/* Input and Send Button below the chat */}
            <div className="mt-4">
              <input
                type="text"
                className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-lg focus:outline-none"
                placeholder="Ask the AI assistant..."
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
              />
              <button
                onClick={handleButtonClick}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recipe;

