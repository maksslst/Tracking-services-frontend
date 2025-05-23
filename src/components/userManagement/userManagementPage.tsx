import React from 'react';
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
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Sidebar from '../sidebar/sidebar';
import { UserDto } from '../../api/models/user';
import { Roles } from '../../api/enums/role';

export default function UserManagementPage() {
  const users: UserDto[] = [
    {
      id: 1,
      username: 'Test username',
      firstName: 'John',
      lastName: 'Doe',
      patronymic: 'Smith',
      email: 'john.doe@example.com',
      role: Roles.Admin,
      companyId: 1,
    },
    {
      id: 2,
      username: 'TestUser2',
      firstName: 'Jane',
      lastName: 'Smith',
      patronymic: 'Johnson',
      email: 'jane.smith@example.com',
      role: Roles.User,
      companyId: 1,
    },
  ];
  const handleAddUser = () => {
    return;
  };

  const handleEditUser = (id: number) => {
    return;
  };

  const handleDeleteUser = (id: number) => {
    return;
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 2, bgcolor: '#F5F5F5' }}>
        <Typography variant='h5' sx={{ mb: 2, color: '#000000' }}>
          User Management
        </Typography>
        <Box sx={{ mb: 4 }}>
          <Button
            variant='outlined'
            sx={{ mb: 2, borderColor: '#757575', color: '#000000' }}
          >
            Add user
          </Button>
          <Stack spacing={2}>
            <TextField
              label='Enter username'
              margin='normal'
              size='small'
              fullWidth
            />
            <TextField
              label='Enter firstName'
              margin='normal'
              size='small'
              fullWidth
            />
            <TextField
              label='Enter lastName'
              margin='normal'
              size='small'
              fullWidth
            />
            <TextField
              label='Enter patronymic'
              margin='normal'
              size='small'
              fullWidth
            />
            <TextField
              label='Enter email'
              margin='normal'
              size='small'
              fullWidth
            />
            <TextField
              label='Enter role'
              margin='normal'
              size='small'
              fullWidth
              select
              SelectProps={{ native: true }}
            >
              <option value={Roles.User}>User</option>
              <option value={Roles.Moderator}>Moderator</option>
              <option value={Roles.Admin}>Admin</option>
            </TextField>
            <TextField
              label='Enter password'
              type='password'
              margin='normal'
              size='small'
              fullWidth
            />
            <Button
              variant='outlined'
              onClick={handleAddUser}
              sx={{ mt: 1, borderColor: '#757575', color: '#000000' }}
            >
              Add user
            </Button>
          </Stack>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Button
            variant='outlined'
            sx={{ mb: 2, borderColor: '#757575', color: '#000000' }}
          >
            View all users
          </Button>
        </Box>
        <Stack spacing={2}>
          {users.map((user) => (
            <Card
              key={user.id}
              sx={{ p: 2, border: '1px solid #E0E0E0', borderRadius: 2 }}
            >
              <CardContent>
                <Typography variant='body2' color='textSecondary'>
                  Username: {user.username}
                </Typography>
                <Typography variant='body2' color='textSecondary'>
                  FirstName: {user.firstName}
                </Typography>
                <Typography variant='body2' color='textSecondary'>
                  LastName: {user.lastName}
                </Typography>
                <Typography variant='body2' color='textSecondary'>
                  Patronymic: {user.patronymic}
                </Typography>
                <Typography variant='body2' color='textSecondary'>
                  Email: {user.email}
                </Typography>
                <Typography variant='body2' color='textSecondary'>
                  Role: {user.role}
                </Typography>
                <Box
                  sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}
                >
                  <IconButton
                    onClick={() => handleEditUser(user.id ?? 0)}
                    color='default'
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteUser(user.id ?? 0)}
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
