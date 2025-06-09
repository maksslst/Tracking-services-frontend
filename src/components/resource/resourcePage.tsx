import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Stack,
  IconButton,
  Alert,
  Fade,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Sidebar from '../sidebar/sidebar';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  useCreateResourceMutation,
  useUpdateCompanyResourceMutation,
  useDeleteCompanyResourceMutation,
  useAddCompanyResourceMutation,
  useGetCompanyResourcesQuery,
  useGetAllResourcesQuery,
  CreateResourceRequest,
  UpdateResourceRequest,
} from '../../api/resourceApiSlice';
import { useUserInfoQuery } from '../../api/userApiSlice';
import { ResourceStatus } from '../../api/enums/resourceStatus';

const validationSchema = Yup.object({
  name: Yup.string().required('The name of the resource is required'),
  type: Yup.string().required('The type of resource is required'),
  source: Yup.string().required('The source is required'),
  status: Yup.string()
    .oneOf(Object.values(ResourceStatus), 'Incorrect status')
    .required('Status is required'),
});

interface ResourceFormValues {
  name: string;
  type: string;
  source: string;
  status: ResourceStatus;
}

export default function ResourcePage() {
  const theme = useTheme();
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>(
    'success'
  );
  const [editingResourceId, setEditingResourceId] = useState<number | null>(
    null
  );

  const {
    data: user,
    isLoading: isLoadingUser,
    error: userError,
  } = useUserInfoQuery(undefined);
  const companyId = user?.companyId;

  const { data: companyResources, isLoading: isLoadingCompanyResources } =
    useGetCompanyResourcesQuery(
      { companyId: companyId! },
      { skip: !companyId }
    );
  const { data: allServices, isLoading: isLoadingAllServices } =
    useGetAllResourcesQuery();
  const [createResource, { isLoading: isCreating }] =
    useCreateResourceMutation();
  const [updateResource] = useUpdateCompanyResourceMutation();
  const [deleteResource] = useDeleteCompanyResourceMutation();
  const [addService] = useAddCompanyResourceMutation();

  const handleAddResource = async (
    values: ResourceFormValues,
    { resetForm }: any
  ) => {
    if (!companyId) {
      setAlertMessage('The company was not found for the user');
      setAlertSeverity('error');
      setTimeout(() => setAlertMessage(null), 5000);
      return;
    }
    try {
      const request: CreateResourceRequest = {
        ...values,
        companyId,
      };
      await createResource(request).unwrap();
      setAlertMessage('Resource added successfully');
      setAlertSeverity('success');
      resetForm();
    } catch (error) {
      setAlertMessage('Error when creating a resource');
      setAlertSeverity('error');
    } finally {
      setTimeout(() => setAlertMessage(null), 5000);
    }
  };

  const handleUpdateResource = async (
    id: number,
    values: ResourceFormValues
  ) => {
    if (!companyId) {
      setAlertMessage('The company was not found for the user');
      setAlertSeverity('error');
      setTimeout(() => setAlertMessage(null), 5000);
      return;
    }
    try {
      const request: UpdateResourceRequest = {
        id,
        ...values,
        companyId,
      };
      await updateResource({
        companyId,
        resourceId: id,
        resource: request,
      }).unwrap();
      setAlertMessage('The resource has been successfully updated');
      setAlertSeverity('success');
      setEditingResourceId(null);
    } catch (error) {
      setAlertMessage('Error updating the resource');
      setAlertSeverity('error');
    } finally {
      setTimeout(() => setAlertMessage(null), 5000);
    }
  };

  const handleDeleteResource = async (id: number) => {
    if (!companyId) {
      setAlertMessage('The company was not found for the user');
      setAlertSeverity('error');
      setTimeout(() => setAlertMessage(null), 5000);
      return;
    }
    try {
      await deleteResource({ resourceId: id, companyId }).unwrap();
      setAlertMessage('The resource has been successfully deleted');
      setAlertSeverity('success');
    } catch (error) {
      setAlertMessage('Error deleting a resource');
      setAlertSeverity('error');
    } finally {
      setTimeout(() => setAlertMessage(null), 5000);
    }
  };

  const handleAddService = async (id: number) => {
    if (!companyId) {
      setAlertMessage('The company was not found for the user');
      setAlertSeverity('error');
      setTimeout(() => setAlertMessage(null), 5000);
      return;
    }
    try {
      const service = allServices?.find((s) => s.id === id);
      if (!service) throw new Error('Resource  not found');
      const request: CreateResourceRequest = {
        name: service.name!,
        type: service.type!,
        source: service.source!,
        companyId,
        status: service.resourceStatus,
      };
      await addService({ companyId, resource: request }).unwrap();
      setAlertMessage('Resource was successfully added to the company');
      setAlertSeverity('success');
    } catch (error) {
      setAlertMessage('Error when adding a resource');
      setAlertSeverity('error');
    } finally {
      setTimeout(() => setAlertMessage(null), 5000);
    }
  };

  if (isLoadingUser) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (userError) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity='error'>Error uploading user data:</Alert>
      </Box>
    );
  }

  if (!companyId) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity='error'>
          The user is not an employee of the company
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 2, bgcolor: theme.palette.background.paper }}>
        <Typography
          variant='h5'
          sx={{ mb: 2, color: theme.palette.text.primary }}
        >
          Resources
        </Typography>

        <Fade in={!!alertMessage}>
          <Box sx={{ mb: 2 }}>
            {alertMessage && (
              <Alert
                severity={alertSeverity}
                onClose={() => setAlertMessage(null)}
                sx={{ borderRadius: 1 }}
              >
                {alertMessage}
              </Alert>
            )}
          </Box>
        </Fade>

        <Box sx={{ mb: 4 }}>
          <Typography variant='h6' sx={{ mb: 2 }}>
            Add Resource
          </Typography>
          <Formik
            initialValues={{
              name: '',
              type: '',
              source: '',
              status: ResourceStatus.Active,
            }}
            validationSchema={validationSchema}
            onSubmit={handleAddResource}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form>
                <Stack spacing={2}>
                  <Field
                    as={TextField}
                    name='name'
                    label='Name'
                    size='small'
                    fullWidth
                    error={touched.name && !!errors.name}
                    helperText={touched.name && errors.name}
                  />
                  <Field
                    as={TextField}
                    name='type'
                    label='Type'
                    size='small'
                    fullWidth
                    error={touched.type && !!errors.type}
                    helperText={touched.type && errors.type}
                  />
                  <Field
                    as={TextField}
                    name='source'
                    label='Resource'
                    size='small'
                    fullWidth
                    error={touched.source && !!errors.source}
                    helperText={touched.source && errors.source}
                  />
                  <FormControl fullWidth size='small'>
                    <InputLabel>Статус</InputLabel>
                    <Field
                      as={Select}
                      name='status'
                      label='Status'
                      error={touched.status && !!errors.status}
                    >
                      {Object.values(ResourceStatus).map((status) => (
                        <MenuItem key={status} value={status}>
                          {status}
                        </MenuItem>
                      ))}
                    </Field>
                    {touched.status && errors.status && (
                      <Typography variant='caption' color='error'>
                        {errors.status}
                      </Typography>
                    )}
                  </FormControl>
                  <Button
                    type='submit'
                    variant='contained'
                    disabled={isSubmitting || isCreating}
                    sx={{ mt: 2, bgcolor: theme.palette.secondary.main }}
                  >
                    {isSubmitting || isCreating
                      ? 'Addendum...'
                      : 'Add Resource'}
                  </Button>
                </Stack>
              </Form>
            )}
          </Formik>
        </Box>

        <Typography
          variant='h6'
          sx={{ mb: 2, color: theme.palette.text.primary }}
        >
          All company resources
        </Typography>
        {isLoadingCompanyResources ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Stack spacing={2}>
            {companyResources?.map((resource) => (
              <Card
                key={resource.id}
                sx={{ p: 2, border: '1px solid #E0E0E0', borderRadius: 2 }}
              >
                <CardContent>
                  {editingResourceId === resource.id ? (
                    <Formik
                      initialValues={{
                        name: resource.name || '',
                        type: resource.type || '',
                        source: resource.source || '',
                        status:
                          resource.resourceStatus || ResourceStatus.Active,
                      }}
                      validationSchema={validationSchema}
                      onSubmit={(values) =>
                        handleUpdateResource(resource.id!, values)
                      }
                    >
                      {({ errors, touched, submitForm, resetForm }) => (
                        <Form>
                          <Stack
                            direction='row'
                            spacing={1}
                            alignItems='center'
                          >
                            <Field
                              as={TextField}
                              name='name'
                              size='small'
                              error={touched.name && !!errors.name}
                              helperText={touched.name && errors.name}
                            />
                            <Field
                              as={TextField}
                              name='type'
                              size='small'
                              error={touched.type && !!errors.type}
                              helperText={touched.type && errors.type}
                            />
                            <Field
                              as={TextField}
                              name='source'
                              size='small'
                              error={touched.source && !!errors.source}
                              helperText={touched.source && errors.source}
                            />
                            <FormControl size='small'>
                              <InputLabel>Status</InputLabel>
                              <Field
                                as={Select}
                                name='status'
                                label='Status'
                                error={touched.status && !!errors.status}
                              >
                                {Object.values(ResourceStatus).map((status) => (
                                  <MenuItem key={status} value={status}>
                                    {status}
                                  </MenuItem>
                                ))}
                              </Field>
                            </FormControl>
                            <IconButton onClick={submitForm} color='success'>
                              <CheckIcon />
                            </IconButton>
                            <IconButton
                              onClick={() => {
                                setEditingResourceId(null);
                                resetForm();
                              }}
                              color='error'
                            >
                              <CloseIcon />
                            </IconButton>
                          </Stack>
                        </Form>
                      )}
                    </Formik>
                  ) : (
                    <>
                      <Typography variant='body2' color='textSecondary'>
                        Name: {resource.name}
                      </Typography>
                      <Typography variant='body2' color='textSecondary'>
                        Type: {resource.type}
                      </Typography>
                      <Typography variant='body2' color='textSecondary'>
                        Source: {resource.source || 'N/A'}
                      </Typography>
                      <Typography variant='body2' color='textSecondary'>
                        Status: {resource.resourceStatus}
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                          mt: 1,
                        }}
                      >
                        <IconButton
                          onClick={() => setEditingResourceId(resource.id!)}
                          color='default'
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteResource(resource.id!)}
                          color='error'
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}

        <Typography
          variant='h6'
          sx={{ mb: 2, mt: 4, color: theme.palette.text.primary }}
        >
          Все сервисы
        </Typography>
        {isLoadingAllServices ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Stack spacing={2}>
            {allServices?.map((service) => (
              <Card
                key={service.id}
                sx={{ p: 2, border: '1px solid #E0E0E0', borderRadius: 2 }}
              >
                <CardContent>
                  <Typography variant='body2' color='textSecondary'>
                    Name: {service.name}
                  </Typography>
                  <Typography variant='body2' color='textSecondary'>
                    Type: {service.type}
                  </Typography>
                  <Typography variant='body2' color='textSecondary'>
                    Resource: {service.source}
                  </Typography>
                  <Typography variant='body2' color='textSecondary'>
                    Status: {service.resourceStatus}
                  </Typography>
                  <Box
                    sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}
                  >
                    <IconButton
                      onClick={() => handleAddService(service.id!)}
                      color='success'
                    >
                      <AddIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
}
