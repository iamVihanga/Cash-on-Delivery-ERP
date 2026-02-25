import rpc from "core/rpc";
import { getCookies } from "cookies-next/client";

export const getClient = async () => {
  const cookieStore = getCookies();

  let cookiesList;

  if (cookieStore) {
    cookiesList = Object.entries(cookieStore)
      .map(([name, value]) => `${name}=${value}`)
      .join("; ");
  } else {
    cookiesList = "";
  }

  return rpc(process.env.NEXT_PUBLIC_BACKEND_URL!, {
    headers: {
      cookie: cookiesList
    },
    fetch: (input: string | URL | Request, init?: RequestInit) => {
      return fetch(input, {
        ...init,
        credentials: "include" // Ensure cookies are sent with requests
      });
    }
  });
};
