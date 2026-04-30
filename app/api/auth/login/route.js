import { readJson } from "@/lib/api-utils";
import { toErrorResponse } from "@/lib/errors";
import { loginUser } from "@/lib/repositories/user-repository";

export async function POST(request) {
  try {
    const body = await readJson(request);
    const user = await loginUser(body.email, body.password);
    return Response.json({ user });
  } catch (error) {
    return toErrorResponse(error);
  }
}
