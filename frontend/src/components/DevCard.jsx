import React from "react";
import {
  Medal,
  Trophy,
  UserCircle,
  BarChart2,
  User,
  Flame,
  Globe,
  Star,
  Code2,
  BadgeCheck,
  Activity,
} from "lucide-react";

const DevCard = ({ githubData, leetcodeData, summary }) => {
  if (!githubData || !leetcodeData) return null;

  const [mainText, classificationText] = summary.split("Classification:");

  // Shortcuts
  const stats = leetcodeData.submitStatsGlobal.acSubmissionNum;
  const getCount = (diff) =>
    stats.find((s) => s.difficulty === diff)?.count || 0;

  return (
    <div className="max-w-full mx-auto p-6 bg-amber-200 backdrop-blur-md border border-gray-200 dark:border-gray-700 dark:bg-gray-900/80 shadow-2xl rounded-3xl transition-transform duration-300 hover:scale-[1.02]">
      <div className="flex flex-col items-center">
        <img
          src={githubData.avatar_url}
          alt="avatar"
          className="w-24 h-24 rounded-full border-1 border-gray-300 shadow-lg"
        />
        <h2 className="text-2xl font-extrabold text-gray-800 dark:text-white mt-3">
          {githubData.name}
        </h2>
        <p className="text-gray-600 dark:text-gray-300">@{githubData.login}</p>
        <p className="mt-1 flex items-center text-sm font-medium text-gray-700 dark:text-gray-400">
          <User className="w-4 h-4 mr-1" />
          {githubData.followers} Followers
        </p>
        <a
          href={githubData.html_url}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-block text-blue-600 hover:underline font-semibold">
          🔗 GitHub Profile
        </a>
      </div>

      <hr className="my-5 border-gray-300 dark:border-gray-600" />

      {/* LeetCode Avatar & Name */}
      <div className="flex flex-col items-center mt-2 mb-4">
        <img
          src={leetcodeData.profile.userAvatar}
          alt="LeetCode Avatar"
          className="w-20 h-20 rounded-full  border-1 border-gray-300 shadow-md"
        />
        <p className="text-lg font-semibold text-gray-800 dark:text-white mt-2">
          {leetcodeData.profile.realName} ({leetcodeData.username})
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          🌍 {leetcodeData.profile.countryName}
        </p>
      </div>

      <h3 className="text-xl font-bold text-center text-gray-800 dark:text-white mb-3">
        LeetCode Stats
      </h3>
      <ul className="grid grid-cols-2 gap-4 text-gray-700 dark:text-gray-300 text-sm">
        <li className="flex items-center">
          <Trophy className="w-4 h-4 mr-2 text-green-600" /> Total Solved:
          <span className="ml-auto font-bold">{getCount("All")}</span>
        </li>
        <li className="flex items-center">
          <Medal className="w-4 h-4 mr-2 text-green-400" /> Easy:
          <span className="ml-auto">{getCount("Easy")}</span>
        </li>
        <li className="flex items-center">
          <Medal className="w-4 h-4 mr-2 text-yellow-400" /> Medium:
          <span className="ml-auto">{getCount("Medium")}</span>
        </li>
        <li className="flex items-center">
          <Medal className="w-4 h-4 mr-2 text-red-500" /> Hard:
          <span className="ml-auto">{getCount("Hard")}</span>
        </li>
        <li className="flex items-center">
          <BarChart2 className="w-4 h-4 mr-2 text-purple-500" /> Ranking:
          <span className="ml-auto">{leetcodeData.profile.ranking}</span>
        </li>
        <li className="flex items-center">
          <Flame className="w-4 h-4 mr-2 text-orange-500" /> Streak:
          <span className="ml-auto">
            {leetcodeData.userCalendar?.streak || 0} days
          </span>
        </li>
        <li className="flex items-center">
          <Activity className="w-4 h-4 mr-2 text-blue-500" /> Active Days:
          <span className="ml-auto">
            {leetcodeData.userCalendar?.totalActiveDays || 0}
          </span>
        </li>
        <li className="flex items-center">
          <Star className="w-4 h-4 mr-2 text-yellow-500" /> Contest Rating:
          <span className="ml-auto">
            {leetcodeData.userContestRanking?.rating || "N/A"}
          </span>
        </li>

        {/* New additions */}
        <li className="flex items-center">
          <BadgeCheck className="w-4 h-4 mr-2 text-indigo-600" /> Acceptance
          Rate:
          <span className="ml-auto font-bold">
            {leetcodeData.profile.acceptanceRate
              ? `${leetcodeData.profile.acceptanceRate}%`
              : "N/A"}
          </span>
        </li>

        <li className="flex items-center">
          <Globe className="w-4 h-4 mr-2 text-teal-500" /> Contests
          Participated:
          <span className="ml-auto">
            {leetcodeData.userContestRanking?.totalParticipatedContests || 0}
          </span>
        </li>

        <li className="flex items-center">
          <Activity className="w-4 h-4 mr-2 text-pink-500" /> Contribution
          Points:
          <span className="ml-auto">
            {leetcodeData.profile.contributionPoints || 0}
          </span>
        </li>
      </ul>

      {/* Badges */}
      {leetcodeData.badges?.length > 0 && (
        <div className="mt-4">
          <h4 className="text-md font-semibold mb-2 flex items-center text-gray-800 dark:text-white">
            <BadgeCheck className="w-4 h-4 mr-1 text-pink-500" />
            Badges
          </h4>
          <div className="flex flex-wrap gap-2">
            {leetcodeData.badges.map((badge) => (
              <img
                key={badge.id}
                src={badge.icon}
                alt={badge.displayName}
                title={badge.displayName}
                className="w-8 h-8"
              />
            ))}
          </div>
        </div>
      )}

      {/* Language-wise */}
      {leetcodeData.languageProblemCount?.length > 0 && (
        <div className="mt-4">
          <h4 className="text-md font-semibold mb-2 flex items-center text-gray-800 dark:text-white">
            <Code2 className="w-4 h-4 mr-1 text-cyan-500" />
            Problems by Language
          </h4>
          <ul className="grid grid-cols-2 gap-2 text-sm text-gray-700 dark:text-gray-300">
            {leetcodeData.languageProblemCount.map((lang, idx) => (
              <li
                key={idx}
                className="flex justify-between">
                {lang.languageName}:{" "}
                <span className="font-medium">{lang.problemsSolved}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Summary */}
      <div className="mt-5 text-gray-700 dark:text-gray-300">
        <h3 className="text-xl font-bold mb-2 text-center">Summary</h3>
        <p>
          {mainText.trim()}
          {classificationText && (
            <span className="ml-1 px-2 py-1 rounded bg-yellow-300 font-bold text-black">
              Classification: {classificationText.trim()}
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

export default DevCard;
