"use client";

import { useEffect, useState } from "react";
import { LoadingLogo } from "./components/LoadingLogo";
import { remark } from "remark";
import html from "remark-html";

interface ProfileSummaryProps {
  data?: { outputEvents?: Array<{ profile?: string }> };
}

const ProfileSummary = ({ data }: ProfileSummaryProps) => {
  const profile = data?.outputEvents?.at(0)?.profile;
  const [markdown, setMarkdown] = useState("");
  useEffect(() => {
    if (!profile) return;
    remark()
      .use(html)
      .process(profile)
      .then((m) => setMarkdown(m.toString()));
  }, [profile]);
  if (profile) {
    return (
      <div
        className="bg-gray-200 p-8 rounded-2xl text-black"
        dangerouslySetInnerHTML={{ __html: markdown }}
      />
    );
  } else {
    return <div>Something did not work. 😅 Please try again. </div>;
  }
};

interface ResponseProps extends ProfileSummaryProps {
  status?: string;
}

const Response = (props: ResponseProps) => {
  const { status } = props;

  switch (status) {
    case "pending":
      return (
        <div className="text-violet-600">
          <LoadingLogo />
        </div>
      );
    case "ready":
      return <ProfileSummary {...props} />;
    default:
      return;
  }
};

export const FleakForm = () => {
  const [username, setUsername] = useState("");
  const [response, setResponse] = useState({});

  const onSubmit = () => {
    setResponse({ status: "pending" });
    fetch("/api/fleak", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    })
      .then((res) => res.json())
      .then((data) => {
        setResponse({ status: "ready", data });
      });
  };

  return (
    <div>
      <form
        className=" p-10 rounded-md flex flex-wrap"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          className="text-black bg-gray-200 rounded-full p-2 px-4 mr-2 mb-2 grow-[2]"
          placeholder="Enter reddit username"
          value={username}
          required
          onChange={(e) => setUsername(e.target.value)}
        />
        <button
          className="bg-[#FF4500] flex grow justify-center w-32 h-11 rounded-full	text-white font-bold items-center px-2"
          onClick={onSubmit}
        >
          Discover
        </button>
      </form>
      <div className="flex items-center justify-center p-4 max-w-[60ch]">
        <Response {...response} />
      </div>
    </div>
  );
};
