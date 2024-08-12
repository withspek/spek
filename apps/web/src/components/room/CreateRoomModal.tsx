import { InputField } from "@/ui/form-field";
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@spek/ui";
import { Form, Formik } from "formik";

interface CreateRoomModalProps {
  open: boolean;
  onOpenChange: () => void;
}

interface InitialFormValues {
  name: string;
  description: string;
}

export const CreateRoomModal: React.FC<CreateRoomModalProps> = ({
  open,
  onOpenChange,
}) => {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader
          title={`Create new room`}
          subtitle={`Come together with the community members and start a talk.`}
        />
        <Formik<InitialFormValues>
          initialValues={{ description: "", name: "" }}
          onSubmit={(values) => {
            console.log(values);
          }}
        >
          {({ values, handleSubmit, handleChange }) => (
            <Form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            </Form>
          )}
        </Formik>
        <DialogFooter>
          <Button color="minimal" onClick={onOpenChange}>
            Cancel
          </Button>
          <Button>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
