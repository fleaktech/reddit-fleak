import { getEnvVar } from "./envVars";

const fetchRedditAccessToken = async () =>
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

let redditAccessToken: string | null = null;
let redditAccessTokenRetrivedAt: number | null = null;
const TokenDuration = 50 * 60 * 1000; // 50 mins

export const getRedditAccessToken = async () => {
  if (
    redditAccessTokenRetrivedAt &&
    redditAccessToken &&
    Date.now() - redditAccessTokenRetrivedAt < TokenDuration
  ) {
    return redditAccessToken;
  } else {
    const { access_token } = await fetchRedditAccessToken();
    redditAccessToken = access_token;
    redditAccessTokenRetrivedAt = Date.now();
    return access_token;
  }
};
