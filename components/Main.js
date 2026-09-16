import classnames from "classnames";
const MAIN_COLORS = {
  green: "bg-green-900",
  gray: "bg-gray-900",
};
const JUSTIFY = {
  start: "",
  center: "justify-center",
};

// The whole board is sized in rem so it scales to fit the screen without
// scrolling. Deriving that scale from height alone ignores width, and
// phones are much narrower relative to their height than the desktop
// windows this was tuned for - so the board rendered oversized for the
// available width and overflowed sideways. Taking the smaller of a
// height-based and a width-based scale (clamped to a readable range) keeps
// it bounded by whichever dimension is tightest.
const MIN_FONT_SIZE_PX = 11;
const MAX_FONT_SIZE_PX = 22;
const WIDTH_REM_BUDGET = 24;
const RESIZE_DEBOUNCE_MS = 100;

let resizeTimer;

function setViewportHeight() {
  // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
  let vh = window.innerHeight * 0.01;
  // Then we set the value in the --vh custom property to the root of the document
  document.documentElement.style.setProperty("--vh", `${vh}px`);

  const heightBasedSize = vh * 2;
  const widthBasedSize = window.innerWidth / WIDTH_REM_BUDGET;
  const fontSize = Math.min(
    MAX_FONT_SIZE_PX,
    Math.max(MIN_FONT_SIZE_PX, Math.min(heightBasedSize, widthBasedSize))
  );

  document.documentElement.style.setProperty("font-size", `${fontSize}px`);
}

if (typeof window !== "undefined") {
  // Debounced - mobile browsers fire "resize" repeatedly while the URL bar
  // collapses/expands during scroll, and recalculating on every tick made
  // the whole page visibly jump in size.
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(setViewportHeight, RESIZE_DEBOUNCE_MS);
  });
  setViewportHeight();
}

export default function Main({ children, color = "gray", justify = "start" }) {
  const className = classnames([
    "flex flex-col height-screen",
    MAIN_COLORS[color],
    JUSTIFY[justify],
  ]);

  return <main className={className}>{children}</main>;
}
