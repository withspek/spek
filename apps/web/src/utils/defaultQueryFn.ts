import { API_URL } from "@spek/lib/constants";

import { useTokenStore } from "@/stores/useTokenStore";

export const defaultQueryFn = async ({ queryKey }: { queryKey: string }) => {
  const { accessToken, refreshToken } = useTokenStore.getState();

  const resp = await fetch(`${API_URL}/${queryKey}`, {
    headers: {
      "X-Access-Token": accessToken,
      "X-Refresh-Token": refreshToken,
    },
    next: { revalidate: 3600 },
  });

  if (resp.status !== 200) {
    throw new Error(await resp.text());
  }

  const _accessToken = resp.headers.get("access-token");
  const _refreshToken = resp.headers.get("refresh-token");

  if (_accessToken && _refreshToken) {
    useTokenStore.getState().setTokens({
      accessToken: _accessToken,
      refreshToken: _refreshToken,
    });
  }

  return await resp.json();
};
