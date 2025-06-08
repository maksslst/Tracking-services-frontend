import React from 'react';
import { Box, Typography, Card, CardContent, Stack } from '@mui/material';
import Sidebar from '../sidebar/sidebar';
import { useTheme } from '@mui/material/styles';

import { useUserInfoQuery } from '../../api/userApiSlice';
import { useGetCompanyUsersQuery } from '../../api/companyApiSlice';
import { useGetCompanyResourcesQuery } from '../../api/resourceApiSlice';
import { useGetAllUserTasksQuery } from '../../api/taskApiSlice';

export default function MainPage() {
  const theme = useTheme();
  const { data: user, isLoading: userLoading } = useUserInfoQuery({});
  const companyId = user?.companyId;
  const userId = user?.id;
  const { data: userTasks, isLoading: tasksLoading } = useGetAllUserTasksQuery(
    { userId: userId! },
    { skip: !userId }
  );
  const { data: companyUsers, isLoading: usersLoading } =
    useGetCompanyUsersQuery({ companyId: companyId! }, { skip: !companyId });
  const { data: companyResources, isLoading: resourcesLoading } =
    useGetCompanyResourcesQuery(
      { companyId: companyId! },
      { skip: !companyId }
    );

  if (userLoading || usersLoading || resourcesLoading || tasksLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 2, bgcolor: theme.palette.background.paper }}>
        <Typography
          variant='h4'
          sx={{ mb: 4, color: theme.palette.text.primary, fontWeight: 'bold' }}
        >
          Welcome, {user?.firstName}!
        </Typography>
        <Stack direction='row' spacing={2} sx={{ mb: 4 }}>
          <Card
            sx={{
              width: 200,
              bgcolor: '#FF9800',
              color: '#fff',
              borderRadius: 2,
            }}
          >
            <CardContent>
              <Typography variant='h6' align='center'>
                Users in Company
              </Typography>
              <Typography variant='h4' align='center'>
                {companyUsers?.length ?? 0}
              </Typography>
            </CardContent>
          </Card>

          <Card
            sx={{
              width: 200,
              bgcolor: '#9C27B0',
              color: '#fff',
              borderRadius: 2,
            }}
          >
            <CardContent>
              <Typography variant='h6' align='center'>
                Resources
              </Typography>
              <Typography variant='h4' align='center'>
                {companyResources?.length ?? 0}
              </Typography>
            </CardContent>
          </Card>
          <Card
            sx={{
              width: 200,
              bgcolor: '#4caf50',
              color: '#fff',
              borderRadius: 2,
            }}
          >
            <CardContent>
              <Typography variant='h6' align='center'>
                Active Tasks
              </Typography>
              <Typography variant='h4' align='center'>
                {userTasks?.length ?? 0}
              </Typography>
            </CardContent>
          </Card>
        </Stack>
      </Box>
    </Box>
  );
}
