import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  showToast,
} from "@spek/ui";
import { Formik } from "formik";
import { useRouter } from "next/navigation";
import * as Yup from "yup";

import { useTypeSafeMutation } from "@/hooks/useTypeSafeMutation";
import { InputField } from "@/ui/form-field";
import { useTypeSafePrefetch } from "@/hooks/useTypeSafePrefetch";
import { useCurrentConfIdStore } from "@/stores/useCurentConfIdStore";

interface CreateRoomModalProps {
  open: boolean;
  onOpenChange: () => void;
  communityId: string;
}

interface InitialFormValues {
  name: string;
  description: string;
}

const createSchema = Yup.object({
  name: Yup.string().required("Required"),
  description: Yup.string().required("Required"),
});

export const CreateRoomModal: React.FC<CreateRoomModalProps> = ({
  open,
  onOpenChange,
  communityId,
}) => {
  const { push } = useRouter();
  const prefetch = useTypeSafePrefetch();
  const { mutateAsync, isLoading } = useTypeSafeMutation("createConf");

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader
          title={`Create new room`}
          subtitle={`Come together with the community members and start a talk.`}
        />
        <Formik<InitialFormValues>
          initialValues={{ description: "", name: "" }}
          validationSchema={createSchema}
          onSubmit={async (values) => {
            const resp = await mutateAsync([{ ...values, communityId }]);

            if (typeof resp === "object" && "error" in resp) {
              showToast(resp.error, "error");
            } else if (resp.conf) {
              const { conf } = resp;

              prefetch(["joinConfAndGetInfo", conf.id], [conf.id]);
              useCurrentConfIdStore.getState().setCurrentConfId(conf.id);
              push(`/conf/${resp.conf?.id}`);
            }

            onOpenChange();
          }}
        >
          {({ values, handleSubmit, handleChange }) => (
            <>
              <InputField
                value={values.name}
                onChange={handleChange}
                name="name"
                placeholder="eg: ReactConf 2024"
                label="Name"
              />
              <InputField
                value={values.description}
                onChange={handleChange}
                placeholder="Tell us more about the room"
                textarea
                rows={4}
                name="description"
                label="Description"
              />
              <DialogFooter>
                <Button color="minimal" onClick={onOpenChange}>
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={() => handleSubmit()}
                  loading={isLoading}
                >
                  Create
                </Button>
              </DialogFooter>
            </>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};
