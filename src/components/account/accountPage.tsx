import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';
import Sidebar from '../sidebar/sidebar';
import { useTheme } from '@mui/material/styles';
import { Roles } from '../../api/enums/role';
import { UserDto, UpdateUserRequest } from '../../api/userApiSlice';
import {
  useUserInfoQuery,
  useUpdateUserMutation,
} from '../../api/userApiSlice';

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
});

interface FormValues {
  firstName: string;
  lastName: string;
  patronymic: string | undefined;
  email: string;
  password: string;
  username: string;
}

export default function AccountPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { data: user, isLoading, error } = useUserInfoQuery(undefined);
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [avatarType, setAvatarType] = useState<'initials' | 'image'>(
    'initials'
  );
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>(
    'success'
  );

  const getInitials = (user: UserDto | undefined) => {
    if (!user) return 'А';
    const first = user.firstName?.charAt(0) || '';
    const last = user.lastName?.charAt(0) || '';
    return (first + last).toUpperCase() || 'А';
  };

  const handleAvatarTypeChange = (
    _: React.MouseEvent<HTMLElement>,
    newType: 'initials' | 'image'
  ) => {
    if (newType !== null) setAvatarType(newType);
  };

  const handleLogout = () => navigate('/login');

  const getChangedFields = (
    values: FormValues,
    initial: UserDto
  ): UpdateUserRequest => ({
    id: initial.id!,
    username: values.username || initial.username || '',
    firstName: values.firstName || initial.firstName || '',
    lastName: values.lastName || initial.lastName || '',
    patronymic: values.patronymic || initial.patronymic,
    email: values.email || initial.email || '',
    password: values.password || undefined,
    role: initial.role || Roles.User,
    companyId: initial.companyId || 1,
  });

  const handleSubmit = async (values: FormValues, { setSubmitting }: any) => {
    try {
      if (!user?.id) {
        setAlertMessage('User not found');
        setAlertSeverity('error');
        return;
      }
      const updateData = getChangedFields(values, user);
      await updateUser(updateData).unwrap();
      setAlertMessage('Profile has been successfully updated');
      setAlertSeverity('success');
    } catch (err: any) {
      const msg = err?.data?.message || 'Error during the update';
      setAlertMessage(msg);
      setAlertSeverity('error');
    } finally {
      setSubmitting(false);
      setTimeout(() => setAlertMessage(null), 5000);
    }
  };

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity='error'>Download error</Alert>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity='error'>User data has not been uploaded</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 2, bgcolor: theme.palette.background.paper }}>
        <Typography variant='h5' sx={{ mb: 2 }}>
          Account
        </Typography>
        {alertMessage && (
          <Alert severity={alertSeverity} sx={{ mb: 2 }}>
            {alertMessage}
          </Alert>
        )}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Typography variant='h6'>{user.username}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant='body1'>{user.role}</Typography>
            <Button variant='outlined' onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </Box>

        <Typography variant='body2' sx={{ mb: 1 }}>
          Avatar
        </Typography>
        <Typography variant='caption' sx={{ mb: 2, display: 'block' }}>
          Provide your initials or upload an image to represent yourself
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              mr: 2,
              bgcolor: avatarType === 'image' ? '#E0E0E0' : '#4CAF50',
            }}
          >
            {avatarType === 'initials' ? getInitials(user) : ''}
          </Avatar>
          <ToggleButtonGroup
            value={avatarType}
            exclusive
            onChange={handleAvatarTypeChange}
            sx={{ height: 40 }}
          >
            <ToggleButton value='initials'>Инициалы</ToggleButton>
            <ToggleButton value='image'>Изображение</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Typography variant='h6' sx={{ mb: 2 }}>
          Initials
        </Typography>
        <Formik
          initialValues={{
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            patronymic: user.patronymic || '',
            email: user.email || '',
            password: '',
            username: user.username || '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <Stack spacing={2} sx={{ maxWidth: 400 }}>
                <Field
                  as={TextField}
                  name='username'
                  label='Username'
                  size='small'
                  fullWidth
                  error={touched.username && !!errors.username}
                  helperText={touched.username && errors.username}
                />
                <Field
                  as={TextField}
                  name='firstName'
                  label='First Name'
                  size='small'
                  fullWidth
                  error={touched.firstName && !!errors.firstName}
                  helperText={touched.firstName && errors.firstName}
                />
                <Field
                  as={TextField}
                  name='firstname'
                  label='First Name'
                  size='small'
                  fullWidth
                  error={touched.lastName && !!errors.lastName}
                  helperText={touched.lastName && errors.lastName}
                />
                <Field
                  as={TextField}
                  name='patronymic'
                  label='Patronymic'
                  size='small'
                  fullWidth
                  error={touched.patronymic && !!errors.patronymic}
                  helperText={touched.patronymic && errors.patronymic}
                />
                <Field
                  as={TextField}
                  name='email'
                  label='Email'
                  size='small'
                  fullWidth
                  error={touched.email && !!errors.email}
                  helperText={touched.email && errors.email}
                />
                <Field
                  as={TextField}
                  name='password'
                  label='Enter new password'
                  type='password'
                  size='small'
                  fullWidth
                  error={touched.password && !!errors.password}
                  helperText={touched.password && errors.password}
                />
                <Button
                  type='submit'
                  variant='outlined'
                  disabled={isSubmitting || isUpdating}
                  sx={{ mt: 2 }}
                >
                  {isSubmitting || isUpdating ? 'Update...' : 'Apply'}
                </Button>
              </Stack>
            </Form>
          )}
        </Formik>
      </Box>
    </Box>
  );
}
