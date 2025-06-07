import React, { useState } from "react";
import ProfileForm from "./components/ProfileForm";
import HeroSection from "./components/HeroSection";
import DevCard from "./components/DevCard";
import axios from "axios";
import { motion } from "framer-motion";
import Footer from "./components/ContactUs";

const App = () => {
  const [githubData, setGithubData] = useState(null);
  const [leetcodeData, setLeetcodeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState("");

  const handleSubmit = async (githubUsername, leetcodeUsername) => {
    if (!githubUsername || !leetcodeUsername) {
      setError("Both usernames are required.");
      return;
    }

    setLoading(true);
    setError("");
    setGithubData(null);
    setLeetcodeData(null);
    setSummary("");

    try {
      const githubRes = await axios.get(
        `http://localhost:3000/api/github/${githubUsername}`
      );
      setGithubData(githubRes.data);
    } catch {
      setError("GitHub user not found.");
    }

    try {
      const leetcodeRes = await axios.get(
        `http://localhost:3000/api/leetcode/${leetcodeUsername}`
      );
      setLeetcodeData(leetcodeRes.data);
    } catch (error) {
      console.error(error);
      setError("LeetCode user not found.");
    }

    try {
      const summaryRes = await axios.get(
        "http://localhost:3000/api/gemini/summary",
        {
          params: {
            githubUsername: githubUsername,
            leetcodeUsername: leetcodeUsername,
          },
        }
      );
      setSummary(summaryRes.data.summary);
    } catch {
      setError("Failed to generate summary.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-amber-200 p-8 md:p-12 flex flex-col items-center">
      <h1
  className="
    relative
    text-5xl md:text-6xl font-extrabold
    mb-10 text-center
    bg-yellow-800
    bg-clip-text text-transparent
    drop-shadow-[0_0_8px_rgba(255,215,0,0.6)]
    leading-[1.2]
    px-6 py-2
    before:absolute before:-bottom-2 before:left-1/2 before:-translate-x-1/2
    before:w-full before:h-1 before:rounded-full
    before:bg-yellow-800 before:opacity-80
    before:animate-pulse
  "
>
  Digital Dev Card
</h1>





      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-red-700 font-semibold mb-6 drop-shadow-md select-none"
        >
          {error}
        </motion.p>
      )}

      {loading && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-yellow-700 font-medium mb-6 animate-pulse select-none"
        >
          Loading...
        </motion.p>
      )}

      {/* Content container with fade-in animation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-screen-xl"
      >
        {/* Show Hero + Form when data not ready */}
        {!githubData || !leetcodeData || !summary ? (
          <div className="flex flex-col md:flex-row justify-center gap-12 px-4 md:px-0">
            {/* Hero Section */}
            <div className="md:w-1/2 w-full">
              <HeroSection />
            </div>

            {/* Profile Form */}
            <div className="md:w-1/2 w-full">
              <ProfileForm onSubmit={handleSubmit} />
            </div>
          </div>
        ) : (
          /* Show DevCard when data is ready */
          <div className="flex flex-col sm:flex-row justify-center gap-6 px-4 md:px-0">
            <DevCard
              githubData={githubData}
              leetcodeData={leetcodeData}
              summary={summary}
            />
          </div>
        )}
      </motion.div>
      <Footer />
    </div>
  );
};

export default App;
