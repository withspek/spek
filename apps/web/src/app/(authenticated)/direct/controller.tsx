"use client";

import { CenterLoader } from "@/components/CenterLoader";
import { ConversationsList } from "@/components/direct/ConversationsList";
import { useTypeSafeQuery } from "@/hooks/useTypeSafeQuery";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  Icon,
} from "@spek/ui";
import { useState } from "react";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(!open);
  };

  return (
    <div className="mt-2">
      <div className="flex justify-between">
        <h2>Messages</h2>
        <Icon
          name="mail-plus"
          onClick={handleOpen}
          className="cursor-pointer"
        />

        <Dialog open={open} onOpenChange={handleOpen} name="Create new message">
          <DialogContent>
            <DialogHeader title={`Create a new message`} />
            <div>
              <p>Hello world</p>
            </div>
            <DialogFooter showDivider={true}>
              <DialogClose color="primary" />
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      {children}
    </div>
  );
};

export const DirectMessagePageController: React.FC = ({}) => {
  const { data, isLoading } = useTypeSafeQuery("getUserLodges");

  if (isLoading) {
    return (
      <Layout>
        <CenterLoader />
      </Layout>
    );
  }

  return (
    <Layout>
      <ConversationsList conversations={data!} />
    </Layout>
  );
};
