import { UUID } from "crypto";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FaSpinner } from "react-icons/fa";

import { Divider } from "@/lib/components/ui/Divider";
import { Brain } from "@/lib/context/BrainProvider/types";

import styles from "./SettingsTab.module.scss";
import { GeneralInformation } from "./components/GeneralInformation/GeneralInformation";
import { ModelSelection } from "./components/ModelSelection/ModelSelection";
import { Prompt } from "./components/Prompt/Prompt";
import { usePermissionsController } from "./hooks/usePermissionsController";
import { UsePromptProps } from "./hooks/usePrompt";
import { useSettingsTab } from "./hooks/useSettingsTab";

import { useBrainFetcher } from "../../hooks/useBrainFetcher";

type SettingsTabProps = {
  brainId: UUID;
};

export const SettingsTabContent = ({
  brainId,
}: SettingsTabProps): JSX.Element => {
  const { t } = useTranslation(["translation", "brain", "config"]);
  const { handleSubmit, isUpdating, formRef, accessibleModels, setIsUpdating } =
    useSettingsTab({ brainId });

  const promptProps: UsePromptProps = {
    setIsUpdating,
  };

  const { hasEditRights } = usePermissionsController({
    brainId,
  });

  const { brain } = useBrainFetcher({
    brainId,
  });

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void handleSubmit();
        }}
        className="mb-10 mt-5 flex flex-col items-center gap-2"
        ref={formRef}
      >
        <div className={styles.main_infos_wrapper}>
          <div className={styles.general_information}>
            <GeneralInformation hasEditRights={hasEditRights} />
          </div>
          {brain?.brain_type === "doc" && (
            <div className={styles.model_information}>
              <ModelSelection
                accessibleModels={accessibleModels}
                hasEditRights={hasEditRights}
                brainId={brainId}
                handleSubmit={handleSubmit}
              />
            </div>
          )}
        </div>
        <Divider text={t("customPromptSection", { ns: "config" })} />
        <Prompt
          usePromptProps={promptProps}
          isUpdatingBrain={isUpdating}
          hasEditRights={hasEditRights}
        />
        <div className="flex flex-row justify-end flex-1 w-full mt-8">
          {isUpdating && <FaSpinner className="animate-spin" />}
          {isUpdating && (
            <span className="ml-2 text-sm">
              {t("updatingBrainSettings", { ns: "config" })}
            </span>
          )}
        </div>
      </form>
    </>
  );
};

export const SettingsTab = ({ brainId }: SettingsTabProps): JSX.Element => {
  const methods = useForm<Brain>();

  return (
    <FormProvider {...methods}>
      <SettingsTabContent brainId={brainId} />
    </FormProvider>
  );
};