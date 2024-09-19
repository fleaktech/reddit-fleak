/* global fetch */
/* global btoa */
export const handler = async ({ username }, context) => {
  const { access_token } = await fetch(
    "https://www.reddit.com/api/v1/access_token",
    {
      method: "POST",
      headers: {
        Authorization:
          "Basic " +
          btoa(
            process.env.REDDIT_CLIENT_ID +
              ":" +
              process.env.REDDIT_CLIENT_SECRET,
          ),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    },
  ).then((resp) => resp.json());

  const response = await fetch(
    `https://oauth.reddit.com/user/${username}/submitted`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `bearer ${access_token}`,
        "User-Agent": "nodejs:fleak_ai_dev_webapp/v0.0.1 (by /u/piotr_fleak)",
      },
    },
  );

  const { status } = response;

  if (status === 404) {
    throw new Error("Username not found");
  } else if (status === 403) {
    throw new Error("Request blocked");
  }

  return {
    status,
    body: await response.json(),
  };
};
