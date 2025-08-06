import React, {useCallback} from 'react';
import {AuthFormProvider, Inputs as IC, AuthFormValues} from '@/features/auth/auth-form'
import {useMethodMutation} from '/imports/rpc/rpc-hooks'
import {Button} from '@/components/button'
import {Form} from 'formik'
import {ContentPanel} from '@/components/content-panel'
import {Link} from 'react-router-dom'
import {useAuth} from '@/lib/utils/user-auth'

const RegisterPage = () => {
  const auth = useAuth();
  const createUserMutation = useMethodMutation('users.createAccount');

  const handleRegisterSubmit = useCallback(async ({ username, password }: AuthFormValues) => {
    await createUserMutation.mutateAsync({ username, password });
    return auth.loginWithPassword({ username }, password);
  }, []);

  return <div>

    <ContentPanel className={"max-w-[640px] mx-auto mt-4"}>

      <h1 className="text-2xl font-semibold mb-6">Register</h1>
      <AuthFormProvider
        onSubmit={handleRegisterSubmit}>
        <Form className="flex flex-col gap-6">
          <IC.Username/>

          <IC.Password/>

          {createUserMutation.error &&
            <p className="text-red-500">{createUserMutation.error.reason}</p>
          }

          <div className="mb-2">
            <Button type="submit" className="w-full">Create Account</Button>
          </div>

          <div>
            <Link to="/login">Already have an account? Click here</Link>
          </div>
        </Form>
      </AuthFormProvider>

    </ContentPanel>

  </div>
};

export default RegisterPage;
