import { NextResponse, NextRequest } from "next/server";
import { getEnvVar } from "./envVars";
import { z } from "zod";

const FormSchema = z.object({
  username: z.string().trim().min(1).max(200),
});

export async function POST(request: NextRequest) {
  const { data, success, error } = FormSchema.safeParse(await request.json());
  if (!success && error) {
    return NextResponse.json(
      { errors: error?.errors?.flatMap(({ message }) => message) },
      { status: 400 },
    );
  }
  const { username } = data;
  console.log("requested username: ", username);
  const response = await fetch(
    `${getEnvVar("FLEAK_ENDPOINT")}?includeErrorByStep=true`,
    {
      method: "POST",
      headers: {
        "api-key": getEnvVar("FLEAK_API_KEY"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify([{ username }]),
    },
  );
  return NextResponse.json(await response.json());
}
