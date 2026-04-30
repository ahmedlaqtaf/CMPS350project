import { readJson } from "@/lib/api-utils";
import { toErrorResponse } from "@/lib/errors";
import { registerUser } from "@/lib/repositories/user-repository";

export async function POST(request) {
  try {
    const body = await readJson(request);
    const user = await registerUser(body);
    return Response.json({ user }, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
