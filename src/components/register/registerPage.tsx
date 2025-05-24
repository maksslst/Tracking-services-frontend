import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Typography, TextField, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export default function RegisterPage() {
  const navigate = useNavigate();

  const handleSignInClick = () => {
    navigate('/login');
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
      <TextField
        required
        label='Enter username'
        margin='normal'
        size='small'
        fullWidth
      />
      <TextField
        required
        label='Enter firstName'
        margin='normal'
        size='small'
        fullWidth
      />
      <TextField
        required
        label='Enter lastName'
        margin='normal'
        size='small'
        fullWidth
      />
      <TextField
        required
        label='Enter patronymic'
        margin='normal'
        size='small'
        fullWidth
      />
      <TextField
        required
        label='Enter email'
        margin='normal'
        size='small'
        fullWidth
      />
      <TextField
        required
        label='Enter password'
        type='password'
        margin='normal'
        size='small'
        fullWidth
      />
      <TextField
        required
        label='Enter passwordConfirmation'
        type='password'
        margin='normal'
        size='small'
        fullWidth
      />
      <Button fullWidth variant='outlined' color='secondary' size='medium'>
        Register
      </Button>
      <Typography
        variant='body2'
        sx={{ color: theme.palette.text.secondary, mt: 1 }}
      >
        Already have an account?{' '}
        <Link
          to='/login'
          onClick={handleSignInClick}
          style={{
            textDecoration: 'underline',
            color: 'secondary.main',
            cursor: 'pointer',
          }}
        >
          Sign in
        </Link>
      </Typography>
    </Box>
  );
}
