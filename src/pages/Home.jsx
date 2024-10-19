import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase"; // Adjust the path if necessary

import Header from "../components/Header";
import HeroHome from "../components/HeroHome";
import FeaturesHome from "../components/Features";
import FeaturesBlocks from "../components/FeaturesBlocks";
import Testimonials from "../components/Testimonials";
import Newsletter from "../components/Newsletter";
import Footer from "../components/Footer";
import Dashboard from "../components/Dashboard";
import recipes from '../config/recipes'; // Import recipes

function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // State for loading status

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("User:", currentUser); // Log the user status
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
      setLoading(false); // Stop loading after user is determined
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        {/* You can replace this with a custom loader component if you want */}
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/* Site header */}
      <Header />

      {/* Conditionally render components based on authentication status */}
      {user ? (
        <Dashboard recipes={recipes} />
      ) : (
        <main className="flex-grow">
          {/* Page sections */}
          <HeroHome />
          <FeaturesHome />
          <FeaturesBlocks />
          <Testimonials />
          <Newsletter />
        </main>
      )}

      {/* Site footer */}
      <Footer />
    </div>
  );
}

export default Home;
