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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Sidebar from '../sidebar/sidebar';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  useAddCompanyResourceMutation,
  useUpdateCompanyResourceMutation,
  useDeleteCompanyResourceMutation,
  useGetCompanyResourcesQuery,
  ResourceStatus,
  ResourceDto,
} from '../../api/resourceApiSlice';
import {
  useCreateMonitoringSettingMutation,
  useUpdateMonitoringSettingMutation,
} from '../../api/monitoringSettingApiSlice';
import { useUserInfoQuery } from '../../api/userApiSlice';

interface ResourceFormValues {
  name: string;
  type: string;
  source: string;
  checkInterval: string;
  mode: boolean;
  status: ResourceStatus;
}

export default function MonitoringPage() {
  const theme = useTheme();
  const [selectedResourceId, setSelectedResourceId] = useState<number | null>(
    null
  );
  const [alert, setAlert] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const {
    data: user,
    isLoading: isUserLoading,
    error: userError,
  } = useUserInfoQuery({});

  const companyId = user?.companyId;
  const { data: resources, isLoading: isResourcesLoading } =
    useGetCompanyResourcesQuery(
      { companyId: companyId ?? 0 },
      { skip: !companyId }
    );
  const [addCompanyResource, { isLoading: isAdding }] =
    useAddCompanyResourceMutation();
  const [updateCompanyResource, { isLoading: isUpdating }] =
    useUpdateCompanyResourceMutation();
  const [deleteCompanyResource, { isLoading: isDeleting }] =
    useDeleteCompanyResourceMutation();
  const [createMonitoringSetting] = useCreateMonitoringSettingMutation();
  const [updateMonitoringSetting] = useUpdateMonitoringSettingMutation();

  const formik = useFormik<ResourceFormValues>({
    initialValues: {
      name: '',
      type: '',
      source: '',
      checkInterval: 'Every 5 minutes',
      mode: true,
      status: ResourceStatus.Active,
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Resource name is required'),
      type: Yup.string().required('Type is required'),
      source: Yup.string().url('Invalid URL').required('Source is required'),
      checkInterval: Yup.string().required('Check interval is required'),
      mode: Yup.boolean().required('Mode is required'),
      status: Yup.string()
        .oneOf(Object.values(ResourceStatus) as string[], 'Invalid status')
        .required('Status is required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      if (!companyId) {
        setAlert({ type: 'error', message: 'Company ID is unavailable' });
        return;
      }

      try {
        if (selectedResourceId) {
          await updateCompanyResource({
            companyId,
            resourceId: selectedResourceId,
            resource: {
              id: selectedResourceId,
              name: values.name,
              type: values.type,
              source: values.source,
              status: values.status,
            },
          }).unwrap();

          await updateMonitoringSetting({
            id: selectedResourceId,
            resourceId: selectedResourceId,
            checkInterval: values.checkInterval,
            mode: values.mode,
          }).unwrap();

          setAlert({
            type: 'success',
            message: 'Resource updated successfully',
          });
        } else {
          const createResourceResponse = await addCompanyResource({
            companyId,
            resource: {
              name: values.name,
              type: values.type,
              source: values.source,
              companyId,
              status: values.status,
            },
          }).unwrap();

          await createMonitoringSetting({
            resourceId: 0,
            checkInterval: values.checkInterval,
            mode: values.mode,
          }).unwrap();

          setAlert({
            type: 'success',
            message: 'Resource created successfully',
          });
          resetForm();
        }
        setSelectedResourceId(null);
      } catch (error) {
        setAlert({ type: 'error', message: 'Failed to save resource' });
      }
    },
  });

  const handleEditResource = (resourceId: number) => {
    const resource = resources?.find((r: ResourceDto) => r.id === resourceId);
    if (resource) {
      setSelectedResourceId(resourceId);
      formik.setValues({
        name: resource.name || '',
        type: resource.type || '',
        source: resource.source || '',
        checkInterval: 'Every 5 minutes', // Default value
        mode: true, // Default value
        status: resource.resourceStatus || ResourceStatus.Active,
      });
    }
  };

  const handleDeleteResource = async (resourceId: number) => {
    if (!companyId) {
      setAlert({ type: 'error', message: 'Company ID is unavailable' });
      return;
    }

    try {
      await deleteCompanyResource({ resourceId, companyId }).unwrap();
      setAlert({ type: 'success', message: 'Resource deleted successfully' });
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to delete resource' });
    }
  };

  const handleCancelEdit = () => {
    setSelectedResourceId(null);
    formik.resetForm();
  };

  if (isUserLoading) {
    return <CircularProgress />;
  }

  if (userError || !companyId) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity='error'>Failed to load user data or company ID</Alert>
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
          Monitoring
        </Typography>

        {alert && (
          <Alert
            severity={alert.type}
            sx={{ mb: 2 }}
            onClose={() => setAlert(null)}
          >
            {alert.message}
          </Alert>
        )}

        <Box sx={{ mb: 4 }}>
          <form onSubmit={formik.handleSubmit}>
            <Stack spacing={2}>
              <FormControl fullWidth>
                <InputLabel id='resource-type-label'>Resource Type</InputLabel>
                <Select
                  labelId='resource-type-label'
                  name='type'
                  value={formik.values.type}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.type && Boolean(formik.errors.type)}
                  label='Resource Type'
                >
                  <MenuItem value='Web'>Web</MenuItem>
                  <MenuItem value='API'>API</MenuItem>
                </Select>
                {formik.touched.type && formik.errors.type && (
                  <Typography color='error' variant='caption'>
                    {formik.errors.type}
                  </Typography>
                )}
              </FormControl>

              <TextField
                label='Enter resource name'
                name='name'
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                margin='normal'
                size='small'
                fullWidth
              />

              <TextField
                label='Enter source URL'
                name='source'
                value={formik.values.source}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.source && Boolean(formik.errors.source)}
                helperText={formik.touched.source && formik.errors.source}
                margin='normal'
                size='small'
                fullWidth
              />

              <TextField
                label='Enter check interval'
                name='checkInterval'
                value={formik.values.checkInterval}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.checkInterval &&
                  Boolean(formik.errors.checkInterval)
                }
                helperText={
                  formik.touched.checkInterval && formik.errors.checkInterval
                }
                margin='normal'
                size='small'
                fullWidth
              />

              <FormControl fullWidth>
                <InputLabel id='mode-label'>Mode</InputLabel>
                <Select
                  labelId='mode-label'
                  name='mode'
                  value={formik.values.mode.toString()}
                  onChange={(e) =>
                    formik.setFieldValue('mode', e.target.value === 'true')
                  }
                  onBlur={formik.handleBlur}
                  error={formik.touched.mode && Boolean(formik.errors.mode)}
                  label='Enter mode'
                >
                  <MenuItem value='true'>Enabled</MenuItem>
                  <MenuItem value='false'>Disabled</MenuItem>
                </Select>
                {formik.touched.mode && formik.errors.mode && (
                  <Typography color='error' variant='caption'>
                    {formik.errors.mode}
                  </Typography>
                )}
              </FormControl>

              <FormControl fullWidth>
                <InputLabel id='status-label'>Status</InputLabel>
                <Select
                  labelId='status-label'
                  name='status'
                  value={formik.values.status}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.status && Boolean(formik.errors.status)}
                  label='Status'
                >
                  {Object.values(ResourceStatus).map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.status && formik.errors.status && (
                  <Typography color='error' variant='caption'>
                    {formik.errors.status}
                  </Typography>
                )}
              </FormControl>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  type='submit'
                  variant='contained'
                  disabled={isAdding || isUpdating || !companyId}
                  sx={{ mt: 1 }}
                >
                  {isAdding || isUpdating ? (
                    <CircularProgress size={24} />
                  ) : selectedResourceId ? (
                    'Update'
                  ) : (
                    'Add'
                  )}{' '}
                  Resource
                </Button>
                {selectedResourceId && (
                  <Button
                    variant='outlined'
                    onClick={handleCancelEdit}
                    sx={{ mt: 1 }}
                  >
                    Cancel
                  </Button>
                )}
              </Box>
            </Stack>
          </form>
        </Box>

        <Typography
          variant='h6'
          sx={{ mb: 2, color: theme.palette.text.primary }}
        >
          All Company Resources
        </Typography>

        {isResourcesLoading ? (
          <CircularProgress />
        ) : (
          <Stack spacing={2}>
            {resources?.map((resource: ResourceDto) => (
              <Card
                key={resource.id}
                sx={{ p: 2, border: '1px solid #E0E0E0', borderRadius: 2 }}
              >
                <CardContent>
                  <Typography variant='body2' color='textSecondary'>
                    Resource: {resource.name}
                  </Typography>
                  <Typography variant='body2' color='textSecondary'>
                    Type: {resource.type}
                  </Typography>
                  <Typography variant='body2' color='textSecondary'>
                    Source: {resource.source}
                  </Typography>
                  <Typography variant='body2' color='textSecondary'>
                    Status: {resource.resourceStatus}
                  </Typography>
                  <Box
                    sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}
                  >
                    <IconButton
                      onClick={() => handleEditResource(resource.id ?? 0)}
                      color='default'
                      disabled={isDeleting}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteResource(resource.id ?? 0)}
                      color='error'
                      disabled={isDeleting}
                    >
                      <DeleteIcon />
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
