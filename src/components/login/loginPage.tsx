import React, { useCallback } from 'react';
import { Box, Typography, TextField, Button, Alert, Fade } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { Field, Form, Formik } from 'formik';
import * as yup from 'yup';
import { useLoginMutation, LoginRequest } from '../../api/authApiSlice';
import { useUserInfoQuery } from '../../api/userApiSlice';

const validationSchema = yup.object({
  username: yup.string().required('Username is required'),
  password: yup
    .string()
    .min(8, 'Minimum of 8 characters')
    .matches(/[A-Z]/, 'There must be one capital letter')
    .matches(/[a-z]/, 'There must be one lowercase letter.')
    .matches(/[0-9]/, 'There must be at least one digit.')
    .matches(/[^a-zA-Z0-9]/, 'There must be at least one special character.')
    .nullable(),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const [login, { isLoading, error }] = useLoginMutation();
  const { data: user, isSuccess: userFetched } = useUserInfoQuery({});

  const initialValues: LoginRequest = {
    username: '',
    password: '',
  };

  const handleSubmit = useCallback(
    async (values: LoginRequest) => {
      try {
        const result = await login(values);
        if (result.error) throw result.error;
      } catch (err) {
        console.log(err);
      }
    },
    [login]
  );

  React.useEffect(() => {
    if (userFetched && user) {
      navigate('/');
    }
  }, [user, userFetched, navigate]);

  const handleSignInClick = () => {
    navigate('/register');
  };

  const theme = useTheme();

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
        <Fade>
          <Alert
            severity='error'
            sx={{ mb: 2, borderRadius: 1, fontSize: '0.875rem' }}
          >
            There is no such user
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
              name='username'
              label='Enter username'
              fullWidth
              margin='normal'
              size='small'
              required
              error={touched.username && !!errors.username}
              helperText={touched.username && errors.username}
            />
            <Field
              as={TextField}
              name='password'
              label='Enter password'
              type='password'
              autoComplete='current-password'
              fullWidth
              margin='normal'
              size='small'
              required
              error={touched.password && !!errors.password}
              helperText={touched.password && errors.password}
            />
            <Button
              type='submit'
              variant='contained'
              color='secondary'
              fullWidth
              size='medium'
              disabled={isLoading}
              sx={{ mt: 2 }}
            >
              {isLoading ? 'Loading...' : 'Sign up'}
            </Button>
          </Form>
        )}
      </Formik>
      <Typography
        variant='body2'
        sx={{ color: theme.palette.text.secondary, mt: 1 }}
      >
        Dont have an account?
        <Link
          to='/register'
          onClick={handleSignInClick}
          style={{
            textDecoration: 'underline',
            color: 'secondary.main',
            cursor: 'pointer',
          }}
        >
          Sign up
        </Link>
      </Typography>
    </Box>
  );
}
