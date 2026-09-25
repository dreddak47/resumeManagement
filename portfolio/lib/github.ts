const GITHUB_USER = "dreddak47";

export type RepoStats = {
  stars: number;
  language: string | null;
  pushedAt: string | null;
};

export type ContributionDay = {
  date: string;
  count: number;
};

const FALLBACK_REPO_STATS: Record<string, RepoStats> = {
  "collab-docs": { stars: 0, language: "TypeScript", pushedAt: null },
  "RL-Minesweeper-Lab": { stars: 0, language: "Python", pushedAt: null },
};

function authHeaders(): HeadersInit {
  const token = process.env.GITHUB_TOKEN;
  return {
    Accept: "application/vnd.github+json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function getRepoStats(repo: string): Promise<RepoStats> {
  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${repo}`, {
      headers: authHeaders(),
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`GitHub API ${res.status}`);
    const data = await res.json();
    return {
      stars: data.stargazers_count ?? 0,
      language: data.language ?? null,
      pushedAt: data.pushed_at ?? null,
    };
  } catch {
    return FALLBACK_REPO_STATS[repo] ?? { stars: 0, language: null, pushedAt: null };
  }
}

export async function getContributionCalendar(): Promise<{
  totalContributions: number;
  weeks: { days: ContributionDay[] }[];
} | null> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return null;

  const query = `
    query($login: String!) {
      user(login: $login) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
    }
  `;

  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables: { login: GITHUB_USER } }),
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`GitHub GraphQL ${res.status}`);
    const json = await res.json();
    const calendar = json?.data?.user?.contributionsCollection?.contributionCalendar;
    if (!calendar) return null;

    return {
      totalContributions: calendar.totalContributions,
      weeks: calendar.weeks.map((w: { contributionDays: { date: string; contributionCount: number }[] }) => ({
        days: w.contributionDays.map((d) => ({ date: d.date, count: d.contributionCount })),
      })),
    };
  } catch {
    return null;
  }
}

export { GITHUB_USER };
