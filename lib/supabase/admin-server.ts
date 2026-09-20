import { NextRequest } from "next/server";
import { getAuthUser } from "./auth-server";
import { accessTokenFrom } from "./data-server";

type AuthUser = {
  id?: string;
  email?: string;
  app_metadata?: {
    role?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

export async function getAdminContext(request: NextRequest) {
  const accessToken = accessTokenFrom(request);
  if (!accessToken) return null;

  const result = await getAuthUser(accessToken);
  if (!result.response.ok) return null;

  const user = result.payload as AuthUser;
  if (user.app_metadata?.role !== "admin" || !user.id) return null;

  return { accessToken, user };
}
