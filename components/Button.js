import classnames from "classnames";
import React, { MouseEvent, ReactNode } from "react";

const BUTTON_COLORS = {
  green: ["bg-green-600", "hover:bg-green-500", "focus:bg-green-500", "text-white"],
  red: ["bg-red-600", "hover:bg-red-500", "focus:bg-red-500", "text-white"],
  yellow: ["bg-yellow-400", "hover:bg-yellow-300", "focus:bg-yellow-300", "text-yellow-900"],
  gray: ["bg-gray-600", "hover:bg-gray-500", "focus:bg-gray-500", "text-white"],
};

export default function Button({
  ariaLabel,
  children,
  className,
  color = "yellow",
  disabled,
  onClick,
  onBlur,
  type = "button",
}) {
  return (
    <button
      type={type}
      aria-label={ariaLabel}
      className={classnames([
        "w-full font-bold h-12 px-4 py-2 rounded-lg text-center uppercase tracking-wide",
        "shadow-md hover:shadow-lg",
        "focus:outline-none focus:shadow-outline",
        "transform hover:-translate-y-1 active:translate-y-0",
        "duration-150 ease-in-out transition",
        "disabled:opacity-50 disabled:shadow-none disabled:transform-none disabled:cursor-not-allowed",
        [...BUTTON_COLORS[color]],
        className,
      ])}
      disabled={disabled}
      onClick={onClick}
      onBlur={onBlur}
    >
      <span className="flex items-center justify-center w-full">
        {children}
      </span>
    </button>
  );
}
