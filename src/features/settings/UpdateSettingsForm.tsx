import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSetting } from "../../services/apiSettings";
import { useSettings } from "./useSettings";
import type { Settings } from "../../services/types";
import Spinner from "../../ui/Spinner";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import toast from "react-hot-toast";

function UpdateSettingsForm() {
  const { isLoading, error, settings = {} } = useSettings();

  const queryClient = useQueryClient();

  const { isPending: isUpdating, mutate } = useMutation({
    mutationFn: updateSetting,
    onSuccess: () => {
      toast.success("Settings successfully updated");
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
    onError: (err) => toast.error(err.message),
  });

  const { register, handleSubmit, reset, formState } = useForm({
    defaultValues: settings,
  });
  const { errors } = formState;

  useEffect(() => {
    if (settings?.minBookingLength) {
      reset(settings);
    }
  }, [settings, reset]);

  if (isLoading) return <Spinner />;

  if (error) return <p>ERROR</p>;

  function onSubmit(data: Settings) {
    mutate(data);
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow label="Minimum nights/booking" error={errors?.minBookingLength?.message as string}>
        <Input
          type="number"
          id="min-nights"
          disabled={isUpdating}
          {...register("minBookingLength", {
            required: "This field is required",
          })}
        />
      </FormRow>

      <FormRow label="Maximum nights/booking" error={errors?.maxBookingLength?.message as string}>
        <Input
          type="number"
          id="max-nights"
          disabled={isUpdating}
          {...register("maxBookingLength", {
            required: "This field is required",
          })}
        />
      </FormRow>

      <FormRow label="Maximum guests/booking" error={errors?.maxGuestsPerBooking?.message as string}>
        <Input
          type="number"
          id="max-guests"
          disabled={isUpdating}
          {...register("maxGuestsPerBooking", {
            required: "This field is required",
          })}
        />
      </FormRow>

      <FormRow label="Breakfast price" error={errors?.breakfastPrice?.message as string}>
        <Input
          type="number"
          id="breakfast-price"
          disabled={isUpdating}
          {...register("breakfastPrice", {
            required: "This field is required",
          })}
        />
      </FormRow>

      <FormRow>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "1.2rem" }}>
          <Button type="reset" variation="secondary" disabled={isUpdating} onClick={() => reset()}>
            Cancel
          </Button>
          <Button disabled={isUpdating}>Update settings</Button>
        </div>
      </FormRow>
    </Form>
  );
}

export default UpdateSettingsForm;
