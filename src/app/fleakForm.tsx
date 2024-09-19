"use client";

import { useEffect, useState } from "react";
import { LoadingLogo } from "./components/LoadingLogo";
import { remark } from "remark";
import html from "remark-html";

const parseWorkflowErrors = ({
  trace,
}: {
  trace: Array<{ errors: Array<{ errorMessage: string }> }>;
}): string[] =>
  trace.flatMap(({ errors }) =>
    errors.flatMap(({ errorMessage }) => {
      try {
        return JSON.parse(errorMessage).errorMessage;
      } catch {
        return [errorMessage];
      }
    }),
  );

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

const MAX_RETRIES = 3;

export const FleakForm = () => {
  const [username, setUsername] = useState("");
  const [response, setResponse] = useState({});
  const [errors, setErrors] = useState<string[]>([]);
  const [retryNumber, setRetryNumber] = useState(0);
  const hasErrors = errors.length !== 0;

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
        if (data?.errors) {
          setResponse({});
          setErrors(data.errors);
          return;
        }
        const errors = parseWorkflowErrors(data);
        if (errors.length !== 0) {
          if (retryNumber < MAX_RETRIES && errors.includes("Request blocked")) {
            setRetryNumber(retryNumber + 1);
            console.log("Request blocked. Retrying...");
            onSubmit();
            return;
          }

          setResponse({});
          setErrors(errors);
          return;
        }

        setResponse({ status: "ready", data });
      });
  };

  return (
    <div>
      <form
        className=" p-10 rounded-md flex flex-wrap"
        onSubmit={(e) => e.preventDefault()}
      >
        <div>
          <input
            className={`text-black bg-gray-200 rounded-full p-2 px-4 mr-2 mb-2 grow-[2]
              ${hasErrors ? "border-red-700 border-2" : ""}`}
            placeholder="Enter reddit username"
            value={username}
            onChange={(e) => {
              if (errors) {
                setErrors([]);
              }
              setUsername(e.target.value);
            }}
          />
          {hasErrors && (
            <div className="text-red-700 pl-2 max-w-[14rem]">
              {errors.map((error: string) => (
                <div key={error}>{error}</div>
              ))}
            </div>
          )}
        </div>
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
