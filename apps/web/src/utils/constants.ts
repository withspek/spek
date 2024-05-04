export const prod = process.env.NODE_ENV === "production";
export const loginNextPathKey = "@spek/next-path";
export const apiUrl = !prod
  ? "http://localhost:4001"
  : "https://spek-latest.onrender.com";
export const isServer = typeof window == "undefined";
export const baseUrl = !prod
  ? "http://localhost:3000"
  : "https://spek.vercel.app";
