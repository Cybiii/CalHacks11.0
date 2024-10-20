import React, { useState, useEffect, useRef } from "react";
import Header from "../components/Header";
import Groq from "groq-sdk";
import { useTTS } from "@cartesia/cartesia-js/react";
import { useLocation } from "react-router-dom";
import nlp from 'compromise'; // Import compromise

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true, // NOT FOR PRODUCTION!
});

const Recipe = () => {
  const location = useLocation();
  const { recipe } = location.state; // Access the passed recipe from the state

  const ingredients = recipe.ingredients.split("|").map((ing) => ing.trim());

  // Use compromise to tokenize sentences
  const doc = nlp(recipe.instructions);
  const sentences = doc.sentences().out('array');
  const steps = sentences.map((sentence) => sentence.trim());

  const [currentStep, setCurrentStep] = useState(0); // Track the current step for highlight
  const [completedSteps, setCompletedSteps] = useState([]); // Track completed steps
  const [chatMessages, setChatMessages] = useState([]); // Initialize with empty array
  const [inputValue, setInputValue] = useState(""); // State for the input field
  const [isTTSEnabled, setIsTTSEnabled] = useState(true); // State to toggle TTS
  const chatContainerRef = useRef(null); // Reference for scrolling behavior

  // Initialize TTS hook
  const tts = useTTS({
    apiKey: "your-tts-api-key", // Replace with your API key
    sampleRate: 44100,
  });

  // If no recipe is found
  if (!recipe) {
    return <p>Recipe not found</p>;
  }

  // Function to generate the system message
  const generateSystemMessage = (message) => {
    return `You are a helpful cooking assistant. Your goal is to guide the user through the recipe one step at a time. The user can select any step they want to work on. Provide assistance based on the user's current step, and answer any questions they may have about it. Do not assume the user has completed previous steps unless they indicate so.

Here is the context of the recipe:
- **Ingredients**: ${ingredients.join(", ")}.
- **Current step**: ${steps[currentStep]}.

Completed steps:
${
      completedSteps.length > 0
        ? completedSteps.map((index) => steps[index]).join(" ")
        : "None completed yet"
    }

Based on the user's input, here's what they've said: "${message}".

Please assist the user accordingly, focusing on the current step.`;
  };

  // Function to fetch Groq AI's response with the updated conversation history
  const fetchGroqResponse = async (message) => {
    try {
      const systemMessage = generateSystemMessage(message);

      const messages = [
        { role: "system", content: systemMessage },
        ...chatMessages,
        { role: "user", content: message },
      ];

      console.log("Messages sent to Groq:", messages);

      const response = await groq.chat.completions.create({
        messages: messages,
        model: "llama3-70b-8192",
        stop: "\n\n",
      });

      const aiMessage =
        response.choices[0]?.message?.content ||
        "Sorry, I couldn't understand that.";
      return aiMessage;
    } catch (error) {
      console.error("Error fetching AI response:", error);
      return "Error fetching response from AI.";
    }
  };

  // Function to handle chatbot interaction
  const handleChatSubmit = async (message) => {
    const newMessage = { role: "user", content: message };
    setChatMessages((prevMessages) => [...prevMessages, newMessage]);

    // Check if the user indicates they are ready to move on
    const readinessPhrases = ["next", "next step", "done", "i'm ready", "ready"];
    const userReady = readinessPhrases.some((phrase) =>
      message.toLowerCase().includes(phrase)
    );

    // Fetch AI response using Groq with the updated prompt
    const aiResponseText = await fetchGroqResponse(message);

    const aiResponse = { role: "assistant", content: aiResponseText };
    setChatMessages((prevMessages) => [...prevMessages, aiResponse]);

    // Play the chatbot response if TTS is enabled
    if (isTTSEnabled) {
      await tts.buffer({
        model_id: "sonic-english",
        voice: {
          mode: "id",
          id: "a0e99841-438c-4a64-b679-ae501e7d6091",
        },
        transcript: aiResponseText,
      });
      await tts.play();
    }

    // Move to the next step if the user is ready
    if (userReady) {
      handleNextStep();
    }
  };

  // Function to handle step click
  const handleStepClick = (index) => {
    setCurrentStep(index);

    // Optionally, update completed steps
    const newCompletedSteps = [...Array(index).keys()];
    setCompletedSteps(newCompletedSteps);

    // Inform the AI assistant about the change
    handleStepChange(index);
  };

  // Function to inform AI assistant about step change
  const handleStepChange = async (index) => {
    const message = `I have moved to step ${index + 1}: "${steps[index]}"`;

    const newMessage = { role: "user", content: message };
    setChatMessages((prevMessages) => [...prevMessages, newMessage]);

    // Fetch AI response using Groq with the updated prompt
    const aiResponseText = await fetchGroqResponse(message);

    const aiResponse = { role: "assistant", content: aiResponseText };
    setChatMessages((prevMessages) => [...prevMessages, aiResponse]);

    // Play the chatbot response if TTS is enabled
    if (isTTSEnabled) {
      await tts.buffer({
        model_id: "sonic-english",
        voice: {
          mode: "id",
          id: "a0e99841-438c-4a64-b679-ae501e7d6091",
        },
        transcript: aiResponseText,
      });
      await tts.play();
    }
  };

  // Function to move to the next step and track completed steps
  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCompletedSteps((prevSteps) => [...prevSteps, currentStep]);
      setCurrentStep((prev) => prev + 1);
    } else {
      // All steps completed
      const completionMessage = {
        role: "assistant",
        content: "Congratulations! You've completed all the steps.",
      };
      setChatMessages((prevMessages) => [...prevMessages, completionMessage]);
    }
  };

  // Scroll to the bottom when new messages are added to simulate upward scrolling
  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight; // Scroll to the latest message
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
          <h1 className="text-5xl font-bold mb-6">{recipe.title}</h1>

          {/* Ingredients Section */}
          <div className="bg-gray-100 p-4 rounded-lg shadow-lg mb-6">
            <h2 className="text-2xl font-semibold mb-4">Ingredients</h2>
            <ul className="text-lg space-y-2">
              {ingredients.map((ingredient, index) => (
                <li key={index} className="text-lg">
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions Section */}
          <div className="relative overflow-auto h-96 bg-gray-50 p-4 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">
              Step-by-Step Instructions
            </h2>
            <ul className="space-y-4">
              {steps.map((step, index) => (
                <li
                  key={index}
                  className={`p-4 rounded-lg cursor-pointer ${
                    index === currentStep
                      ? "bg-blue-200"
                      : completedSteps.includes(index)
                      ? "bg-green-200"
                      : "bg-white"
                  }`}
                  onClick={() => handleStepClick(index)}
                >
                  {step}
                </li>
              ))}
            </ul>
            {/* Remove the Next Step button */}
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
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <p
                      className={`inline-block px-4 py-2 rounded-xl max-w-[80%] ${
                        msg.role === "user"
                          ? "bg-blue-500 text-white ml-auto"
                          : "bg-gray-300 text-black mr-auto"
                      }`}
                    >
                      {msg.content}
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
