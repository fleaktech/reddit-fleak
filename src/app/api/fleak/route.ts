import { NextResponse, NextRequest } from "next/server";

const getEnvVar = (name: string): string => {
  const value = process.env[name];

  if (typeof value === "undefined") {
    throw new Error(`${name} environment variable is not set`);
  }
  return value;
};

const getRedditAccessToken = async () =>
  fetch("https://www.reddit.com/api/v1/access_token", {
    method: "POST",
    headers: {
      Authorization:
        "Basic " +
        btoa(
          getEnvVar("REDDIT_CLIENT_ID") +
            ":" +
            getEnvVar("REDDIT_CLIENT_SECRET"),
        ),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  }).then((resp) => resp.json());

export async function POST(request: NextRequest) {
  const { username } = await request.json();
  const { access_token } = await getRedditAccessToken();
  if (!username) {
    return NextResponse.json(
      { error: "Username is required" },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(getEnvVar("FLEAK_ENDPOINT"), {
      method: "POST",
      headers: {
        "api-key": getEnvVar("FLEAK_API_KEY"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify([{ username, redditAccessToken: access_token }]),
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
