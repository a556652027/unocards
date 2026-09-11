import React from "react";
import ReactModal from "react-modal";
import classnames from "classnames";

ReactModal.setAppElement("#__next");

export default function Modal({ children, title, ...rest }) {
  return (
    <ReactModal {...rest}>
      <div className="bg-white p-4 rounded-lg shadow-2xl modal-pop-in">
        <div className="flex items-start justify-between mb-4 pb-3 border-b-2 border-red-100 text-lg md:text-xl text-center">
          <div className="flex justify-center w-full">
            <h1 className="text-red-600 text-lg font-extrabold text-center">
              {title}
            </h1>
          </div>
          <button
            onClick={rest.onRequestClose}
            aria-label="close"
            className={classnames([
              "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
              "text-gray-500 hover:text-white hover:bg-red-500 bg-gray-100",
              "focus:outline-none focus:shadow-outline",
              "duration-150 ease-in-out transition",
            ])}
          >
            <svg
              className="w-4 h-4 fill-current"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </ReactModal>
  );
}
