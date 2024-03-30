import { useTypeSafeMutation } from "@/hooks/useTypeSafeMutation";
import { useTypeSafeUpdateQuery } from "@/hooks/useTypeSafeUpdateQuery";
import { Input } from "@/ui/input";
import { Form, Formik } from "formik";

interface CreateInputProps {
  channelId: string;
  communityId: string;
}

export const CreateInput: React.FC<CreateInputProps> = ({
  channelId,
  communityId,
}) => {
  const { mutateAsync } = useTypeSafeMutation("createThread");
  const update = useTypeSafeUpdateQuery();

  return (
    <Formik<{ name: string }>
      initialValues={{ name: "" }}
      onSubmit={async ({ name }, { setFieldValue }) => {
        const resp = await mutateAsync([{ name, channelId, communityId }]);

        if (resp.id) {
          update(["getChannelThreads", channelId], (oldData) => [
            resp,
            ...oldData,
          ]);
        }
        setFieldValue("name", "");
      }}
    >
      {({ handleChange, handleSubmit, values }) => (
        <Form onSubmit={handleSubmit}>
          <Input
            placeholder="Start a new conversation"
            name="name"
            value={values.name}
            onChange={handleChange}
          />
        </Form>
      )}
    </Formik>
  );
};
