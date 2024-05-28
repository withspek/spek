import { Command } from "cmdk";
import Icon from "../icon/Icon";
import { Dispatch, SetStateAction } from "react";

interface ModalProps {
  open: boolean;
  onOpenChange: () => void;
  onKeyDown: () => void;
  label?: string;
  value: string;
  onValueChange: Dispatch<SetStateAction<string>>;
}

export const Modal: React.FC<ModalProps> = ({
  onOpenChange,
  open,
  label,
  onValueChange,
  value,
  onKeyDown,
}) => {
  return (
    <Command.Dialog open={open} onOpenChange={onOpenChange} label={label}>
      <Command onKeyDown={onKeyDown}>
        <div className="flex gap-4 w-full items-center bg-primary-700 px-3 h-12 rounded-md">
          <Icon name="search" />
          <Command.Input
            className="flex w-full bg-primary-700 outline-none h-full"
            placeholder="Search communities and people.."
            value={value}
            onValueChange={(search) => onValueChange(search)}
          />
        </div>
      </Command>
    </Command.Dialog>
  );
};
