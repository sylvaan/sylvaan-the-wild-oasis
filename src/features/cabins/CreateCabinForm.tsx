import { useForm } from "react-hook-form";

import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";
import FormRow from "../../ui/FormRow";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEditCabin } from "../../services/apiCabins";
import type { Cabin, NewCabin } from "../../services/apiCabins";
import toast from "react-hot-toast";

// ... imports

interface CabinFormData {
  name: string;
  maxCapacity: number;
  regularPrice: number;
  discount: number;
  description: string;
  image: FileList | string;
}

function CreateCabinForm({
  cabinToEdit = {} as Cabin,
  onClose,
}: {
  cabinToEdit?: Cabin;
  onClose?: () => void;
}) {
  const { id: editId, ...editValues } = cabinToEdit;
  const isEditSession = Boolean(editId);

  const { register, handleSubmit, reset, getValues, formState, watch } = useForm<CabinFormData>({
    defaultValues: isEditSession
      ? {
          name: editValues.name,
          maxCapacity: editValues.max_capacity,
          regularPrice: editValues.regular_price,
          discount: editValues.discount,
          description: editValues.description,
          image: editValues.image,
        }
      : {},
  });
  const { errors } = formState;

  const queryClient = useQueryClient();

  const { mutate: createCabin, isPending: isCreating } = useMutation({
    mutationFn: (newCabin: NewCabin) => createEditCabin(newCabin),
    onSuccess: () => {
      toast.success("New cabin successfully created");
      queryClient.invalidateQueries({ queryKey: ["cabins"] });
      reset();
      onClose?.();
    },
    onError: (err) => toast.error(err.message),
  });

  const { mutate: editCabin, isPending: isEditing } = useMutation({
    mutationFn: ({ newCabinData, id }: { newCabinData: NewCabin; id: string }) =>
      createEditCabin(newCabinData, id),
    onSuccess: () => {
      toast.success("Cabin successfully edited");
      queryClient.invalidateQueries({ queryKey: ["cabins"] });
      reset();
      onClose?.();
    },
    onError: (err) => toast.error(err.message),
  });

  const isWorking = isCreating || isEditing;

  function onSubmit(data: CabinFormData) {
    const image = typeof data.image === "string" ? data.image : data.image[0];

    if (isEditSession)
      editCabin({ newCabinData: { ...data, image }, id: editId });
    else createCabin({ ...data, image: image });
  }

  // Helper to safely get image source for preview
  const imageValue = watch("image");
  let previewSrc = "";
  if (typeof imageValue === "string") {
    previewSrc = imageValue;
  } else if (imageValue && imageValue.length > 0) {
    previewSrc = URL.createObjectURL(imageValue[0]);
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow label="Cabin name" error={errors?.name?.message}>
        <Input
          type="text"
          id="name"
          disabled={isWorking}
          {...register("name", {
            required: "This field is required",
          })}
        />
      </FormRow>

      <FormRow label="Maximum capacity" error={errors?.maxCapacity?.message}>
        <Input
          type="number"
          id="maxCapacity"
          disabled={isWorking}
          {...register("maxCapacity", {
            required: "This field is required",
            min: {
              value: 1,
              message: "Capacity should be at least 1",
            },
          })}
        />
      </FormRow>

      <FormRow label="Regular price" error={errors?.regularPrice?.message}>
        <Input
          type="number"
          id="regularPrice"
          disabled={isWorking}
          {...register("regularPrice", {
            required: "This field is required",
            min: {
              value: 1,
              message: "Price should be at least 1",
            },
          })}
        />
      </FormRow>

      <FormRow label="Discount" error={errors?.discount?.message}>
        <Input
          type="number"
          id="discount"
          disabled={isWorking}
          defaultValue={0}
          {...register("discount", {
            required: "This field is required",
            validate: (value) =>
              Number(value) <= Number(getValues().regularPrice) ||
              "Discount should be less than regular price",
          })}
        />
      </FormRow>

      <FormRow label="Description for website" error={errors?.description?.message}>
        <Textarea
          id="description"
          defaultValue=""
          disabled={isWorking}
          {...register("description", {
            required: "This field is required",
          })}
        />
      </FormRow>

      <FormRow label="Cabin photo">
        <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          <FileInput
            id="image"
            accept="image/*"
            disabled={isWorking}
            {...register("image", {
              required: isEditSession ? false : "This field is required",
            })}
          />
          {previewSrc && (
            <img
              src={previewSrc}
              alt="Preview"
              style={{
                width: "10rem",
                borderRadius: "var(--border-radius-sm)",
                display: "block",
              }}
            />
          )}
        </div>
      </FormRow>

      <FormRow>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "1.2rem" }}>
          <Button variation="secondary" type="reset" onClick={() => onClose?.()}>
            Cancel
          </Button>
          <Button size="medium" variation="primary" type="submit" disabled={isWorking}>
            {isEditSession ? "Edit cabin" : "Add cabin"}
          </Button>
        </div>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
