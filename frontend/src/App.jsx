import React, { useState } from "react";
import ProfileForm from "./components/ProfileForm";
import DevCard from "./components/DevCard";
import axios from "axios";

const App = () => {
  const [githubData, setGithubData] = useState(null);
  const [leetcodeData, setLeetcodeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [summary ,setSummary] = useState("");

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
      console.log(githubRes.data);
    } catch {
      setError("GitHub user not found.");
    }

    try {
      const leetcodeRes = await axios.get(
        `http://localhost:3000/api/leetcode/${leetcodeUsername}`
      );
      setLeetcodeData(leetcodeRes.data);
    } catch(error) {
      console.error(error);
      setError("LeetCode user not found.");
    }

    try{
      const summaryRes = await axios.get("http://localhost:3000/api/gemini/summary",{
        params:{
          githubUsername: githubUsername,
          leetcodeUsername: leetcodeUsername
        }
      })
      console.log(summaryRes.data.summary);
      setSummary(summaryRes.data.summary)
    }
    catch{
      setError("Failed to generate summary.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-200 to-slate-300 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <h1 className="text-4xl font-extrabold text-center mb-6 text-gray-800 dark:text-white">
        🚀 Digital Dev Card
      </h1>

      {error && (
        <p className="text-center text-red-500 font-semibold mb-4">{error}</p>
      )}
      {loading && (
        <p className="text-center text-blue-600 font-medium">Loading...</p>
      )}

      {/* ✅ This is the real conditional rendering */}
      {!githubData || !leetcodeData || !summary ? (
        <ProfileForm onSubmit={handleSubmit} />
      ) : (
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <DevCard
            githubData={githubData}
            leetcodeData={leetcodeData}
            summary={summary}
          />
        </div>
      )}
    </div>
  );
  
};

export default App;