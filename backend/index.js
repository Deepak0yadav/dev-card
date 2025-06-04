const express = require('express');
const axios = require('axios');
const cors = require('cors');
const cheerio = require('cheerio');

const { GoogleGenAI } = require("@google/genai");
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Replace with your actual API key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.get("/", (req, res) => {
      res.send("hello");
});




// app.get("/api/github/:username", async (req, res) => {
//       try {
//             const { username } = req.params;
//             const response = await axios.get(`https://api.github.com/users/${username}`);
//             const userData = response.data;
//             res.json(userData);
//       } catch (error) {
//             res.json({ error: "GitHub user not found" });
//       }
// });

async function scrapeLanguagesFromRepos(username) {
      try {
            const url = `https://github.com/${username}?tab=repositories`;
            const { data: html } = await axios.get(url, {
                  headers: { "User-Agent": "Mozilla/5.0" }
            });

            const $ = cheerio.load(html);
            const languages = {};

            $("li[itemprop='owns'] div.f6 span[itemprop='programmingLanguage']").each((i, elem) => {
                  const lang = $(elem).text().trim();
                  if (lang) {
                        languages[lang] = (languages[lang] || 0) + 1;
                  }
            });

            return languages;
      } catch (error) {
            console.error("Error scraping repo languages:", error.message);
            return {};
      }
}

// Scrape pinned repos and languages summary from user's profile page
async function scrapeGitHubProfile(username) {
      try {
            const url = `https://github.com/${username}`;
            const { data: html } = await axios.get(url, {
                  headers: {
                        "User-Agent": "Mozilla/5.0 (compatible; ScraperBot/1.0)"
                  }
            });

            const $ = cheerio.load(html);

            // Scrape pinned repos
            const pinnedRepos = [];
            $("div.pinned-item-list-item").each((i, elem) => {
                  const repoName = $(elem).find("span.repo").text().trim();
                  const description = $(elem).find("p.pinned-item-desc").text().trim();
                  const language = $(elem).find('[itemprop="programmingLanguage"]').text().trim();
                  pinnedRepos.push({ repoName, description, language });
            });

            // Scrape languages summary from language color bar (if available)
            const languages = [];
            $("li.d-inline").each((i, elem) => {
                  const lang = $(elem).find("span.color-fg-default").text().trim();
                  const percent = $(elem).find("span.color-fg-muted").text().trim();
                  if (lang && percent) {
                        languages.push({ language: lang, percent });
                  }
            });

            return { pinnedRepos, languages };
      } catch (error) {
            console.error("Error scraping GitHub profile:", error.message);
            return null;
      }
}

// API endpoint
app.get("/api/github/:username", async (req, res) => {
      try {
            const { username } = req.params;

            // 1. Get basic user data from GitHub API
            const response = await axios.get(`https://api.github.com/users/${username}`, {
                  headers: { "User-Agent": "Mozilla/5.0" }
            });
            const userData = response.data;

            // 2. Scrape pinned repos and language summary
            const profileData = await scrapeGitHubProfile(username);

            // 3. Scrape languages from repos (detailed count)
            const languagesFromRepos = await scrapeLanguagesFromRepos(username);

            res.json({
                  userData,
                  pinnedRepos: profileData ? profileData.pinnedRepos : [],
                  languageSummary: profileData ? profileData.languages : [],
                  languagesCount: languagesFromRepos
            });
      } catch (error) {
            console.error("Error in /api/github/:username:", error.message);
            res.status(404).json({ error: "GitHub user not found or error occurred" });
      }
    });


app.get("/api/leetcode/:username", async (req, res) => {
      const { username } = req.params;

      try {
            const response = await axios.post(
                  "https://leetcode.com/graphql/",
                  {
                        operationName: "getUserProfile",
                        variables: { username },
                        query: `
              query getUserProfile($username: String!) {
                matchedUser(username: $username) {
                  username
                  profile {
                    realName
                    userAvatar
                    ranking
                    countryName
                    starRating
                    skillTags
                    birthday
                    jobTitle
                  }
                  submitStatsGlobal {
                    acSubmissionNum {
                      difficulty
                      count
                      submissions
                    }
                    totalSubmissionNum {
                      difficulty
                      count
                      submissions
                    }
                  }
                  badges {
                    id
                    displayName
                    icon
                    creationDate
                  }
                  userCalendar {
                    streak
                    totalActiveDays
                    submissionCalendar
                  }
                  languageProblemCount {
                    languageName
                    problemsSolved
                  }
                }
                userContestRanking(username: $username) {
                  attendedContestsCount
                  rating
                  globalRanking
                  totalParticipants
                  topPercentage
                  badge {
                    name
                    expired
                    hoverText
                    icon
                  }
                }
                userContestRankingHistory(username: $username) {
                  attended
                  trendDirection
                  problemsSolved
                  totalProblems
                  finishTimeInSeconds
                  rating
                  ranking
                  contest {
                    title
                    startTime
                  }
                }
              }
            `
                  },
                  {
                        headers: {
                              "Content-Type": "application/json"
                        }
                  }
            );

            const user = response.data.data.matchedUser;

            if (!user) {
                  return res.status(404).json({ error: "LeetCode username not found" });
            }

            const contestRanking = response.data.data.userContestRanking;
            const contestHistory = response.data.data.userContestRankingHistory;

            res.json({
                  ...user,
                  contestRanking,
                  contestHistory
            });

      } catch (error) {
            console.error("LeetCode API error:", error.response?.data || error.message);
            res.status(500).json({ error: "Failed to fetch extended LeetCode data." });
      }
});
    

// 🔥 GEMINI summary endpoint
app.get("/api/gemini/summary", async (req, res) => {
      const { githubUsername, leetcodeUsername } = req.query;

      if (!githubUsername || !leetcodeUsername) {
            return res.status(400).json({ error: "Both usernames are required" });
      }

      try {
            // Fetch GitHub user data
            const githubRes = await axios.get(`https://api.github.com/users/${githubUsername}`);
            const github = githubRes.data;

            // Fetch LeetCode user data
            const leetcodeRes = await axios.post("https://leetcode.com/graphql/", {
                  operationName: "getUserProfile",
                  variables: { username: leetcodeUsername },
                  query: `
        query getUserProfile($username: String!) {
          matchedUser(username: $username) {
            username
            profile { ranking }
            submitStatsGlobal {
              acSubmissionNum {
                difficulty
                count
              }
            }
          }
        }
      `,
            });

            const lc = leetcodeRes.data.data.matchedUser;
            const leetcodeStats = lc.submitStatsGlobal.acSubmissionNum.reduce((acc, item) => {
                  acc[item.difficulty.toLowerCase()] = item.count;
                  return acc;
            }, {});

            // Prepare content for Gemini
            const prompt = `
Generate a concise, clear, and professional bio based on the GitHub and LeetCode profiles provided below.

The bio should be a **single sentence**, without line breaks, bullet points, or special characters. Avoid overly technical jargon, keep it easy to understand, and highlight key achievements.

At the end, add a classification tag in bold format from these options: "Developer", "Problem Solver", or "Both" based on the data.

GitHub:
- Name: ${github.name || github.login}
- Bio: ${github.bio || "No bio provided"}
- Public Repos: ${github.public_repos}
- Followers: ${github.followers}
- Following: ${github.following}

LeetCode:
- Username: ${lc.username}
- Ranking: ${lc.profile.ranking}
- Solved Easy: ${leetcodeStats.easy || 0}
- Solved Medium: ${leetcodeStats.medium || 0}
- Solved Hard: ${leetcodeStats.hard || 0}

Example output: "Deepak Yadav is a developer with 21 public repositories on GitHub and has solved 300 LeetCode problems across difficulty levels. 
Classification: Developer."
    `;

            const response = await ai.models.generateContent({
                  model: "gemini-2.0-flash",
                  contents: prompt,
            });
            res.json({ summary: response.text });
            console.log(response.text);

    
      } catch (error) {
            console.error("Error generating summary:", error.message);
            res.status(500).json({ error: "Failed to generate summary" });
      }
});




app.listen(3000, () => {
      console.log("server started on port 3000");
});
