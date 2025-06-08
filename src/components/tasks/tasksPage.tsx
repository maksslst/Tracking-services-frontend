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
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Sidebar from '../sidebar/sidebar';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useGetTaskByIdQuery,
  useGetAllUserTasksQuery,
} from '../../api/taskApiSlice';
import { useUserInfoQuery } from '../../api/userApiSlice';
import { useGetCompanyResourcesQuery } from '../../api/resourceApiSlice';
import { useGetCompanyUsersQuery } from '../../api/companyApiSlice';
import { TaskStatus } from '../../api/enums/taskStatus';

const validationSchema = Yup.object({
  resourceId: Yup.number()
    .required('Resource is required')
    .min(1, 'Select a resource'),
  assignedUserId: Yup.number()
    .required('Assigned user is required')
    .min(1, 'Select a assigned user'),
  description: Yup.string()
    .required('Description is required')
    .min(3, 'The description must be at least 3 characters long'),
  taskStatus: Yup.string()
    .oneOf(Object.values(TaskStatus), 'Incorrect status')
    .required('Status is required'),
});

interface TaskFormValues {
  resourceId: number;
  assignedUserId: number;
  description: string;
  taskStatus: TaskStatus;
}

export default function TaskPage() {
  const theme = useTheme();
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>(
    'success'
  );
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);

  const {
    data: user,
    isLoading: isLoadingUser,
    error: userError,
  } = useUserInfoQuery(undefined);
  const companyId = user?.companyId;
  const userId = user?.id;

  const {
    data: companyResources,
    isLoading: isLoadingResources,
    error: resourcesError,
  } = useGetCompanyResourcesQuery(
    { companyId: companyId! },
    { skip: !companyId }
  );
  const {
    data: companyUsers,
    isLoading: isLoadingUsers,
    error: usersError,
  } = useGetCompanyUsersQuery({ companyId: companyId! }, { skip: !companyId });

  const {
    data: tasks,
    isLoading: isLoadingTasks,
    error: tasksError,
  } = useGetAllUserTasksQuery({ userId: userId! }, { skip: !userId });

  const [createTask, { isLoading: isCreating, error: createError }] =
    useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  const handleAddTask = async (values: TaskFormValues, { resetForm }: any) => {
    console.log('handleAddTask called with values:', values);
    console.log('companyId:', companyId, 'userId:', userId);

    if (!companyId || !userId) {
      setAlertMessage('The company or user was not found');
      setAlertSeverity('error');
      setTimeout(() => setAlertMessage(null), 5000);
      return;
    }

    try {
      const response = await createTask({
        resourceId: values.resourceId,
        description: values.description,
        assignedUserId: values.assignedUserId,
        createdById: userId,
        status: values.taskStatus,
      }).unwrap();
      console.log('createTask response:', response);
      setAlertMessage('The task was successfully added');
      setAlertSeverity('success');
      resetForm();
    } catch (error) {
      console.error('createTask error:', error);
      setAlertMessage(`Error when creating a task`);
      setAlertSeverity('error');
    } finally {
      setTimeout(() => setAlertMessage(null), 5000);
    }
  };

  const handleUpdateTask = async (id: number, values: TaskFormValues) => {
    if (!companyId) {
      setAlertMessage('Company not found');
      setAlertSeverity('error');
      setTimeout(() => setAlertMessage(null), 5000);
      return;
    }
    try {
      await updateTask({
        id,
        resourceId: values.resourceId,
        description: values.description,
        assignedUserId: values.assignedUserId,
        status: values.taskStatus,
      }).unwrap();
      setAlertMessage('The issue has been successfully updated');
      setAlertSeverity('success');
      setEditingTaskId(null);
    } catch (error) {
      setAlertMessage(`Issue update error`);
      setAlertSeverity('error');
    } finally {
      setTimeout(() => setAlertMessage(null), 5000);
    }
  };

  const handleCompleteTask = async (id: number) => {
    if (!companyId) {
      setAlertMessage('Company not found');
      setAlertSeverity('error');
      setTimeout(() => setAlertMessage(null), 5000);
      return;
    }
    try {
      const { data: task } = useGetTaskByIdQuery({ taskId: id });
      if (!task) {
        setAlertMessage('Tаsk not found');
        setAlertSeverity('error');
        return;
      }
      await updateTask({
        id,
        resourceId: task.resourceId!,
        description: task.description!,
        assignedUserId: task.assignedUserId!,
        status: TaskStatus.Completed,
      }).unwrap();
      setAlertMessage('The task has been successfully completed');
      setAlertSeverity('success');
    } catch (error) {
      setAlertMessage(`Error at the end of the task`);
      setAlertSeverity('error');
    } finally {
      setTimeout(() => setAlertMessage(null), 5000);
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (!companyId) {
      setAlertMessage('Company not found');
      setAlertSeverity('error');
      setTimeout(() => setAlertMessage(null), 5000);
      return;
    }
    try {
      await deleteTask({ taskId: id }).unwrap();
      setAlertMessage('Задача успешно удалена!');
      setAlertSeverity('success');
    } catch (error) {
      setAlertMessage(`The task was successfully deleted`);
      setAlertSeverity('error');
    } finally {
      setTimeout(() => setAlertMessage(null), 5000);
    }
  };

  const createTaskStatuses = Object.values(TaskStatus).filter(
    (status) => status !== TaskStatus.Completed
  );

  if (isLoadingUser || isLoadingResources || isLoadingUsers || isLoadingTasks) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (userError || resourcesError || usersError || tasksError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity='error'>
          Data upload error:{' '}
          {JSON.stringify(
            userError || resourcesError || usersError || tasksError
          )}
        </Alert>
      </Box>
    );
  }

  if (!companyId || !userId) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity='error'>
          The user is not an employee of the companies or has not been found
        </Alert>
      </Box>
    );
  }

  if (!companyResources?.length || !companyUsers?.length) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity='warning'>
          There are no available resources or users to create the task
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 3, bgcolor: theme.palette.background.paper }}>
        <Typography variant='h5' color='primary' sx={{ mb: 2 }}>
          Tasks
        </Typography>

        <Fade in={!!alertMessage}>
          <Box sx={{ mb: 3 }}>
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

        <Box sx={{ mb: 4, maxWidth: 600 }}>
          <Typography variant='h6' color='text.secondary' sx={{ mb: 2 }}>
            Добавить задачу
          </Typography>
          <Formik
            initialValues={{
              resourceId: 0,
              assignedUserId: 0,
              description: '',
              taskStatus: TaskStatus.Opened,
            }}
            validationSchema={validationSchema}
            onSubmit={handleAddTask}
          >
            {({ errors, touched, isSubmitting, values, setFieldValue }) => (
              <Form>
                <Stack spacing={2}>
                  <FormControl
                    fullWidth
                    size='small'
                    error={touched.resourceId && !!errors.resourceId}
                  >
                    <InputLabel id='resourceId-label'>Ресурс</InputLabel>
                    <Select
                      labelId='resourceId-label'
                      name='resourceId'
                      value={values.resourceId}
                      label='Resource'
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        console.log('resourceId onChange:', value);
                        setFieldValue('resourceId', isNaN(value) ? 0 : value);
                      }}
                    >
                      <MenuItem value={0} disabled>
                        Select a resource
                      </MenuItem>
                      {companyResources.map((resource) => (
                        <MenuItem key={resource.id} value={resource.id}>
                          {resource.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {touched.resourceId && errors.resourceId && (
                      <Typography variant='caption' color='error'>
                        {errors.resourceId}
                      </Typography>
                    )}
                  </FormControl>
                  <FormControl
                    fullWidth
                    size='small'
                    error={touched.assignedUserId && !!errors.assignedUserId}
                  >
                    <InputLabel id='assignedUserId-label'>
                      Assigned user
                    </InputLabel>
                    <Select
                      labelId='assignedUserId-label'
                      name='assignedUserId'
                      value={values.assignedUserId}
                      label='Assigned user'
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        console.log('assignedUserId onChange:', value);
                        setFieldValue(
                          'assignedUserId',
                          isNaN(value) ? 0 : value
                        );
                      }}
                    >
                      <MenuItem value={0} disabled>
                        Select a user
                      </MenuItem>
                      {companyUsers.map((user) => (
                        <MenuItem key={user.id} value={user.id}>
                          {user.username}
                        </MenuItem>
                      ))}
                    </Select>
                    {touched.assignedUserId && errors.assignedUserId && (
                      <Typography variant='caption' color='error'>
                        {errors.assignedUserId}
                      </Typography>
                    )}
                  </FormControl>
                  <Field
                    as={TextField}
                    name='description'
                    label='Description'
                    size='small'
                    fullWidth
                    multiline
                    rows={2}
                    error={touched.description && !!errors.description}
                    helperText={touched.description && errors.description}
                  />
                  <FormControl
                    fullWidth
                    size='small'
                    error={touched.taskStatus && !!errors.taskStatus}
                  >
                    <InputLabel id='taskStatus-label'>Статус</InputLabel>
                    <Select
                      labelId='taskStatus-label'
                      name='taskStatus'
                      value={values.taskStatus}
                      label='Status'
                      onChange={(e) => {
                        console.log('taskStatus onChange:', e.target.value);
                        setFieldValue('taskStatus', e.target.value);
                      }}
                    >
                      {createTaskStatuses.map((status) => (
                        <MenuItem key={status} value={status}>
                          {status}
                        </MenuItem>
                      ))}
                    </Select>
                    {touched.taskStatus && errors.taskStatus && (
                      <Typography variant='caption' color='error'>
                        {errors.taskStatus}
                      </Typography>
                    )}
                  </FormControl>
                  <Button
                    type='submit'
                    variant='contained'
                    color='primary'
                    disabled={isSubmitting || isCreating}
                    sx={{ mt: 2 }}
                    onClick={() =>
                      console.log('Button state:', { isSubmitting, isCreating })
                    }
                  >
                    {isSubmitting || isCreating ? 'Addendum...' : 'Add a task'}
                  </Button>
                </Stack>
              </Form>
            )}
          </Formik>
        </Box>

        <Typography variant='h6' color='text.secondary' sx={{ mb: 2 }}>
          My tasks
        </Typography>
        {isLoadingTasks ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <CircularProgress />
          </Box>
        ) : tasks?.length === 0 ? (
          <Typography variant='body1' color='textSecondary'>
            You dont have any tasks
          </Typography>
        ) : (
          <Stack spacing={2}>
            {tasks?.map((task) => (
              <Card
                key={task.id}
                sx={{ p: 1, border: '1px solid #E0E0E0', borderRadius: 2 }}
              >
                <CardContent sx={{ p: 1 }}>
                  {editingTaskId === task.id ? (
                    <Formik
                      initialValues={{
                        resourceId: task.resourceId || 0,
                        assignedUserId: task.assignedUserId || 0,
                        description: task.description || '',
                        taskStatus: task.taskStatus || TaskStatus.Opened,
                      }}
                      validationSchema={validationSchema}
                      onSubmit={(values) => handleUpdateTask(task.id!, values)}
                    >
                      {({
                        errors,
                        touched,
                        submitForm,
                        resetForm,
                        values,
                        setFieldValue,
                      }) => (
                        <Form>
                          <Stack
                            direction='row'
                            spacing={1}
                            alignItems='center'
                            sx={{ flexWrap: 'wrap' }}
                          >
                            <FormControl
                              size='small'
                              sx={{ minWidth: 120 }}
                              error={touched.resourceId && !!errors.resourceId}
                            >
                              <InputLabel id='edit-resourceId-label'>
                                Resource
                              </InputLabel>
                              <Select
                                labelId='edit-resourceId-label'
                                name='resourceId'
                                value={values.resourceId}
                                label='Resource'
                                onChange={(e) => {
                                  const value = Number(e.target.value);
                                  console.log(
                                    'edit resourceId onChange:',
                                    value
                                  );
                                  setFieldValue(
                                    'resourceId',
                                    isNaN(value) ? 0 : value
                                  );
                                }}
                              >
                                <MenuItem value={0} disabled>
                                  Select a resource
                                </MenuItem>
                                {companyResources.map((resource) => (
                                  <MenuItem
                                    key={resource.id}
                                    value={resource.id}
                                  >
                                    {resource.name}
                                  </MenuItem>
                                ))}
                              </Select>
                              {touched.resourceId && errors.resourceId && (
                                <Typography variant='caption' color='error'>
                                  {errors.resourceId}
                                </Typography>
                              )}
                            </FormControl>
                            <FormControl
                              size='small'
                              sx={{ minWidth: 120 }}
                              error={
                                touched.assignedUserId &&
                                !!errors.assignedUserId
                              }
                            >
                              <InputLabel id='edit-assignedUserId-label'>
                                Assigned User
                              </InputLabel>
                              <Select
                                labelId='edit-assignedUserId-label'
                                name='assignedUserId'
                                value={values.assignedUserId}
                                label='Assigned User'
                                onChange={(e) => {
                                  const value = Number(e.target.value);
                                  console.log(
                                    'edit assignedUserId onChange:',
                                    value
                                  );
                                  setFieldValue(
                                    'assignedUserId',
                                    isNaN(value) ? 0 : value
                                  );
                                }}
                              >
                                <MenuItem value={0} disabled>
                                  Select a user
                                </MenuItem>
                                {companyUsers.map((user) => (
                                  <MenuItem key={user.id} value={user.id}>
                                    {user.username}
                                  </MenuItem>
                                ))}
                              </Select>
                              {touched.assignedUserId &&
                                errors.assignedUserId && (
                                  <Typography variant='caption' color='error'>
                                    {errors.assignedUserId}
                                  </Typography>
                                )}
                            </FormControl>
                            <Field
                              as={TextField}
                              name='description'
                              size='small'
                              multiline
                              rows={1}
                              sx={{ flexGrow: 1, minWidth: 200 }}
                              error={
                                touched.description && !!errors.description
                              }
                              helperText={
                                touched.description && errors.description
                              }
                            />
                            <FormControl
                              size='small'
                              sx={{ minWidth: 120 }}
                              error={touched.taskStatus && !!errors.taskStatus}
                            >
                              <InputLabel id='edit-taskStatus-label'>
                                Status
                              </InputLabel>
                              <Select
                                labelId='edit-taskStatus-label'
                                name='taskStatus'
                                value={values.taskStatus}
                                label='Status'
                                onChange={(e) => {
                                  console.log(
                                    'edit taskStatus onChange:',
                                    e.target.value
                                  );
                                  setFieldValue('taskStatus', e.target.value);
                                }}
                              >
                                {Object.values(TaskStatus).map((status) => (
                                  <MenuItem key={status} value={status}>
                                    {status}
                                  </MenuItem>
                                ))}
                              </Select>
                              {touched.taskStatus && errors.taskStatus && (
                                <Typography variant='caption' color='error'>
                                  {errors.taskStatus}
                                </Typography>
                              )}
                            </FormControl>
                            <IconButton
                              onClick={submitForm}
                              color='success'
                              size='small'
                            >
                              <CheckIcon />
                            </IconButton>
                            <IconButton
                              onClick={() => {
                                setEditingTaskId(null);
                                resetForm();
                              }}
                              color='error'
                              size='small'
                            >
                              <CloseIcon />
                            </IconButton>
                          </Stack>
                        </Form>
                      )}
                    </Formik>
                  ) : (
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Box>
                        <Typography variant='body2' color='textPrimary'>
                          {task.description}
                        </Typography>
                        <Typography variant='caption' color='textSecondary'>
                          Resource:{' '}
                          {companyResources?.find(
                            (r) => r.id === task.resourceId
                          )?.name || task.resourceId}
                        </Typography>
                        <Typography
                          variant='caption'
                          color='textSecondary'
                          sx={{ ml: 2 }}
                        >
                          Created:{' '}
                          {companyUsers?.find((u) => u.id === task.createdById)
                            ?.username || task.createdById}
                        </Typography>
                        <Typography
                          variant='caption'
                          color='textSecondary'
                          sx={{ ml: 2 }}
                        >
                          AssignedUser:{' '}
                          {companyUsers?.find(
                            (u) => u.id === task.assignedUserId
                          )?.username || task.assignedUserId}
                        </Typography>
                        <Typography
                          variant='caption'
                          color='textSecondary'
                          sx={{ ml: 2 }}
                        >
                          Status {task.taskStatus}
                        </Typography>
                      </Box>
                      <Box>
                        <IconButton
                          onClick={() => handleCompleteTask(task.id!)}
                          color={
                            task.taskStatus === TaskStatus.Completed
                              ? 'success'
                              : 'default'
                          }
                          size='small'
                        >
                          <CheckCircleIcon fontSize='small' />
                        </IconButton>
                        <IconButton
                          onClick={() => setEditingTaskId(task.id!)}
                          color='default'
                          size='small'
                        >
                          <SettingsIcon fontSize='small' />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteTask(task.id!)}
                          color='error'
                          size='small'
                        >
                          <DeleteIcon fontSize='small' />
                        </IconButton>
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
}
