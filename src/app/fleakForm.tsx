"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { LoadingLogo } from "./components/LoadingLogo";
import { remark } from "remark";
import html from "remark-html";

const ProfileSummary = ({ data }) => {
  const profile = data?.outputEvents?.at(0)?.profile;
  const [markdown, setMarkdown] = useState("");
  useEffect(() => {
    if (!profile) return;
    remark()
      .use(html)
      .process(profile)
      .then((m) => setMarkdown(m.toString()));
  }, [profile]);
  return <div dangerouslySetInnerHTML={{ __html: markdown }} />;
};

const Response = (props) => {
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
        className="dark:bg-slate-900 bg-slate-50 p-10 rounded-md shadow-lg flex flex-wrap"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          className="text-black border-slate-200 border-2 rounded-md p-2 mr-2 mb-2"
          placeholder="Enter reddit username"
          value={username}
          required
          onChange={(e) => setUsername(e.target.value)}
        />
        <button
          className="bg-violet-600 flex w-30 h-11 rounded-md text-white font-bold items-center px-2"
          onClick={onSubmit}
        >
          <Image
            src="/fleak-logo.svg"
            alt="Fleak Logo"
            width={30}
            height={30}
          />
          Call Fleak!
        </button>
      </form>
      <div className="flex items-center justify-center p-4 max-w-[60ch]">
        <Response {...response} />
      </div>
    </div>
  );
};
