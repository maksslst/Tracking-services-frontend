import React from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
} from '@mui/material';
import Sidebar from '../sidebar/sidebar';
import { useTheme } from '@mui/material/styles';

export default function MainPage() {
  const overviewData = [
    { title: 'Active Tasks', count: 5, color: '#4CAF50' },
    { title: 'Companies', count: 3, color: '#2196F3' },
    { title: 'Resources', count: 2, color: '#9C27B0' },
    { title: 'Users', count: 10, color: '#FF9800' },
  ];

  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 2, bgcolor: theme.palette.background.paper }}>
        <Typography
          variant='h4'
          sx={{ mb: 4, color: theme.palette.text.primary, fontWeight: 'bold' }}
        >
          Welcome to Tracking Services
        </Typography>
        <Stack direction='row' spacing={2} sx={{ mb: 4 }}>
          {overviewData.map((item, index) => (
            <Card
              key={index}
              sx={{
                width: 200,
                bgcolor: item.color,
                color: '#FFFFFF',
                borderRadius: 2,
              }}
            >
              <CardContent>
                <Typography variant='h6' align='center'>
                  {item.title}
                </Typography>
                <Typography variant='h4' align='center'>
                  {item.count}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
