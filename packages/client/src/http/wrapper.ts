import fetch from "isomorphic-fetch";
import { User } from "../entities";

const apiUrl = "https://api.speck.app";

type Endpoint = string;
type Token = string;

export type Connection = {
  user: User;
  send: (
    endpoint: Endpoint,
    method: string,
    body?: unknown,
    opts?: unknown
  ) => Promise<any>;
  //   fetch: (endpoint: Endpoint, body?: unknown) => Promise<unknown>;
};

export const connect = (
  token: Token,
  refreshToken: Token,
  {
    url = apiUrl,
  }: {
    url?: string;
  }
): Promise<Connection> =>
  new Promise((resolve, reject) => {
    (async () => {
      const apiSend = async (
        endpoint: Endpoint,
        method: string,
        body?: unknown
      ) => {
        return await fetch(`${url}${endpoint}`, {
          method,
          headers: {
            "Content-Type": "application/json",
            "X-Access-Token": token,
            "X-Refresh-Token": refreshToken,
          },
          body: body ? JSON.stringify(body) : undefined,
        });
      };

      const user = await apiSend("/user/me", "GET")
        .then(async (resp) => await resp.json())
        .catch((err) => {
          reject(err);
        });

      const connection: Connection = {
        user,
        send: apiSend,
      };

      return resolve(connection);
    })();
  });
