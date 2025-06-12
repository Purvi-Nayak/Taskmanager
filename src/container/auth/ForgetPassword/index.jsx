import React from 'react';
import { Formik, Form } from 'formik';
import { Link } from 'react-router-dom';
import InputText from '../../../shared/InputText';
import CustomButton from '../../../shared/Button';
import { forgetPasswordValidation } from '../../../utils/validation';

const ForgetPassword = () => {
  const initialValues = {
    email: ''
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/forgotpassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: values.email,
          requested_at: new Date().toISOString()
        }),
      });
      const data = await response.json();
      console.log('Password reset request sent:', data);
      // Handle success - show success message or redirect
    } catch (error) {
      console.error('Password reset request failed:', error);
      // Handle error - show error message
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded shadow-lg">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Forgot Password
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={forgetPasswordValidation}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
            <Form className="space-y-6">
              <InputText
                label="Email Address"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && errors.email}
                placeholder="Enter your email"
              />

              <CustomButton
                text="Reset Password"
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              />

              <div className="text-center">
                <Link
                  to="/"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Back to Login
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ForgetPassword;