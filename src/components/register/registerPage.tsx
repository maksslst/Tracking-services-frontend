import React, { useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Typography, TextField, Button, Fade, Alert } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Field, Form, Formik } from 'formik';
import * as yup from 'yup';
import { useRegisterMutation, RegisterRequest } from '../../api/authApiSlice';

const validationSchema = yup.object({
  username: yup.string().required('Username is required'),
  firstName: yup.string().required('FirstName is required'),
  lastName: yup.string().required('Lastname is required'),
  patronymic: yup.string().nullable(),
  email: yup.string().email('Incorrect email').required('Email is required'),
  password: yup
    .string()
    .min(8, 'Minimum of 8 characters')
    .matches(/[A-Z]/, 'There must be one capital letter')
    .matches(/[a-z]/, 'There must be one lowercase letter.')
    .matches(/[0-9]/, 'There must be at least one digit.')
    .matches(/[^a-zA-Z0-9]/, 'There must be at least one special character.')
    .nullable(),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Password confirmation is required'),
});

export default function RegisterPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [register, { isLoading, error }] = useRegisterMutation();

  const initialValues: RegisterRequest = {
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    patronymic: '',
    passwordConfirmation: '',
  };

  const handleSubmit = useCallback(
    async (values: RegisterRequest) => {
      try {
        const result = await register(values);
        if (result.error) {
          throw result.error;
        }
        if (result.data) {
          navigate('/login');
        }
      } catch (err) {
        //
      }
    },
    [register, navigate]
  );

  const handleSignInClick = () => {
    navigate('/login');
  };

  const getErrorMessage = (err: any): string => {
    if ('data' in err && err.data) {
      if (typeof err.data === 'object' && 'detail' in err.data) {
        return err.data.detail;
      }
      if (typeof err.data === 'object' && 'title' in err.data) {
        return err.data.title;
      }
      if (typeof err.data === 'string') {
        return err.data;
      }
    }
    return 'Error during registration. Please try again';
  };

  return (
    <Box
      sx={{
        width: 400,
        height: 500,
        mx: 'auto',
        mt: 50,
        borderRadius: 1,
      }}
    >
      <Typography
        variant='h4'
        align='center'
        gutterBottom
        style={{ color: theme.palette.text.primary, fontWeight: 'bold' }}
      >
        Tracking Services
      </Typography>
      {error && (
        <Fade in timeout={300}>
          <Alert
            severity='error'
            sx={{ mb: 2, borderRadius: 1, fontSize: '0.875rem' }}
          >
            {getErrorMessage(error)}
          </Alert>
        </Fade>
      )}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form>
            <Field
              as={TextField}
              required
              label='Enter username'
              name='username'
              size='medium'
              fullWidth
              margin='normal'
              variant='outlined'
              error={touched.username && !!errors.username}
              helperText={touched.username && errors.username}
            />
            <Field
              as={TextField}
              required
              label='Enter firstName'
              name='firstName'
              size='medium'
              fullWidth
              margin='normal'
              variant='outlined'
              error={touched.firstName && !!errors.firstName}
              helperText={touched.firstName && errors.firstName}
            />
            <Field
              as={TextField}
              required
              label='Enter lastName'
              size='medium'
              name='lastName'
              fullWidth
              margin='normal'
              variant='outlined'
              error={touched.lastName && !!errors.lastName}
              helperText={touched.lastName && errors.lastName}
            />
            <Field
              as={TextField}
              label='Enter patronymic'
              name='patronymic'
              size='medium'
              fullWidth
              margin='normal'
              variant='outlined'
              error={touched.patronymic && !!errors.patronymic}
              helperText={touched.patronymic && errors.patronymic}
            />
            <Field
              as={TextField}
              required
              label='Enter email'
              name='email'
              size='medium'
              type='email'
              fullWidth
              margin='normal'
              variant='outlined'
              error={touched.email && !!errors.email}
              helperText={touched.email && errors.email}
            />
            <Field
              as={TextField}
              required
              label='Enter password'
              name='password'
              size='medium'
              type='password'
              autoComplete='new-password'
              fullWidth
              margin='normal'
              variant='outlined'
              error={touched.password && !!errors.password}
              helperText={touched.password && errors.password}
            />
            <Field
              as={TextField}
              required
              label='Enter passwordConfirmation'
              name='passwordConfirmation'
              size='medium'
              type='password'
              autoComplete='new-password'
              fullWidth
              margin='normal'
              variant='outlined'
              error={
                touched.passwordConfirmation && !!errors.passwordConfirmation
              }
              helperText={
                touched.passwordConfirmation && errors.passwordConfirmation
              }
            />
            <Button
              type='submit'
              fullWidth
              variant='contained'
              color='secondary'
              size='medium'
            >
              {isLoading ? 'Register...' : 'Register'}
            </Button>
          </Form>
        )}
      </Formik>
      <Typography
        variant='body2'
        sx={{ color: theme.palette.text.secondary, mt: 1 }}
      >
        Already have an account?{' '}
        <Link
          to='/login'
          onClick={handleSignInClick}
          style={{
            textDecoration: 'underline',
            color: 'secondary.main',
            cursor: 'pointer',
          }}
        >
          Sign in
        </Link>
      </Typography>
    </Box>
  );
}
