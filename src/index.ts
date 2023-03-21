import axios from "axios";
import "dotenv/config";

interface Repo {
  name: string;
  fork: boolean;
}

interface LanguageBytes {
  [key: string]: number;
}

const fetchUserRepos = async (accessToken: string): Promise<Repo[]> => {
  const repos: Repo[] = [];
  let page = 1;
  const maxPage = parseInt(process.env.MAX_PAGE as string);
  if (isNaN(maxPage)) throw new Error("MAX_PAGE is not a number");
  while (page < maxPage) {
    const response = await axios.get<Repo[]>(
      `https://api.github.com/user/repos`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${accessToken}`,
          "X-GitHub-Api-Version": "2022-11-28",
        },
        params: {
          visibility: "all",
          affiliation: "owner",
          per_page: 100,
          page: page,
        },
      }
    );
    if (response.data.length === 0) break;
    repos.push(...response.data);
    page++;
  }
  return repos;
};

const fetchRepoLanguages = async (
  owner: string,
  repo: string,
  accessToken: string
): Promise<LanguageBytes> => {
  const response = await axios.get<LanguageBytes>(
    `https://api.github.com/repos/${owner}/${repo}/languages`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${accessToken}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );
  const ignoreLanguages = (process.env.IGNORE_LANGUAGES as string).split(",");
  const filteredLanguages: LanguageBytes = {};
  for (const [language, bytes] of Object.entries(response.data)) {
    if (!ignoreLanguages.includes(language)) {
      filteredLanguages[language] = bytes;
    }
  }
  return filteredLanguages;
};

const calculateLanguagePercentage = (
  languages: LanguageBytes
): LanguageBytes => {
  const totalBytes = Object.values(languages).reduce(
    (sum, value) => sum + value,
    0
  );
  const languagePercentages: LanguageBytes = {};
  for (const [language, bytes] of Object.entries(languages)) {
    languagePercentages[language] = Number(
      ((bytes / totalBytes) * 100).toFixed(2)
    );
  }
  return languagePercentages;
};

(async () => {
  const username = process.env.GITHUB_USERNAME as string;
  const accessToken = process.env.GITHUB_ACCESS_TOKEN as string;
  try {
    const repos = await fetchUserRepos(accessToken);
    // console.log("repo num", repos.length);
    const allLanguages: LanguageBytes = {};
    let forkLepoNum = 0;
    for (const repo of repos) {
      if (repo.fork) {
        forkLepoNum++;
        continue;
      }
      // console.log("repo name", repo.name);
      const languages = await fetchRepoLanguages(
        username,
        repo.name,
        accessToken
      );
      for (const [language, bytes] of Object.entries(languages)) {
        allLanguages[language] = (allLanguages[language] || 0) + bytes;
      }
    }
    // console.log("fork repo num", forkLepoNum);
    const languagePercentages = calculateLanguagePercentage(allLanguages);
    const sortedLanguagePercentages = Object.entries(languagePercentages)
      .sort((a, b) => b[1] - a[1])
      .reduce((obj, [language, percentage]) => {
        obj[language] = percentage;
        return obj;
      }, {} as LanguageBytes);
    let showNum = parseInt(process.env.SHOW_NUM as string);
    if (isNaN(showNum)) showNum = 10;
    if (Object.keys(sortedLanguagePercentages).length < showNum) {
      showNum = Object.keys(sortedLanguagePercentages).length;
    }
    for (let i = 1; i <= showNum; i++) {
      const language = Object.keys(sortedLanguagePercentages)[i];
      const percentage = sortedLanguagePercentages[language];
      console.log(`${i}. ${language} ${percentage}%`);
    }
  } catch (error) {
    console.error("Error fetching repository languages:", error);
  }
})();
