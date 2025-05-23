import React, { useState, ChangeEvent } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Stack,
  IconButton,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import Sidebar from '../sidebar/sidebar';
import { TaskDto } from '../../api/models/task';
import { TaskStatus } from '../../api/enums/taskStatus';

export default function TaskPage() {
  const [taskForm, setTaskForm] = useState({
    resourceId: '',
    assignedUserId: '',
    description: '',
    taskStatus: 'Opened' as TaskStatus,
  });

  const tasks: TaskDto[] = [
    {
      id: 1,
      resourceId: 1,
      description: 'test',
      assignedUserId: 1,
      createdById: 1,
      taskStatus: TaskStatus.Opened,
    },
  ];

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setTaskForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddTask = () => {
    return;
  };

  const handleCompleteTask = (id: number) => {
    return;
  };

  const handleDeleteTask = (id: number) => {
    return;
  };

  const handleEditTask = (id: number) => {
    return;
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 2, bgcolor: '#F5F5F5' }}>
        <Typography variant='h5' sx={{ mb: 2, color: '#000000' }}>
          Tasks
        </Typography>
        <Box sx={{ mb: 4 }}>
          <Button
            variant='outlined'
            sx={{ mb: 2, borderColor: '#757575', color: '#000000' }}
          >
            Add task
          </Button>
          <Stack spacing={2}>
            <TextField
              label='Select a resource ID'
              name='resourceId'
              value={taskForm.resourceId}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label='Select the user ID to whom the task is assigned'
              name='assignedUserId'
              value={taskForm.assignedUserId}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label='Enter description'
              name='description'
              value={taskForm.description}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={2}
            />
            <TextField
              label='Select status'
              name='taskStatus'
              value={taskForm.taskStatus}
              onChange={handleInputChange}
              fullWidth
              select
              SelectProps={{ native: true }}
            >
              <option value={TaskStatus.Opened}>Opened</option>
              <option value={TaskStatus.Completed}>Completed</option>
              <option value={TaskStatus.InProgress}>In Progress</option>
            </TextField>
            <Button
              variant='outlined'
              onClick={handleAddTask}
              sx={{ mt: 1, borderColor: '#757575', color: '#000000' }}
            >
              Add task
            </Button>
          </Stack>
        </Box>
        <Stack spacing={2}>
          {tasks.map((task) => (
            <Card
              key={task.id}
              sx={{ p: 2, border: '1px solid #E0E0E0', borderRadius: 2 }}
            >
              <CardContent>
                <Typography variant='body2' color='textSecondary'>
                  Resource: {task.resourceId}
                </Typography>
                <Typography variant='body2' color='textSecondary'>
                  Creator: {task.createdById}
                </Typography>
                <Typography variant='body2' color='textSecondary'>
                  Description: {task.description}
                </Typography>
                <Typography variant='body2' color='textSecondary'>
                  Status: {task.taskStatus}
                </Typography>
                <Box
                  sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}
                >
                  <IconButton
                    onClick={() => handleCompleteTask(task.id ?? 0)}
                    color={
                      task.taskStatus === TaskStatus.Completed
                        ? 'success'
                        : 'default'
                    }
                  >
                    <CheckCircleIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleEditTask(task.id ?? 0)}
                    color='default'
                  >
                    <SettingsIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteTask(task.id ?? 0)}
                    color='error'
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
