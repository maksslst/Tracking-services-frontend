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
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Sidebar from '../sidebar/sidebar';
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';
import {
  useCreateCompanyMutation,
  useDeleteCompanyMutation,
  useUpdateCompanyMutation,
  useGetAllCompaniesQuery,
} from '../../api/companyApiSlice';

export default function CompanyManagementPage() {
  const theme = useTheme();
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>(
    'success'
  );
  const [editingCompanyId, setEditingCompanyId] = useState<number | null>(null);

  const [createCompany, { isLoading: isCreating }] = useCreateCompanyMutation();
  const [deleteCompany] = useDeleteCompanyMutation();
  const [updateCompany] = useUpdateCompanyMutation();

  const { data: companies, isLoading, refetch } = useGetAllCompaniesQuery();

  const validationSchema = yup.object({
    companyName: yup.string().required('Company name is required'),
  });

  const handleAddCompany = async (
    values: { companyName: string },
    { resetForm }: any
  ) => {
    try {
      await createCompany(values).unwrap();
      setAlertMessage('The company has been successfully added');
      setAlertSeverity('success');
      resetForm();
    } catch (error) {
      setAlertMessage('Couldnt create a company');
      setAlertSeverity('error');
    }
  };

  const handleDeleteCompany = async (id: number) => {
    try {
      await deleteCompany({ companyId: id }).unwrap();
      setAlertMessage('Company deleted');
      setAlertSeverity('success');
    } catch (error) {
      setAlertMessage('Error when deleting a company');
      setAlertSeverity('error');
    }
  };

  const handleUpdateCompany = async (id: number, newName: string) => {
    try {
      await updateCompany({ id, companyName: newName }).unwrap();
      setAlertMessage('Company name updated');
      setAlertSeverity('success');
      setEditingCompanyId(null);
      refetch();
    } catch (error) {
      setAlertMessage('Error when updating the company');
      setAlertSeverity('error');
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 2, bgcolor: theme.palette.background.paper }}>
        <Typography
          variant='h5'
          sx={{ mb: 2, color: theme.palette.text.primary }}
        >
          Company Management
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
          <Formik
            initialValues={{ companyName: '' }}
            validationSchema={validationSchema}
            onSubmit={handleAddCompany}
          >
            {({ errors, touched }) => (
              <Form>
                <Stack spacing={2}>
                  <Field
                    as={TextField}
                    name='companyName'
                    label='Enter company name'
                    margin='normal'
                    size='small'
                    fullWidth
                    error={touched.companyName && !!errors.companyName}
                    helperText={touched.companyName && errors.companyName}
                  />
                  <Button
                    type='submit'
                    variant='contained'
                    disabled={isCreating}
                    sx={{
                      borderRadius: 1,
                      bgcolor: theme.palette.secondary.main,
                      color: theme.palette.getContrastText(
                        theme.palette.secondary.main
                      ),
                    }}
                  >
                    {isCreating ? 'Creating...' : 'Add company'}
                  </Button>
                </Stack>
              </Form>
            )}
          </Formik>
        </Box>

        <Stack spacing={2}>
          {isLoading ? (
            <Typography>Loading companies...</Typography>
          ) : (
            companies?.map((company) => (
              <Card
                key={company.id}
                sx={{ p: 2, border: '1px solid #E0E0E0', borderRadius: 2 }}
              >
                <CardContent>
                  {editingCompanyId === company.id ? (
                    <Formik
                      initialValues={{ companyName: company.companyName || '' }}
                      validationSchema={validationSchema}
                      onSubmit={(values) =>
                        handleUpdateCompany(company.id!, values.companyName)
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
                              name='companyName'
                              size='small'
                              error={
                                touched.companyName && !!errors.companyName
                              }
                              helperText={
                                touched.companyName && errors.companyName
                              }
                            />
                            <IconButton onClick={submitForm} color='success'>
                              <CheckIcon />
                            </IconButton>
                            <IconButton
                              onClick={() => {
                                setEditingCompanyId(null);
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
                        {company.companyName}
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                          mt: 1,
                        }}
                      >
                        <IconButton
                          onClick={() => setEditingCompanyId(company.id!)}
                          color='default'
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteCompany(company.id!)}
                          color='error'
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </Stack>
      </Box>
    </Box>
  );
}
