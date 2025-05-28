import React from 'react';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Sidebar from '../sidebar/sidebar';
import { UserDto } from '../../api/models/user';
import { Roles } from '../../api/enums/role';
import { CompanyDto } from '../../api/models/company';
import { useTheme } from '@mui/material/styles';

export default function CompanyPage() {
  const company: CompanyDto = {
    id: 1,
    companyName: 'Test Company',
  };

  const users: UserDto[] = [
    {
      id: 1,
      username: 'test',
      firstName: 'testFirstName',
      lastName: 'testLastName',
      patronymic: 'testPatronymic',
      role: Roles.User,
      email: 'test@mail.ru',
      companyId: 1,
    },
    {
      id: 2,
      username: 'test2',
      firstName: 'testFirstName',
      lastName: 'testLastName',
      patronymic: 'testPatronymic',
      role: Roles.User,
      email: 'test2@mail.ru',
      companyId: 1,
    },
    {
      id: 3,
      username: 'test3',
      firstName: 'testFirstName',
      lastName: 'testLastName',
      patronymic: 'testPatronymic',
      role: Roles.Moderator,
      email: 'test3@mail.ru',
      companyId: 1,
    },
  ];

  const theme = useTheme();

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Id', width: 70 },
    { field: 'username', headerName: 'Username', width: 150 },
    { field: 'firstName', headerName: 'FirstName', width: 150 },
    { field: 'lastName', headerName: 'LastName', width: 150 },
    { field: 'patronymic', headerName: 'Patronymic', width: 150 },
    { field: 'role', headerName: 'Role', width: 120 },
    { field: 'email', headerName: 'Email', width: 200 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <>
          <GridActionsCellItem
            icon={<EditIcon sx={{ color: 'primary.main' }} />}
            label='Edit'
          />
          <GridActionsCellItem
            icon={<DeleteIcon sx={{ color: 'error.main' }} />}
            label='Delete'
          />
        </>
      ),
    },
  ];

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 2, bgcolor: theme.palette.background.paper }}>
        <Typography
          variant='h5'
          sx={{ mb: 2, color: theme.palette.text.primary }}
        >
          {company.companyName}
        </Typography>
        <Box sx={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={users}
            columns={columns}
            disableRowSelectionOnClick
            hideFooter
          />
        </Box>
      </Box>
    </Box>
  );
}
