"use client";

import { confirmModal } from "@/components/ConfirmModal";
import { useTypeSafeQuery } from "@/hooks/useTypeSafeQuery";
import { Button } from "@/ui/button";
import { InputField } from "@/ui/form-field";
import { Formik } from "formik";
import { useRouter } from "next/navigation";

interface SettingsPageControllerProps {
  communitySlug: string;
  channelId: string;
}

interface InitialFormValues {
  name: string;
  description: string;
}

interface DangerZoneItemProps {
  title: string;
  actionTitle: string;
  onActionClick: () => void;
  subtitle: string;
}

const DangerZoneItem: React.FC<DangerZoneItemProps> = ({
  onActionClick,
  subtitle,
  title,
  actionTitle,
}) => {
  return (
    <div className="flex gap-2 justify-between">
      <div>
        <p>{title}</p>
        <p className="text-sm text-alabaster-300">{subtitle}</p>
      </div>
      <button type="button" onClick={onActionClick}>
        {actionTitle}
      </button>
    </div>
  );
};

export const SettingsPageController: React.FC<SettingsPageControllerProps> = ({
  channelId,
  communitySlug,
}) => {
  const router = useRouter();
  const { data, isLoading } = useTypeSafeQuery(["getChannel", channelId], {}, [
    channelId,
  ]);

  if (isLoading || !data) {
    return <div>loading...</div>;
  }

  if (!data.channel.isAdmin) {
    router.replace("/home");
  }

  return (
    <div className="flex flex-col">
      <p
        className="text-lg cursor-pointer flex gap-3"
        onClick={() => router.back()}
      >
        Go back
      </p>
      <div>
        <h2>Profile</h2>
        <p className="text-alabaster-300">Manage the profile of this channel</p>
        <Formik<InitialFormValues>
          initialValues={{
            description: data.channel.description,
            name: data.channel.name,
          }}
          onSubmit={() => {}}
        >
          {({ values, isSubmitting, handleChange, handleSubmit, touched }) => (
            <div className="flex flex-col gap-3 mt-5">
              <InputField
                name="name"
                label="Name"
                onChange={handleChange}
                value={values.name}
              />
              <InputField
                name="description"
                label="Description"
                onChange={handleChange}
                value={values.description}
                textarea
                rows={5}
              />
              {(touched.name && values.name !== data.channel.name) ||
              (touched.description &&
                values.description !== data.channel.description) ? (
                <Button
                  type="submit"
                  onClick={() => handleSubmit()}
                  loading={isSubmitting}
                >
                  Save
                </Button>
              ) : null}
            </div>
          )}
        </Formik>
        <h2 className="mt-4">Danger zone</h2>
        <div className="flex flex-col gap-3 border border-red-400 px-4 py-5 rounded-md mt-4">
          <DangerZoneItem
            actionTitle="Delete"
            onActionClick={() => {
              confirmModal(
                `Are you sure you want to delete ${data.channel.name}`,
                () => {}
              );
            }}
            subtitle="Once you delete a channel, there is no going back. Please be certain."
            title="Delete channel"
          />
        </div>
      </div>
    </div>
  );
};
