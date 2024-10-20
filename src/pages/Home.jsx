import React from "react";
import Header from "../components/Header";
import HeroHome from "../components/HeroHome";
import FeaturesHome from "../components/Features";
import FeaturesBlocks from "../components/FeaturesBlocks";
import Testimonials from "../components/Testimonials";
import Newsletter from "../components/Newsletter";
import Footer from "../components/Footer";
import Dashboard from "../components/Dashboard";
import { useAuth } from "../context/AuthContext"; 

function Home() {
  const { currentUser, loading } = useAuth(); // Access the currentUser and loading state from AuthContext

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
      {currentUser ? (
        <Dashboard />
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
