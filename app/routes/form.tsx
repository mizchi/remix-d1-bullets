import { LoaderArgs } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { Form, useActionData, useLoaderData, useNavigation } from "@remix-run/react";

export const action = async ({ request }: LoaderArgs) => {
  const form = await request.formData();
  const val = form.get('value');
  if (val == "" || val == null) {
    return json({
      ok: false as const,
      errors: [
        { field: 'value', message: 'value is empty'}
      ]
    });
  }
  await new Promise((resolve) => setTimeout(resolve, 500));
  return json({
    ok: true as const,
    at: Date.now(),
  });
}

export const loader = async ({ request }: LoaderArgs) => {
  return json({ ok: false as const, value: 0, at: Date.now()});
}

export default function UserSettingPage() {
  const { value: initialValue } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  return (
    <>
      <Form method="post">
        <fieldset disabled={navigation.state === 'submitting'}>
          <legend>FormAction</legend>
          <label htmlFor="value">value</label>
          &nbsp;
          <input name="value" defaultValue={initialValue} />
          <input type="submit" value="submit" />
        </fieldset>
      </Form>
      {
        actionData?.ok === true
          ? <>
            Saved at {actionData.at}
          </>
          : <>
            {
              actionData?.errors.map((error, i) => {
                return <div key={i} style={{color: 'red'}}>{error.field}: {error.message}</div>
              })
            }
          </>
      }
    </>
  );
}

