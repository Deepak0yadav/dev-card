import React from "react";
import {
  Medal,
  Trophy,
  User,
  Flame,
  Globe,
  Star,
  BadgeCheck,
  Activity,
  BarChart2,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";

const DevCard = ({ githubData, leetcodeData, summary }) => {
  if (!githubData || !leetcodeData) return null;

  const [mainText, classificationText] = summary.split("Classification:");
  const stats = leetcodeData.submitStatsGlobal.acSubmissionNum;
  const getCount = (diff) =>
    stats.find((s) => s.difficulty === diff)?.count || 0;

  return (
    <div className="relative overflow-hidden p-4 sm:p-8 max-w-[1200px] mx-auto">

      <div
        className="relative z-10 max-w-full mx-auto p-6 sm:p-10 rounded-3xl backdrop-blur-xl bg-gradient-to-br from-white/50 via-white/40 to-white/30 dark:from-gray-900/40 dark:via-gray-900/30 dark:to-gray-900/20 border border-white/20 dark:border-gray-700/30 hover:bg-gradient-to-br hover:from-white/60 hover:via-white/50 hover:to-white/40 dark:hover:from-gray-900/50 dark:hover:via-gray-900/40 dark:hover:to-gray-900/30 transition-all duration-500 hover:scale-[1.02]"
        style={{
          borderTop: "3px solid black", // very thin black
          borderLeft: "3px solid black", // very thin black
          borderRight: "3px solid black", // very thin black
          borderBottom: "20px solid black", // slightly thicker black
        }}
      >
        <div className="flex items-center mb-6 border-l-4 border-yellow-600 pl-4 relative">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-500 to-yellow-700 rounded-r-full" />
          <div className="p-2 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 mr-3">
            <FaGithub className="w-6 h-6 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold text-yellow-600">GitHub Profile</h2>
        </div>

        <div className="flex flex-col items-center text-center mb-8 transform transition-all duration-300">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
            <img
              src={githubData.avatar_url}
              alt="avatar"
              className="relative w-24 h-24 rounded-full border-4 border-white/80 dark:border-gray-800/80 transition-all duration-300"
            />
            <span className="absolute bottom-0 right-0 w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-600 border-3 border-white dark:border-gray-800 rounded-full" />
          </div>
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent mt-6">
            {githubData.name}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 font-medium text-lg">
            @{githubData.login}
          </p>
          <div className="mt-2 flex items-center text-sm font-semibold text-gray-800 dark:text-gray-400 bg-gray-100/50 dark:bg-gray-800/30 px-3 py-1 rounded-full backdrop-blur-sm">
            <User className="w-4 h-4 mr-2 text-yellow-600" />
            {githubData.followers} Followers
          </div>
          <a
            href={githubData.html_url}
            target="_blank"
            rel="noreferrer"
            className="mt-4 px-6 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold rounded-full hover:scale-105 hover:-translate-y-0.5 transition-all duration-300"
          >
            View GitHub Profile
          </a>
        </div>

        <hr
          className="my-8 h-px border-0"
          style={{
            backgroundColor: "#d97706", // text-yellow-600
          }}
        />

        <div className="flex items-center mb-6 border-l-4 border-yellow-400 pl-4 relative">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-300 to-yellow-500 rounded-r-full" />
          <div className="p-2 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 mr-3">
            <SiLeetcode className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
          </div>
          <h2 className="text-2xl font-bold text-yellow-600">
            LeetCode Profile
          </h2>
        </div>

        <div className="flex flex-col items-center text-center transform transition-all duration-300">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
            <img
              src={leetcodeData.profile.userAvatar}
              alt="LeetCode Avatar"
              className="relative w-20 h-20 rounded-full border-3 border-white/80 dark:border-gray-800/80 transition-all duration-300"
            />
          </div>
          <p className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent mt-3">
            {leetcodeData.profile.realName} ({leetcodeData.username})
          </p>
          <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100/50 dark:bg-gray-800/30 px-3 py-1 rounded-full backdrop-blur-sm mt-2">
            {leetcodeData.profile.countryName}
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-2xl font-bold text-center bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-200 bg-clip-text text-transparent my-6">
            LeetCode Stats
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            {[
              {
                label: "Total Solved",
                value: getCount("All"),
                icon: Trophy,
              },
              {
                label: "Easy",
                value: getCount("Easy"),
                icon: Medal,
              },
              {
                label: "Medium",
                value: getCount("Medium"),
                icon: Medal,
              },
              {
                label: "Hard",
                value: getCount("Hard"),
                icon: Medal,
              },
              {
                label: "Ranking",
                value: leetcodeData.profile.ranking,
                icon: BarChart2,
              },
              {
                label: "Streak",
                value: `${leetcodeData.userCalendar?.streak || 0} days`,
                icon: Flame,
              },
              {
                label: "Active Days",
                value: leetcodeData.userCalendar?.totalActiveDays || 0,
                icon: Activity,
              },
              {
                label: "Contest Rating",
                value: leetcodeData.userContestRanking?.rating || "N/A",
                icon: Star,
              },
              {
                label: "Acceptance Rate",
                value: leetcodeData.profile.acceptanceRate
                  ? `${leetcodeData.profile.acceptanceRate}%`
                  : "N/A",
                icon: BadgeCheck,
              },
              {
                label: "Contests",
                value:
                  leetcodeData.userContestRanking?.totalParticipatedContests ||
                  0,
                icon: Globe,
              },
              {
                label: "Contribution Points",
                value: leetcodeData.profile.contributionPoints || 0,
                icon: Activity,
              },
            ].map(({ icon: Icon, label, value }, idx) => (
              <div
                key={idx}
                className="group p-4 rounded-2xl bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border border-white/30 dark:border-gray-700/30 transform transition-all duration-300 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 mr-3  transition-transform duration-300">
                      <Icon className="w-4 h-4 text-yellow-600" />
                    </div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {label}
                    </span>
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white text-lg">
                    {value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-gray-50/80 to-white/80 dark:from-gray-800/40 dark:to-gray-900/40 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
          <h3 className="text-xl font-bold mb-4 text-center bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
            Summary
          </h3>
          <p className="leading-relaxed text-center text-gray-800 dark:text-gray-300 font-medium">
            {mainText.trim()}
            {classificationText && (
              <span className="ml-2 inline-block px-4 py-2 mt-3 rounded-full bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300 text-black font-bold transition-all duration-300 transform">
                Classification: {classificationText.trim()}
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DevCard;
