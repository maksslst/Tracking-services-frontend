import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  IconButton,
  CircularProgress,
  Button,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Sidebar from '../sidebar/sidebar';
import { Roles } from '../../api/enums/role';
import {
  useUserInfoQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
} from '../../api/userApiSlice';
import {
  useGetCompanyUsersQuery,
  useDeleteUserFromCompanyMutation,
} from '../../api/companyApiSlice';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import * as yup from 'yup';

export default function UserManagementPage() {
  const theme = useTheme();

  const { data: userInfo, isLoading: isUserLoading } = useUserInfoQuery({});
  const companyId = userInfo?.companyId;

  const {
    data: users = [],
    isLoading: isUsersLoading,
    refetch,
  } = useGetCompanyUsersQuery(
    { companyId: companyId ?? 0 },
    { skip: !companyId }
  );

  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUserFromCompany] = useDeleteUserFromCompanyMutation();

  const [editUserData, setEditUserData] = useState<any>(null);

  useEffect(() => {
    if (!isUserLoading && !companyId) {
      alert('You are not an employee of the company');
    }
  }, [isUserLoading, companyId]);

  const validationSchema = yup.object({
    username: yup.string().required('Username is required'),
    firstName: yup.string().required('FirstName is required'),
    lastName: yup.string().required('Lastname is required'),
    patronymic: yup.string().nullable(),
    role: Yup.string().oneOf(Object.values(Roles)).required('Role required'),
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

  const onCloseEdit = () => setEditUserData(null);
  const onSubmitForm = async (values: any, { resetForm }: any) => {
    try {
      if (values.isEdit) {
        await updateUser({ id: values.id, ...values, companyId });
      } else {
        await createUser({ ...values, companyId });
      }
      resetForm();
      onCloseEdit();
      refetch();
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleDelete = async (id: number) => {
    await deleteUserFromCompany({ userId: id, companyId: companyId! });
    refetch();
  };

  if (isUserLoading || isUsersLoading) {
    return <CircularProgress />;
  }
  if (!companyId) return null;

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 3, bgcolor: '#F5F5F5' }}>
        <Typography variant='h5' sx={{ mb: 3 }}>
          User Management
        </Typography>

        <Formik
          initialValues={{
            username: '',
            firstName: '',
            lastName: '',
            patronymic: '',
            email: '',
            role: Roles.User,
            password: '',
            isEdit: false,
            id: undefined,
          }}
          validationSchema={validationSchema}
          onSubmit={onSubmitForm}
        >
          {({ values, errors, touched, handleChange }) => (
            <Form>
              <Stack spacing={2} maxWidth={500}>
                <TextField
                  label='Username'
                  name='username'
                  value={values.username}
                  onChange={handleChange}
                  error={touched.username && Boolean(errors.username)}
                  helperText={touched.username && errors.username}
                />
                <TextField
                  label='First name'
                  name='firstName'
                  value={values.firstName}
                  onChange={handleChange}
                  error={touched.firstName && Boolean(errors.firstName)}
                  helperText={touched.firstName && errors.firstName}
                />
                <TextField
                  label='Last name'
                  name='lastName'
                  value={values.lastName}
                  onChange={handleChange}
                  error={touched.lastName && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                />
                <TextField
                  label='Patronymic'
                  name='patronymic'
                  value={values.patronymic}
                  onChange={handleChange}
                />
                <TextField
                  label='Email'
                  name='email'
                  value={values.email}
                  onChange={handleChange}
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                />
                <TextField
                  select
                  label='Role'
                  name='role'
                  value={values.role}
                  onChange={handleChange}
                  error={touched.role && Boolean(errors.role)}
                  helperText={touched.role && errors.role}
                >
                  {Object.values(Roles).map((r) => (
                    <MenuItem key={r} value={r}>
                      {r}
                    </MenuItem>
                  ))}
                </TextField>
                {!values.isEdit && (
                  <TextField
                    label='Password'
                    name='password'
                    type='password'
                    value={values.password}
                    onChange={handleChange}
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                  />
                )}
                <Button type='submit' variant='contained'>
                  {values.isEdit ? 'Save changes' : 'Add a user'}
                </Button>
              </Stack>
            </Form>
          )}
        </Formik>

        <Typography variant='h6' sx={{ mt: 4 }}>
          Список пользователей
        </Typography>
        <Stack spacing={2} mt={2}>
          {users.map((u) => (
            <Card key={u.id}>
              <CardContent>
                <Typography>
                  {u.firstName} {u.lastName} ({u.username})
                </Typography>
                <Typography>Email: {u.email}</Typography>
                <Typography>Role: {u.role}</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <IconButton onClick={() => setEditUserData(u)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color='error' onClick={() => handleDelete(u.id!)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>

        <Dialog open={Boolean(editUserData)} onClose={onCloseEdit}>
          <DialogTitle>Редактировать пользователя</DialogTitle>
          <DialogContent>
            {editUserData && (
              <Formik
                initialValues={{
                  id: editUserData.id!,
                  username: editUserData.username || '',
                  firstName: editUserData.firstName || '',
                  lastName: editUserData.lastName || '',
                  patronymic: editUserData.patronymic || '',
                  email: editUserData.email || '',
                  role: editUserData.role || Roles.User,
                  password: '',
                  isEdit: true,
                }}
                validationSchema={validationSchema}
                onSubmit={onSubmitForm}
              >
                {({ values, handleChange, errors, touched }) => (
                  <Form>
                    <Stack spacing={2} width={400} mt={1}>
                      <TextField
                        label='Username'
                        name='username'
                        value={values.username}
                        onChange={handleChange}
                        error={touched.username && Boolean(errors.username)}
                        helperText={
                          touched.username && errors.username
                            ? errors.password
                            : undefined
                        }
                      />
                      <TextField
                        label='First name'
                        name='firstName'
                        value={values.firstName}
                        onChange={handleChange}
                        error={Boolean(touched.firstName && errors.firstName)}
                        helperText={
                          touched.firstName &&
                          typeof errors.firstName === 'string'
                            ? errors.firstName
                            : undefined
                        }
                      />
                      <TextField
                        label='Last name'
                        name='lastName'
                        value={values.lastName}
                        onChange={handleChange}
                        error={Boolean(touched.lastName && errors.lastName)}
                        helperText={
                          touched.lastName &&
                          typeof errors.lastName === 'string'
                            ? errors.lastName
                            : undefined
                        }
                      />
                      <TextField
                        label='Patronymic'
                        name='patronymic'
                        value={values.patronymic}
                        onChange={handleChange}
                      />
                      <TextField
                        label='Email'
                        name='email'
                        value={values.email}
                        onChange={handleChange}
                        error={Boolean(touched.email && errors.email)}
                        helperText={
                          touched.email && typeof errors.email === 'string'
                            ? errors.email
                            : undefined
                        }
                      />
                      <TextField
                        select
                        label='Role'
                        name='role'
                        value={values.role}
                        onChange={handleChange}
                        error={Boolean(touched.role && errors.role)}
                        helperText={
                          touched.role && typeof errors.role === 'string'
                            ? errors.role
                            : undefined
                        }
                      >
                        {Object.values(Roles).map((r) => (
                          <MenuItem key={r} value={r}>
                            {r}
                          </MenuItem>
                        ))}
                      </TextField>
                      <DialogActions>
                        <Button onClick={onCloseEdit}>Cancel</Button>
                        <Button type='submit' variant='contained'>
                          Apply
                        </Button>
                      </DialogActions>
                    </Stack>
                  </Form>
                )}
              </Formik>
            )}
          </DialogContent>
        </Dialog>
      </Box>
    </Box>
  );
}
