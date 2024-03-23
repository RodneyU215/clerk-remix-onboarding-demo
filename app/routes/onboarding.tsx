import React from 'react';
import { ActionFunction, redirect } from '@remix-run/node';
import { getAuth } from '@clerk/remix/ssr.server';
import { createClerkClient } from '@clerk/remix/api.server';
import { Form, useActionData } from '@remix-run/react';

export const action: ActionFunction = async (args) => {
  const { userId } = await getAuth(args);

  if (!userId) {
    return redirect('/sign-in');
  }
  const params = { publicMetadata: { hasCompletedOnboarding: true } };

  const clerk = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
  });
  await clerk.users.updateUser(userId, params);
  // Todo: Investigate why I'm not able to reload the user so that the metadata is updated
  return redirect('/');
};

const Onboarding: React.FC = () => {
  const actionData = useActionData<typeof action>();

  return (
    <div>
      <h1>Welcome to the Onboarding Page!</h1>
      {actionData && actionData.error ? (
        <p>
          <span style={{ color: 'red' }}>{actionData.errors}</span>
        </p>
      ) : null}
      <Form method="post">
        <button type="submit">Complete</button>
      </Form>
    </div>
  );
};

export default Onboarding;
