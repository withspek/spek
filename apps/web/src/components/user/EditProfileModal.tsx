import React, { useContext } from "react";
import { Modal } from "@/ui/modal";
import { Form, Formik } from "formik";
import { InputField } from "@/ui/form-field";
import { Button } from "@/ui/button";
import ConnectionContext from "@/contexts/ConnectionContext";
import { useTypeSafeMutation } from "@/hooks/useTypeSafeMutation";
import { useTypeSafeUpdateQuery } from "@/hooks/useTypeSafeUpdateQuery";

interface EditProfileProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

interface FormInitialValues {
  displayName: string;
  bio: string;
  username: string;
}

export const EditProfileModal: React.FC<EditProfileProps> = ({
  isOpen,
  onRequestClose,
}) => {
  const { conn, setUser } = useContext(ConnectionContext);
  const { mutateAsync } = useTypeSafeMutation("updateProfile");
  const updateQuery = useTypeSafeUpdateQuery();

  if (!conn) {
    return null;
  }
  const { user } = conn;

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      {isOpen ? (
        <Formik<FormInitialValues>
          initialValues={{
            bio: user.bio,
            displayName: user.displayName,
            username: user.username,
          }}
          onSubmit={async (values, { setFieldError }) => {
            const { error } = await mutateAsync([values]);

            if (error) {
              setFieldError("username", error);
            } else {
              if (conn) {
                setUser({
                  ...conn.user,
                  ...values,
                  bio: values.bio.trim(),
                  displayName: values.displayName.trim(),
                });
                onRequestClose();
              }
            }
          }}
        >
          {({ values, handleSubmit, handleChange, isSubmitting }) => (
            <Form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <h2>Edit profile</h2>
              <InputField
                label="Username"
                value={values.username}
                onChange={handleChange}
                name="username"
              />
              <InputField
                label="Display name"
                value={values.displayName}
                onChange={handleChange}
                name="displayName"
              />
              <InputField
                label="Biography"
                value={values.bio}
                onChange={handleChange}
                name="bio"
                rows={5}
                textarea={true}
              />

              <div className="flex justify-between gap-4">
                <Button color="default" onClick={onRequestClose}>
                  Cancel
                </Button>
                <Button color="primary" type="submit" disabled={isSubmitting}>
                  Save
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      ) : null}
    </Modal>
  );
};
