import { NextResponse } from "next/server";

const getRedditAccessToken = async () =>
  fetch("https://www.reddit.com/api/v1/access_token", {
    method: "POST",
    headers: {
      Authorization:
        "Basic " +
        btoa(
          process.env.REDDIT_CLIENT_ID + ":" + process.env.REDDIT_CLIENT_SECRET,
        ),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  }).then((resp) => resp.json());

export async function POST(request) {
  const { username } = await request.json();
  const { access_token } = await getRedditAccessToken();
  if (!username) {
    return NextResponse.json(
      { error: "Username is required" },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(process.env.FLEAK_ENDPOINT, {
      method: "POST",
      headers: {
        "api-key": process.env.FLEAK_API_KEY,
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
