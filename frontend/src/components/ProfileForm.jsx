import React, { useState } from "react";

const ProfileForm = ({ onSubmit }) => {
  const [githubUsername, setGithubUsername] = useState("");
  const [leetcodeUsername, setLeetcodeUsername] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(githubUsername.trim(), leetcodeUsername.trim());
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white/80 dark:bg-gray-900/80 p-6 rounded-2xl shadow-md">
      <div className="mb-4">
        <label
          htmlFor="githubUsername"
          className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">
          GitHub Username
        </label>
        <input
          id="githubUsername"
          type="text"
          value={githubUsername}
          onChange={(e) => setGithubUsername(e.target.value)}
          className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
          placeholder="Enter GitHub username"
          required
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="leetcodeUsername"
          className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">
          LeetCode Username
        </label>
        <input
          id="leetcodeUsername"
          type="text"
          value={leetcodeUsername}
          onChange={(e) => setLeetcodeUsername(e.target.value)}
          className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-white"
          placeholder="Enter LeetCode username"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200">
        Get Profile
      </button>
    </form>
  );
};

export default ProfileForm;
