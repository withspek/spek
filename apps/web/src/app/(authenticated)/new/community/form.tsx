"use client";

import React from "react";
import { Form, Formik } from "formik";

import { Button } from "@/ui/button";
import { InputField } from "@/ui/form-field";
import { useRouter } from "next/navigation";
import { useTypeSafeMutation } from "@/hooks/useTypeSafeMutation";

interface FormValues {
  name: string;
  description: string;
}

export const CreateCommunityForm: React.FC = () => {
  const { push } = useRouter();
  const { mutateAsync } = useTypeSafeMutation("createCommunity");

  return (
    <Formik<FormValues>
      initialValues={{ description: "", name: "" }}
      onSubmit={async (values) => {
        const resp = await mutateAsync([values]);

        if (resp) {
          console.log(resp);
        }
      }}
    >
      {({ handleChange, handleSubmit }) => (
        <Form className="space-y-4 mt-3">
          <InputField
            label="Name"
            placeholder="Community name"
            name="name"
            onChange={handleChange}
          />
          <InputField
            textarea
            rows={5}
            label="Description"
            placeholder="Community description"
            name="description"
            onChange={handleChange}
          />
          <div className="flex gap-3">
            <Button onClick={() => handleSubmit} type="submit">
              Create
            </Button>
            <Button color="primary" onClick={() => push("/home")}>
              Cancel
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};
