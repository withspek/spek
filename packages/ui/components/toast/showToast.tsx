import { classNames } from "@spek/lib";

import type { ToastOptions, Toast } from "react-hot-toast";
import toast from "react-hot-toast";

import { Icon } from "../..";

type IToast = {
  message: string;
  toastVisible: boolean;
  toastId: string;
  onClose: (toastId: string) => void;
};

export const SuccessToast = ({
  message,
  onClose,
  toastId,
  toastVisible,
}: IToast) => (
  <button
    className={classNames(
      "data-testid-toast-success bg-green-100 text-green-900 mb-2 flex h-auto space-x-2 rounded-md p-3 text-sm font-semibold shadow-md rtl:space-x-reverse md:max-w-sm",
      toastVisible && "animate-fade-in-up cursor-pointer"
    )}
    onClick={() => onClose(toastId)}
  >
    <span className="mt-0.5">
      <Icon name="check" className="h-4 w-4" />
    </span>
    <span data-testid="toast-success" className="text-left">
      {message}
    </span>
  </button>
);

export const ErrorToast = ({
  message,
  onClose,
  toastId,
  toastVisible,
}: IToast) => (
  <button
    className={classNames(
      "bg-red-100 text-red-900 mb-2 flex h-auto space-x-2 rounded-md p-3 text-sm font-semibold shadow-md rtl:space-x-reverse md:max-w-sm",
      toastVisible && "animate-fade-in-up cursor-pointer"
    )}
    onClick={() => onClose(toastId)}
  >
    <span className="mt-0.5">
      <Icon name="info" className="h-4 w-4" />
    </span>
    <span data-testid="toast-error" className="text-left">
      {message}
    </span>
  </button>
);

export const WarningToast = ({
  message,
  onClose,
  toastId,
  toastVisible,
}: IToast) => (
  <button
    className={classNames(
      "bg-accent-hover text-primary-900 mb-2 flex h-auto space-x-2 rounded-md p-3 text-sm font-semibold shadow-md rtl:space-x-reverse md:max-w-sm",
      toastVisible && "animate-fade-in-up cursor-pointer"
    )}
    onClick={() => onClose(toastId)}
  >
    <span className="mt-0.5">
      <Icon name="info" className="h-4 w-4" />
    </span>
    <span data-testid="toast-warning" className="text-left">
      {message}
    </span>
  </button>
);

export const DefaultToast = ({
  message,
  onClose,
  toastId,
  toastVisible,
}: IToast) => (
  <button
    className={classNames(
      "bg-primary-800 text-primary-200 mb-2 flex h-auto space-x-2 rounded-md p-3 text-sm font-semibold shadow-md rtl:space-x-reverse md:max-w-sm",
      toastVisible && "animate-fade-in-up cursor-pointer"
    )}
    onClick={() => onClose(toastId)}
  >
    <span className="mt-0.5">
      <Icon name="check" className="h-4 w-4" />
    </span>
    <span data-testid="toast-default" className="text-left">
      {message}
    </span>
  </button>
);

const TOAST_VISIBLE_DURATION = 6000;

type ToastVariants = "success" | "warning" | "error";

export function showToast(
  message: string,
  variant: ToastVariants,
  // Options or duration (duration for backward compatability reasons)
  options: number | ToastOptions = TOAST_VISIBLE_DURATION
) {
  //
  const _options: ToastOptions =
    typeof options == "number" ? { duration: options } : options;

  if (!_options.duration) _options.duration = TOAST_VISIBLE_DURATION;
  if (!_options.position) _options.position = "bottom-right";

  const onClose = (toastId: string) => {
    toast.remove(toastId);
  };

  const toastElements: { [x in ToastVariants]: (t: Toast) => JSX.Element } = {
    success: (t) => (
      <SuccessToast
        message={message}
        toastVisible={t.visible}
        onClose={onClose}
        toastId={t.id}
      />
    ),
    warning: (t) => (
      <WarningToast
        message={message}
        toastVisible={t.visible}
        onClose={onClose}
        toastId={t.id}
      />
    ),
    error: (t) => (
      <ErrorToast
        message={message}
        toastVisible={t.visible}
        onClose={onClose}
        toastId={t.id}
      />
    ),
  };

  return toast.custom(
    toastElements[variant] ||
      ((t) => (
        <DefaultToast
          message={message}
          toastVisible={t.visible}
          onClose={onClose}
          toastId={t.id}
        />
      )),
    _options
  );
}
