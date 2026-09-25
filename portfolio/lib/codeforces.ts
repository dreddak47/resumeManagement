const CODEFORCES_HANDLE = "dredd_ak47";

export type CodeforcesStats = {
  handle: string;
  rating: number | null;
  maxRating: number | null;
  rank: string | null;
  maxRank: string | null;
};

const FALLBACK: CodeforcesStats = {
  handle: CODEFORCES_HANDLE,
  rating: null,
  maxRating: null,
  rank: "expert",
  maxRank: "expert",
};

export async function getCodeforcesStats(): Promise<CodeforcesStats> {
  try {
    const res = await fetch(
      `https://codeforces.com/api/user.info?handles=${CODEFORCES_HANDLE}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) throw new Error(`Codeforces API ${res.status}`);
    const json = await res.json();
    if (json.status !== "OK") throw new Error("Codeforces API error status");
    const user = json.result[0];
    return {
      handle: CODEFORCES_HANDLE,
      rating: user.rating ?? null,
      maxRating: user.maxRating ?? null,
      rank: user.rank ?? null,
      maxRank: user.maxRank ?? null,
    };
  } catch {
    return FALLBACK;
  }
}

export { CODEFORCES_HANDLE };
