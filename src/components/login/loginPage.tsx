import React from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();

  const handleSignInClick = () => {
    navigate('/register');
  };

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
        style={{ color: '#000000', fontWeight: 'bold' }}
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
        label='Enter password'
        type='password'
        autoComplete='current-password'
        margin='normal'
        size='small'
        fullWidth
      />
      <Button fullWidth variant='contained' color='secondary' size='medium'>
        Login
      </Button>
      <Typography variant='body2' sx={{ color: 'text.secondary', mt: 1 }}>
        Dont have an account?
        <Link
          to='/register'
          onClick={handleSignInClick}
          style={{
            textDecoration: 'underline',
            color: 'secondary.main',
            cursor: 'pointer',
          }}
        >
          Sign up
        </Link>
      </Typography>
    </Box>
  );
}
