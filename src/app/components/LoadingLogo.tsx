import { type AnimationProps, motion } from "framer-motion";

// https://easings.net/#easeInOutQuad
function easeInOutQuad(x: number): number {
  return x < 0.5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2;
}

const transitionConfig = {
  repeat: Infinity,
  repeatType: "reverse",
  duration: 0.5,
  ease: easeInOutQuad,
} satisfies AnimationProps["transition"];

export const LoadingLogo = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className="fill-primary"
  >
    <motion.path
      animate={{ x: -5 }}
      transition={transitionConfig}
      d="M8.00002 8V4H27.3334V8H8.00002Z"
    />
    <motion.path
      animate={{ x: 5 }}
      transition={transitionConfig}
      d="M4.66669 18V13.8614H22V18H4.66669Z"
    />
    <motion.path
      animate={{ x: -3 }}
      transition={transitionConfig}
      d="M7.88291 28V23.8614L12 23.8614V28H7.88291Z"
    />
  </svg>
);
