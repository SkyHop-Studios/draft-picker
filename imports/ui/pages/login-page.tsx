import React from 'react';
import {AuthFormProvider, Inputs as IC} from '@/features/auth/auth-form'
import {Button} from '@/components/button'
import {useAuth} from '@/lib/utils/user-auth'
import {Form} from 'formik'
import {ContentPanel} from '@/components/content-panel'
import {Link} from 'react-router-dom'

const LoginPage = () => {
  const auth = useAuth();

  return <div>

    <ContentPanel className={"max-w-[640px] mx-auto mt-4"}>

      <h1 className="text-2xl font-semibold mb-6">Sign In</h1>
      <AuthFormProvider
        onSubmit={(values) => auth.loginWithPassword({ username: values.username }, values.password)}>
        <Form className="flex flex-col gap-6">
          <IC.Username/>

          <IC.Password/>

          {auth.error &&
            <p className="text-red-500">{auth.error.reason}</p>
          }

          <div className="mb-2">
            <Button className="w-full">Sign In</Button>
          </div>

          <div>
            <Link to="/register">Not Signed up? Click here</Link>
          </div>
        </Form>
      </AuthFormProvider>

    </ContentPanel>

  </div>
};

export default LoginPage;
