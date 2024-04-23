import { Button } from "@/ui/button";
import { InputField } from "@/ui/form-field";
import { CommunityWithPermissions } from "@spek/client";
import { Form, Formik } from "formik";

interface EditFormProps {
  community: CommunityWithPermissions;
}

interface InitialFormValues {
  name: string;
  description: string;
}

export const EditForm: React.FC<EditFormProps> = ({ community }) => {
  return (
    <Formik<InitialFormValues>
      initialValues={{
        description: community.description,
        name: community.name,
      }}
      onSubmit={(values) => {
        console.log("submitted");
      }}
    >
      {({ handleSubmit, isSubmitting, errors, values, touched }) => (
        <Form onSubmit={handleSubmit}>
          <div>
            <h3 className="text-2xl">Community</h3>
            <p className="text-alabaster-300">
              Manage the community credentials
            </p>
          </div>
          <InputField label="Name" name="name" value={values.name} />
          <InputField
            label="Description"
            name="description"
            value={values.description}
            textarea
            rows={5}
          />
          {(touched.name && values.name !== community.name) ||
          (touched.description &&
            values.description !== community.description) ? (
            <Button type="submit" loading={isSubmitting}>
              Save
            </Button>
          ) : null}
        </Form>
      )}
    </Formik>
  );
};
