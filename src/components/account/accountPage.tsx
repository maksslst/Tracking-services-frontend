import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../sidebar/sidebar';
import { UserDto } from '../../api/models/user';
import { Roles } from '../../api/enums/role';
import { useTheme } from '@mui/material/styles';

export default function AccountPage() {
  const mockUser: UserDto = {
    id: 1,
    username: 'TestUser',
    firstName: 'testFirstName',
    lastName: 'testLastName',
    patronymic: 'testPatronymic',
    email: 'test@mail.ru',
    role: Roles.Admin,
    companyId: 1,
  };

  const [avatarType, setAvatarType] = React.useState<'initials' | 'image'>(
    'initials'
  );

  const navigate = useNavigate();
  const theme = useTheme();

  const getInitials = () => {
    const firstInitial = mockUser.firstName?.charAt(0) || '';
    const lastInitial = mockUser.lastName?.charAt(0) || '';
    return firstInitial + lastInitial || 'A';
  };

  const handleAvatarTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newAvatarType: 'initials' | 'image'
  ) => {
    if (newAvatarType !== null) {
      setAvatarType(newAvatarType);
    }
  };

  const handleApply = () => {
    return;
  };

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 2, bgcolor: theme.palette.background.paper }}>
        <Typography
          variant='h5'
          sx={{ mb: 2, color: theme.palette.text.primary }}
        >
          Account
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Typography variant='h6' sx={{ color: theme.palette.text.primary }}>
            {mockUser.username}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography
              variant='body1'
              sx={{ color: theme.palette.text.secondary }}
            >
              {mockUser.role}
            </Typography>
            <Button
              variant='outlined'
              onClick={handleLogout}
              sx={{
                borderColor: theme.palette.text.secondary,
                color: theme.palette.text.primary,
              }}
            >
              Logout
            </Button>
          </Box>
        </Box>
        <Typography
          variant='body2'
          sx={{ color: theme.palette.text.secondary, mb: 2 }}
        >
          Avatar
        </Typography>
        <Typography
          variant='caption'
          sx={{ color: theme.palette.text.secondary, mb: 2, display: 'block' }}
        >
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
            {avatarType === 'initials' ? getInitials() : ''}
          </Avatar>
          <ToggleButtonGroup
            value={avatarType}
            exclusive
            onChange={handleAvatarTypeChange}
            sx={{ height: 40 }}
          >
            <ToggleButton
              value='initials'
              sx={{
                bgcolor: '#1976D2',
                color: '#FFFFFF',
                '&.Mui-selected': { bgcolor: '#1565C0' },
              }}
            >
              Initials
            </ToggleButton>
            <ToggleButton
              value='image'
              sx={{
                bgcolor: '#D3D3D3',
                color: theme.palette.text.primary,
                '&.Mui-selected': { bgcolor: '#B0B0B0' },
              }}
            >
              Image
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Typography
          variant='h6'
          sx={{ color: theme.palette.text.primary, mb: 2 }}
        >
          Personal information
        </Typography>
        <Typography
          variant='caption'
          sx={{ color: theme.palette.text.secondary, mb: 2, display: 'block' }}
        >
          Enter your details or change them
        </Typography>
        <Stack spacing={2} sx={{ maxWidth: 400 }}>
          <TextField
            label='First Name'
            defaultValue={mockUser.firstName}
            margin='normal'
            size='small'
            fullWidth
          />
          <TextField
            label='Last Name'
            defaultValue={mockUser.lastName}
            margin='normal'
            size='small'
            fullWidth
          />
          <TextField
            label='Patronymic'
            defaultValue={mockUser.patronymic}
            margin='normal'
            size='small'
            fullWidth
          />
          <TextField
            label='Email'
            defaultValue={mockUser.email}
            margin='normal'
            size='small'
            fullWidth
          />
        </Stack>
        <Typography
          variant='h6'
          sx={{ color: theme.palette.text.primary, mt: 4, mb: 2 }}
        >
          Password
        </Typography>
        <Typography
          variant='caption'
          sx={{ color: theme.palette.text.secondary, mb: 2, display: 'block' }}
        >
          Protect your data with a strong password
        </Typography>
        <Stack spacing={2} sx={{ maxWidth: 400 }}>
          <TextField
            label='Enter password'
            type='password'
            margin='normal'
            size='small'
            fullWidth
          />
        </Stack>
        <Button
          variant='outlined'
          onClick={handleApply}
          sx={{
            mt: 2,
            borderColor: theme.palette.text.secondary,
            color: theme.palette.text.primary,
          }}
        >
          Apply
        </Button>
      </Box>
    </Box>
  );
}
