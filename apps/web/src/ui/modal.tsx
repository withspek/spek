"use client";

import { PlusIcon } from "@/icons";
import React from "react";
import ReactModal from "react-modal";

const customStyles = {
  default: {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      zIndex: 1000,
    },
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      borderRadius: 8,
      padding: "40px 40px 40px 40px",
      transform: "translate(-50%, -50%)",
      backgroundColor: "var(--alabaster-800)",
      border: "none",
      maxHeight: "80vh",
      width: "90%",
      maxWidth: 530,
    },
  },
  search: {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      zIndex: 1000,
    },
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      borderRadius: 8,
      padding: "10px 25px 10px 25px",
      transform: "translate(-50%, -50%)",
      backgroundColor: "var(--alabaster-800)",
      border: "none",
      maxHeight: "80vh",
      width: "90%",
      maxWidth: 640,
    },
  },
  userPreview: {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      zIndex: 1000,
    },
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      borderRadius: 8,
      padding: 0,
      transform: "translate(-50%, -50%)",
      backgroundColor: "var(--alabaster-900)",
      border: "none",
      maxHeight: "80vh",
      width: "90%",
      maxWidth: 435,
    },
  },
};
export const Modal: React.FC<
  ReactModal["props"] & { variant?: keyof typeof customStyles }
> = ({ children, variant = "default", ...props }) => {
  const onKeyDown = (event: React.KeyboardEvent) => {
    const currentActive = document.activeElement;

    if (event.key === "ArrowLeft") {
      (currentActive?.previousElementSibling as HTMLElement)?.focus();
    } else if (event.key === "ArrowRight") {
      (currentActive?.nextElementSibling as HTMLElement)?.focus();
    }
  };

  return (
    <ReactModal
      shouldCloseOnEsc
      shouldFocusAfterRender
      style={customStyles[variant]}
      {...props}
    >
      <div className={`flex flex-col w-full`}>
        {variant != "search" && (
          <div className={`flex justify-end absolute right-3 top-3`}>
            <button
              className={`p-1 text-alabaster-100`}
              onClick={(e) => props?.onRequestClose?.(e)}
              data-testid="close-modal"
            >
              <PlusIcon className="rotate-45 transform" />
            </button>
          </div>
        )}
        <div
          tabIndex={-1}
          className={`focus:outline-none`}
          onKeyDown={onKeyDown}
        >
          {children}
        </div>
      </div>
    </ReactModal>
  );
};
