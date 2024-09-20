"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
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

const SocialShareButtons = () => {
  const url = encodeURIComponent("https://reddit.fleak.ai");
  const title = encodeURIComponent(
    "Discover your Reddit personality with Fleak",
  );
  return (
    <div className="flex flex-col items-center mt-8 space-y-3">
      <div className="text-lg">Share it!</div>
      <div className="flex gap-6">
        <a
          href={`https://old.reddit.com/submit?url=${url}&title=${title}`}
          target="_blank"
        >
          <Image
            src="/reddit-button.svg"
            alt="Share on reddit"
            width={20}
            height={20}
          />
        </a>
        <a
          href={`https://x.com/intent/post?text=${title}&url=${url}`}
          target="_blank"
        >
          <Image src="/x-button.svg" alt="Share on x" width={20} height={20} />
        </a>
      </div>
    </div>
  );
};

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
      <div className="bg-[#E5EBEE] dark:bg-gray-400 p-8 py-16 rounded-2xl text-black">
        <div dangerouslySetInnerHTML={{ __html: markdown }} />
        <SocialShareButtons />
      </div>
    );
  } else {
    return <div>Something did not work. 😅 Please try again.</div>;
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
let retryNumber = 0;

const retry = ({
  onRetry,
  onGiveUp,
}: {
  onRetry: () => void;
  onGiveUp: () => void;
}) => {
  if (retryNumber < MAX_RETRIES) {
    retryNumber = retryNumber + 1;
    console.log("Retrying...");
    onRetry();
  } else {
    onGiveUp();
  }
};

export const FleakForm = () => {
  const [username, setUsername] = useState("");
  const [response, setResponse] = useState({});
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const hasErrors = errors.length !== 0;

  const onSubmit = () => {
    setButtonDisabled(true);
    setResponse({ status: "pending" });
    setErrors([]);
    fetch("/api/fleak", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    })
      .then((res) => {
        try {
          return res.json();
        } catch {
          return { errors: ["Something did not work. 😅 Please try again."] };
        }
      })
      .then((data) => {
        setButtonDisabled(false);
        if (data?.errors) {
          if (data.errors.includes("Workflow failed")) {
            retry({
              onRetry: onSubmit,
              onGiveUp: () =>
                setErrors(["Something did not work. 😅 Please try again."]),
            });
            return;
          }
          setResponse({});
          setErrors(data.errors);
          return;
        }
        const errors = parseWorkflowErrors(data);
        if (errors.length !== 0) {
          if (errors.includes("Request blocked")) {
            retry({
              onRetry: onSubmit,
              onGiveUp: () =>
                setErrors(["Something did not work. 😅 Please try again."]),
            });
            return;
          }
          setResponse({});
          setErrors(errors);
          return;
        }

        retryNumber = 0;
        setResponse({ status: "ready", data });
      });
  };

  return (
    <>
      <form
        className="rounded-md flex flex-wrap max-sm:gap-4 sm:gap-8"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="">
          <input
            className={`text-black bg-[#E5EBEE] rounded-full p-2 px-4 min-w-32 h-11 grow-[2]
              ${hasErrors ? "border-red-700 border-2" : ""}`}
            placeholder="Enter reddit username"
            value={username}
            onChange={(e) => {
              setButtonDisabled(false);
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
          disabled={buttonDisabled}
          className="bg-[#FF4500] flex justify-center w-40 pl-4 h-11 gap-x-2 rounded-full	text-white font-bold items-center px-2"
          onClick={onSubmit}
        >
          Discover{" "}
          {buttonDisabled ? (
            <Image
              src="/spinner.svg"
              alt="spinner"
              className="spinner"
              width={20}
              height={20}
            />
          ) : (
            <div className="size-5"></div>
          )}
        </button>
      </form>
      <div className="flex grow items-center justify-center p-4 max-w-[60ch]">
        <Response {...response} />
      </div>
    </>
  );
};
