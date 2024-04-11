import fetch from "isomorphic-fetch";
import { User } from "../entities";

const apiUrl = "https://api.spek.app";

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
  sendFile: (endpoint: Endpoint, formData: FormData) => Promise<any>;
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
        })
          .then((resp) => resp.json())
          .catch((err) => console.log(err));
      };

      const data = await apiSend("/user/me", "GET")
        .then((user: any) => user)
        .catch((err) => {
          reject(err);
        });

      const connection: Connection = {
        user: data.user,
        send: apiSend,
        sendFile: async (endpoint: string, formData: FormData) => {
          return await fetch(`${url}${endpoint}`, {
            method: "POST",
            headers: {
              "Content-Type": "multipart/form-data",
              "X-Access-Token": token,
              "X-Refresh-Token": refreshToken,
            },
            body: formData,
          })
            .then((resp) => resp.json())
            .catch((err) => console.log(err));
        },
      };

      return resolve(connection);
    })();
  });
