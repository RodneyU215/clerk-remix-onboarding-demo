import React, { useEffect } from 'react';
import { ActionFunction, json, redirect } from '@remix-run/node';
import { getAuth } from '@clerk/remix/ssr.server';
import { createClerkClient } from '@clerk/remix/api.server';
import { Form, useActionData, useNavigate } from '@remix-run/react';
import { useUser } from '@clerk/remix';

export const action: ActionFunction = async (args) => {
  const { userId } = await getAuth(args);

  if (!userId) {
    return redirect('/sign-in');
  }
  const params = { publicMetadata: { hasCompletedOnboarding: true } };
  const clerk = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
  });

  try {
    await clerk.users.updateUser(userId, params);
    return json({ onboardingComplete: true });
  } catch (error) {
    return json({ onboardingComplete: false });
  }
};

const Onboarding: React.FC = () => {
  const actionData = useActionData<typeof action>();
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    async function fetchData() {
      if (actionData?.onboardingComplete && user) {
        await user.reload();
        navigate('/');
      }
    }
    fetchData();
  }, [actionData, user, navigate]);

  return (
    <div>
      <h1>Welcome to the Onboarding Page!</h1>
      {actionData && !actionData.onboardingComplete ? (
        <p>
          <span style={{ color: 'red' }}>
            {actionData.error || 'An unknown error occurred.'}
          </span>
        </p>
      ) : null}
      <Form method="post">
        <button type="submit">Complete</button>
      </Form>
    </div>
  );
};

export default Onboarding;
