import React from 'react';
import { Box, Typography, Alert } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Sidebar from '../sidebar/sidebar';
import { useUserInfoQuery } from '../../api/userApiSlice';
import {
  useGetCompanyByIdQuery,
  useGetCompanyUsersQuery,
} from '../../api/companyApiSlice';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

export default function CompanyPage() {
  const theme = useTheme();

  const {
    data: userInfo,
    isLoading: isUserLoading,
    error: userError,
  } = useUserInfoQuery({});
  const companyId = userInfo?.companyId;

  const {
    data: company,
    isLoading: isCompanyLoading,
    error: companyError,
  } = useGetCompanyByIdQuery({ companyId: companyId! }, { skip: !companyId });

  const {
    data: users,
    isLoading: isUsersLoading,
    error: usersError,
  } = useGetCompanyUsersQuery({ companyId: companyId! }, { skip: !companyId });

  if (isUserLoading || (companyId && (isCompanyLoading || isUsersLoading))) {
    return <Typography sx={{ m: 2 }}>Loading...</Typography>;
  }

  if (!companyId) {
    return (
      <Box sx={{ m: 2 }}>
        <Alert severity='warning'>You don t belong to the company</Alert>
      </Box>
    );
  }

  if (userError || companyError || usersError) {
    return (
      <Box sx={{ m: 2 }}>
        <Alert severity='error'>An error occurred when uploading data</Alert>
      </Box>
    );
  }

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Id', width: 70 },
    { field: 'username', headerName: 'Username', width: 150 },
    { field: 'firstName', headerName: 'FirstName', width: 150 },
    { field: 'lastName', headerName: 'LastName', width: 150 },
    { field: 'patronymic', headerName: 'Patronymic', width: 150 },
    { field: 'role', headerName: 'Role', width: 120 },
    { field: 'email', headerName: 'Email', width: 200 },
  ];

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 2, bgcolor: theme.palette.background.paper }}>
        <Typography variant='h5' sx={{ mb: 2 }}>
          {company?.companyName}
        </Typography>
        <Box sx={{ height: 500, width: '100%' }}>
          <DataGrid
            rows={users || []}
            columns={columns}
            disableRowSelectionOnClick
            hideFooter
          />
        </Box>
      </Box>
    </Box>
  );
}
