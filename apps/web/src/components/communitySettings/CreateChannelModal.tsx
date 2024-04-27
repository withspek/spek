import React from "react";
import { useRouter } from "next/navigation";

import { Modal } from "@/ui/modal";
import { Formik } from "formik";
import { InputField } from "@/ui/form-field";
import { Button } from "@/ui/button";
import { useTypeSafeMutation } from "@/hooks/useTypeSafeMutation";

interface CreateChannelModalProps {
  communityId: string;
  open: boolean;
  onRequestClose: () => void;
}

interface InitialFormValues {
  name: string;
  description: string;
}

export const CreateChannelModal: React.FC<CreateChannelModalProps> = ({
  onRequestClose,
  open,
  communityId,
}) => {
  const { push } = useRouter();
  const { mutateAsync, isLoading } = useTypeSafeMutation("createChannel");

  return (
    <Modal isOpen={open} onRequestClose={onRequestClose}>
      <div>
        <h2 className="text-center">Create channel</h2>
        <p className="text-balance text-center">
          Create a new channel to foster new conversations.
        </p>
        <Formik<InitialFormValues>
          initialValues={{ description: "", name: "" }}
          onSubmit={async (values, { setFieldError }) => {
            const resp = await mutateAsync([
              { communityId: communityId, ...values },
            ]);

            if (!resp.error) {
              push(`/c/${resp.channel.community.slug}/${resp.channel.id}`);
            } else {
              setFieldError("name", resp.error);
            }
          }}
        >
          {({ values, handleChange, handleSubmit }) => (
            <div className="flex flex-col gap-4 mt-6">
              <InputField
                name="name"
                placeholder="Channel name"
                value={values.name}
                onChange={handleChange}
              />
              <InputField
                name="description"
                placeholder="Channel description"
                value={values.description}
                textarea
                onChange={handleChange}
                rows={5}
              />
              <div className="flex gap-2">
                <Button
                  type="submit"
                  loading={isLoading}
                  onClick={() => handleSubmit()}
                >
                  Create
                </Button>
                <Button type="button" color="primary">
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </Formik>
      </div>
    </Modal>
  );
};
