export const AVATAR_FALLBACK = "https://avatar.vercel.sh";
export const PROD = process.env.NODE_ENV === "production";

export const WEBAPP_URL = PROD
  ? "https://spek-alpha.netlify.app"
  : "http://localhost:3000";

export const API_URL = PROD
  ? "https://spek-latest.onrender.com"
  : "http://localhost:4001";
