import { useTypeSafeMutation } from "@/hooks/useTypeSafeMutation";
import { useTypeSafeUpdateQuery } from "@/hooks/useTypeSafeUpdateQuery";
import { Button } from "@spek/ui";
import { InputField } from "@/ui/form-field";
import { CommunityWithPermissions } from "@spek/client";
import { Formik } from "formik";

interface EditFormProps {
  community: CommunityWithPermissions;
}

interface InitialFormValues {
  name: string;
  description: string;
}

export const EditForm: React.FC<EditFormProps> = ({ community }) => {
  const { mutateAsync: updateCommunity, isLoading: updateLoading } =
    useTypeSafeMutation("updateCommunity");

  const update = useTypeSafeUpdateQuery();

  return (
    <Formik<InitialFormValues>
      initialValues={{
        description: community.description,
        name: community.name,
      }}
      onSubmit={async (values, { setFieldError }) => {
        const resp = await updateCommunity([
          {
            name: values.name,
            description: values.description,
            communityId: community.id,
          },
        ]);

        if (!resp.error) {
          update(["getCommunity", community.slug], (oldData) => ({
            channels: oldData.channels,
            community: {
              ...resp.community,
              name: resp.community.name,
              description: resp.community.description,
            },
          }));
        } else {
          setFieldError("name", resp.error);
        }
      }}
    >
      {({ handleSubmit, values, touched }) => (
        <>
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
            <Button
              type="submit"
              onClick={() => handleSubmit()}
              loading={updateLoading}
            >
              Save
            </Button>
          ) : null}
        </>
      )}
    </Formik>
  );
};
