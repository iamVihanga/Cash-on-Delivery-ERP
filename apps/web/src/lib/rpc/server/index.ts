import rpc from "core/rpc";
import { cookies } from "next/headers";

export const getClient = async () => {
  const cookiesStore = await cookies();

  const cookiesList = cookiesStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  return rpc(process.env.NEXT_PUBLIC_BACKEND_URL!, {
    headers: {
      cookie: cookiesList
    }
  });
};
