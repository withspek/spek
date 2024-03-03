export const prod = process.env.NODE_ENV === "production";

export const apiUrl = !prod ? "http://localhost:4001" : "https://api.spek.app";
export const isServer = typeof window == "undefined";
