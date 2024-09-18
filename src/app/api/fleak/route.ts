import { NextResponse, NextRequest } from "next/server";
import { getEnvVar } from "./envVars";

export async function POST(request: NextRequest) {
  const { username } = await request.json();
  if (!username) {
    return NextResponse.json(
      { error: "Username is required" },
      { status: 400 },
    );
  }
  console.log("requested username: ", username);
  try {
    const response = await fetch(getEnvVar("FLEAK_ENDPOINT"), {
      method: "POST",
      headers: {
        "api-key": getEnvVar("FLEAK_API_KEY"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify([{ username }]),
    });
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 },
    );
  }
}
