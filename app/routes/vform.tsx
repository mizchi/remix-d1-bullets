import { DataFunctionArgs, json } from "@remix-run/cloudflare";
import { useActionData } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import {
  ValidatedForm,
  useField,
  useIsSubmitting,
  validationError,
} from "remix-validated-form";
import { z } from "zod";

const validator = withZod(
  z.object({
    firstName: z
      .string()
      .min(1, { message: "First name is required" }),
    lastName: z
      .string()
      .min(1, { message: "Last name is required" }),
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email("Must be a valid email"),
  })
);

export const action = async ({
  request,
}: DataFunctionArgs) => {
  const data = await validator.validate(
    await request.formData()
  );
  if (data.error) return validationError(data.error);
  const { firstName, lastName, email } = data.data;

  return json({
    title: `Hi ${firstName} ${lastName}!`,
    description: `Your email is ${email}`,
  });
};

export default function Demo() {
  const data = useActionData();
  return (
    <ValidatedForm validator={validator} method="post">
      <InputWithLabel name="firstName" label="First Name" />
      <InputWithLabel name="lastName" label="Last Name" />
      <InputWithLabel name="email" label="Email" />
      {data && (
        <pre>{JSON.stringify(data)}</pre>
      )}
      <SubmitButton />
    </ValidatedForm>
  );
}

const InputWithLabel = ({ name, label }: { name: string, label: string }) => {
  const { error, getInputProps } = useField(name);
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <input {...getInputProps({ id: name })} />
      {error && (
        <span>{error}</span>
      )}
    </div>
  );
};

const SubmitButton = () => {
  const isSubmitting = useIsSubmitting();
  return (
    <button type="submit" disabled={isSubmitting}>
      {isSubmitting ? "Submitting..." : "Submit"}
    </button>
  );
};

