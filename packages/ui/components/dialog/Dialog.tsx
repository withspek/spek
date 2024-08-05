"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { ForwardRefExoticComponent, useState } from "react";

import { Button, ButtonProps, Icon, IconName } from "../..";
import { classNames } from "@spek/lib";

export type DialogProps = React.ComponentProps<
  (typeof DialogPrimitive)["Root"]
> & {
  name?: string;
  clearQueryParamsOnClose?: string[];
};

const enum DIALOG_STATE {
  // Dialog is there in the DOM but not visible
  CLOSED = "CLOSED",
  //   State from the time b/w the Dialog is dismissed and the time the "dialog" query param is removed from the URL
  CLOSING = "CLOSING",
  // Dialog is visible
  OPEN = "OPEN",
}

export function Dialog(props: DialogProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const newSearchParams = new URLSearchParams(searchParams ?? undefined);
  const { children, name, ...dialogProps } = props;

  //   only used if name is set
  const [dialogState, setDialogState] = useState(
    dialogProps.open ? DIALOG_STATE.OPEN : DIALOG_STATE.CLOSED
  );
  const shouldOpenDialog = newSearchParams.get("dialog") === name;

  if (name) {
    const clearQueryParamsOnClose = [
      "dialog",
      ...(props.clearQueryParamsOnClose || []),
    ];
    dialogProps.onOpenChange = (open) => {
      if (props.onOpenChange) {
        props.onOpenChange(open);
      }

      //   toggles "dialog" query param
      if (open) {
        newSearchParams.set("dialog", name);
      } else {
        clearQueryParamsOnClose.forEach((queryParam) => {
          newSearchParams.delete(queryParam);
        });
        router.push(`${pathname}?${newSearchParams.toString()}`);
      }
      setDialogState(open ? DIALOG_STATE.OPEN : DIALOG_STATE.CLOSING);
    };

    if (dialogState === DIALOG_STATE.CLOSED && shouldOpenDialog) {
      setDialogState(DIALOG_STATE.OPEN);
    }

    if (dialogState === DIALOG_STATE.CLOSING && !shouldOpenDialog) {
      setDialogState(DIALOG_STATE.CLOSED);
    }

    if (dialogState === DIALOG_STATE.CLOSING && !shouldOpenDialog) {
      setDialogState(DIALOG_STATE.CLOSED);
    }

    // allow overriding
    if (!("open" in dialogProps)) {
      dialogProps.open = dialogState === DIALOG_STATE.OPEN ? true : false;
    }
  }

  return (
    <DialogPrimitive.Root {...dialogProps}>{children}</DialogPrimitive.Root>
  );
}

type DialogContentProps = React.ComponentProps<
  (typeof DialogPrimitive)["Content"]
> & {
  size?: "xl" | "lg" | "md";
  type?: "creation" | "confirmation";
  title?: string;
  description?: string | JSX.Element | null;
  closeText?: string;
  actionDisabled?: boolean;
  Icon?: IconName;
  enableOverflow?: boolean;
};

// enableOverflow: -use this prop whenever content inside DialogContent could overflow and scrollbar
export const DialogContent = React.forwardRef<
  HTMLDivElement,
  DialogContentProps
>(
  (
    {
      children,
      title,
      Icon: icon,
      enableOverflow,
      type = "creation",
      ...props
    },
    forwardedRef
  ) => {
    return (
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fadeIn fixed inset-0 bg-black/70 transition-opacity" />
        <DialogPrimitive.Content
          {...props}
          className={classNames(
            "fadeIn bg-primary-900 scroll-bar fixed left-1/2 top-1/2 z-50 w-full  max-w-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-md text-left shadow-xl focus-visible:outline-none sm:align-middle",
            props.size == "xl"
              ? "px-8 pt-8 sm:max-w-[90rem]"
              : props.size == "lg"
                ? "px-8 pt-8 sm:max-w-[70rem]"
                : props.size == "md"
                  ? "px-8 pt-8 sm:max-w-[48rem]"
                  : "px-8 pt-8 sm:max-w-[35rem]",
            "max-h-[95vh]",
            enableOverflow ? "overflow-auto" : "overflow-visible",
            `${props.className || ""}`
          )}
          ref={forwardedRef}
        >
          {type === "creation" && (
            <div>
              <DialogHeader title={title} subtitle={props.description} />
              <div data-testid="dialog-creation" className="flex flex-col">
                {children}
              </div>
            </div>
          )}
          {type === "confirmation" && (
            <div className="flex">
              {icon && (
                <div className="bg-emphasis flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full">
                  <Icon name={icon} className="text-emphasis h-4 w-4" />
                </div>
              )}
              <div className="ml-4 flex-grow">
                <DialogHeader title={title} subtitle={props.description} />
                <div data-testid="dialog-confirmation">{children}</div>
              </div>
            </div>
          )}
          {!type && children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    );
  }
);

type DialogHeaderProps = {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

export function DialogHeader(props: DialogHeaderProps) {
  if (!props.title) return null;

  return (
    <div className="mb-4">
      <DialogTitle className="leading-20 font-semibold text-primary-100 pb-1 text-xl">
        {props.title}
      </DialogTitle>
      {props.subtitle && (
        <p className="text-primary-300 text-sm">{props.subtitle}</p>
      )}
    </div>
  );
}

type DialogFooterProps = {
  children: React.ReactNode;
  showDivider?: boolean;
  noSticky?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export function DialogFooter(props: DialogFooterProps) {
  return (
    <div>
      {props.showDivider && ( // TODO: the -mx-8 is causing oveflow in the dialog buttons
        <hr className="border-primary-700 -mx-8" />
      )}
      <div
        className={classNames(
          "flex justify-end space-x-2 pb-4 pt-4 rtl:space-x-reverse",
          !props.showDivider && "pb-8"
        )}
      >
        {props.children}
      </div>
    </div>
  );
}

DialogContent.displayName = "DialogContent";

export const DialogTrigger: ForwardRefExoticComponent<
  DialogPrimitive.DialogTriggerProps & React.RefAttributes<HTMLButtonElement>
> = React.forwardRef((props, ref) => {
  return <DialogPrimitive.Trigger {...props} ref={ref} />;
});

DialogTrigger.displayName = "DialogTrigger";

export const DialogTitle: React.FC<DialogPrimitive.DialogTitleProps> = ({
  children,
  ...props
}) => {
  return <DialogPrimitive.Title {...props}>{children}</DialogPrimitive.Title>;
};

DialogTitle.displayName = "DialogTitle";

type DialogCloseProps = {
  dialogCloseProps?: React.ComponentProps<(typeof DialogPrimitive)["Close"]>;
  children?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  disabled?: boolean;
  color?: ButtonProps["color"];
} & React.ComponentProps<typeof Button>;

export function DialogClose(props: DialogCloseProps) {
  return (
    <DialogPrimitive.Close asChild {...props.dialogCloseProps}>
      <Button {...props} color={props.color || "minimal"}>
        {props.children ? props.children : "Close"}
      </Button>
    </DialogPrimitive.Close>
  );
}
