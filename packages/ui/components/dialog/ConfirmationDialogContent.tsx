import * as DialogPrimitive from "@radix-ui/react-dialog";
import { PropsWithChildren } from "react";

import { DialogClose, DialogContent, Icon } from "../..";

type ConfirmBtnType =
  | { confirmBtn?: never; confirmBtnText?: string }
  | { confirmBtnText?: never; confirmBtn?: React.ReactElement };

export type ConfirmationDialogContentProps = {
  cancelBtnText?: string;
  isPending?: boolean;
  loadingText?: string;
  onConfirm?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  title: string;
  variety?: "danger" | "warning" | "success";
} & ConfirmBtnType;

export function ConfirmationDialogContent(
  props: PropsWithChildren<ConfirmationDialogContentProps>
) {
  return (
    <DialogContent>
      <ConfirmationContent {...props} />
    </DialogContent>
  );
}

export const ConfirmationContent = (
  props: PropsWithChildren<ConfirmationDialogContentProps>
) => {
  const {
    variety,
    title,
    cancelBtnText = "Cancel",
    children,
    confirmBtn,
    confirmBtnText = "Confirm",
    isPending,
    loadingText = "Loading...",
    onConfirm,
  } = props;

  return (
    <>
      <div className="flex">
        {variety && (
          <div className="mt-0.5 ltr:mr-3">
            {variety === "danger" && (
              <div className="bg-red-100 mx-auto rounded-full p-2 text-center">
                <Icon name="circle-alert" className="h-5 w-5 text-red-600" />
              </div>
            )}
            {variety === "warning" && (
              <div className="bg-orange-100 mx-auto rounded-full p-2 text-center">
                <Icon name="circle-alert" className="h-5 w-5 text-orange-600" />
              </div>
            )}
            {variety === "success" && (
              <div className="bg-green-100 mx-auto rounded-full p-2 text-center">
                <Icon name="circle-alert" className="h-5 w-5 text-green-600" />
              </div>
            )}
          </div>
        )}
        <div>
          <DialogPrimitive.Title className="text-primary-200 mt-2 text-xl">
            {title}
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="text-primary-300 text-sm">
            {children}
          </DialogPrimitive.Description>
        </div>
      </div>
      <div>
        {confirmBtn ? (
          confirmBtn
        ) : (
          <DialogClose
            color="primary"
            loading={isPending}
            onClick={(e) => onConfirm && onConfirm(e)}
          >
            {isPending ? loadingText : confirmBtnText}
          </DialogClose>
        )}
        <DialogClose disabled={isPending}>{cancelBtnText}</DialogClose>
      </div>
    </>
  );
};
