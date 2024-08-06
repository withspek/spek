export const AVATAR_FALLBACK = "https://avatar.vercel.sh";
export const PROD = process.env.NODE_ENV === "production";

export const WEBAPP_URL = PROD
  ? "https://spek-alpha.netlify.app"
  : "http://localhost:3000";

export const API_URL = PROD ? "16.171.14.61.nip.io" : "http://localhost:4001";
