import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion"; // Import AnimatePresence and motion for page transitions

import "aos/dist/aos.css";
import "./css/style.css";

import AOS from "aos";

import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ResetPassword from "./pages/ResetPassword";
import Recipe from "./components/Recipe"; // Import RecipeDetails component
import Transition from "./components/Transition"; // Import your transition component
import Header from "./components/Header"; // Assuming you have a common header component

function App() {
  const location = useLocation(); // Similar to useRouter in Next.js

  useEffect(() => {
    AOS.init({
      once: true,
      disable: "phone",
      duration: 700,
      easing: "ease-out-cubic",
    });
  });

  useEffect(() => {
    document.querySelector("html").style.scrollBehavior = "auto";
    window.scroll({ top: 0 });
    document.querySelector("html").style.scrollBehavior = "";
  }, [location.pathname]); // Triggered on route change

  return (
    <>
      {/* Header component outside of the AnimatePresence to prevent fading */}
      <Header />

      {/* AnimatePresence for smooth transitions between pages */}
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="h-full"
        >
          <Transition /> {/* Include the Transition animation */}
          <Routes location={location} key={location.pathname}>
            <Route exact path="/" element={<Home />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/recipes/:name" element={<Recipe />} /> {/* Recipe details */}
          </Routes>
        </motion.div>
      </AnimatePresence>
    </>
  );
}

export default App;
