import classnames from "classnames";
import useTranslation from "next-translate/useTranslation";
import { useEffect, useRef, useState } from "react";

export default function Select({
  disabled = false,
  hint = "",
  id,
  label,
  onChange,
  options,
  value,
}) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((option) => option.id === value);

  return (
    <div ref={containerRef} className="relative flex flex-col">
      {label && <span className="mb-1">{label}</span>}
      <button
        type="button"
        id={id}
        aria-label={id}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        disabled={disabled}
        onClick={() => setIsOpen((open) => !open)}
        className={classnames([
          "flex items-center justify-between w-full text-gray-800 bg-white border-2 border-gray-200 rounded-lg shadow-sm text-sm sm:text-base font-semibold cursor-pointer",
          "pl-2 pr-1 py-1 my-1 ml-0 mr-0 sm:pl-3 sm:pr-2 sm:py-2 sm:mr-2 md:m-2",
          "focus:border-red-500 focus:outline-none focus:shadow-md hover:border-red-300",
          "duration-150 ease-in-out transition",
          "disabled:opacity-50 disabled:cursor-not-allowed",
        ])}
      >
        <span>
          {selectedOption
            ? selectedOption.name
            : t("common:select-empty-option")}
        </span>
        <span
          className={`flex-shrink-0 flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-red-100 text-red-600 ml-1 sm:ml-2 transform transition-transform duration-150 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <svg
            className="fill-current h-3 w-3"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </span>
      </button>

      {isOpen && (
        <ul
          role="listbox"
          className="absolute z-40 top-full right-0 mt-1 min-w-full bg-white border-2 border-gray-200 rounded-lg shadow-2xl overflow-hidden py-1"
          style={{ maxWidth: "calc(100vw - 2rem)" }}
        >
          {options.map((option) => (
            <li key={option.id} role="option" aria-selected={option.id === value}>
              <button
                type="button"
                onClick={() => {
                  onChange && onChange(option.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm sm:text-base font-medium whitespace-nowrap transition duration-100 ${
                  option.id === value
                    ? "bg-red-50 text-red-600 font-bold"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {option.name}
              </button>
            </li>
          ))}
        </ul>
      )}

      {hint && (
        <p className="italic mt-1 text-gray-800 text-xs md:text-sm">{hint}</p>
      )}
    </div>
  );
}
