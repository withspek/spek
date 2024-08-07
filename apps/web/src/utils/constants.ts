export const prod = process.env.NODE_ENV === "production";
export const loginNextPathKey = "@spek/next-path";

export const isServer = typeof window == "undefined";
export const baseUrl = !prod
  ? "http://localhost:3000"
  : "https://spek-alpha.netlify.app";
