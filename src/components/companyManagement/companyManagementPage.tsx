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
import { useTheme } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Sidebar from '../sidebar/sidebar';
import { CompanyDto } from '../../api/models/company';

export default function CompanyManagementPage() {
  const companies: CompanyDto[] = [
    {
      id: 1,
      companyName: 'Test Company',
    },
    {
      id: 2,
      companyName: 'Test Company2',
    },
  ];

  const handleAddCompany = () => {
    return;
  };

  const handleEditCompany = (id: number) => {
    return;
  };

  const handleDeleteCompany = (id: number) => {
    return;
  };

  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 2, bgcolor: theme.palette.background.paper }}>
        <Typography
          variant='h5'
          sx={{ mb: 2, color: theme.palette.text.primary }}
        >
          Company Management
        </Typography>
        <Box sx={{ mb: 4 }}>
          <Button
            variant='outlined'
            sx={{
              mb: 2,
              borderColor: theme.palette.text.secondary,
              color: theme.palette.text.primary,
            }}
          >
            Add company
          </Button>
          <Stack spacing={2}>
            <TextField
              label='Enter company name'
              margin='normal'
              size='small'
              fullWidth
            />
            <TextField
              label='Enter description'
              margin='normal'
              size='small'
              fullWidth
              multiline
              rows={2}
            />
            <Button
              variant='outlined'
              onClick={handleAddCompany}
              sx={{
                mt: 1,
                borderColor: theme.palette.text.secondary,
                color: theme.palette.text.primary,
              }}
            >
              Add company
            </Button>
          </Stack>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Button
            variant='outlined'
            sx={{
              mb: 2,
              borderColor: theme.palette.text.secondary,
              color: theme.palette.text.primary,
            }}
          >
            View all companies
          </Button>
        </Box>
        <Stack spacing={2}>
          {companies.map((company) => (
            <Card
              key={company.id}
              sx={{ p: 2, border: '1px solid #E0E0E0', borderRadius: 2 }}
            >
              <CardContent>
                <Typography variant='body2' color='textSecondary'>
                  {company.companyName}
                </Typography>
                <Box
                  sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}
                >
                  <IconButton
                    onClick={() => handleEditCompany(company.id ?? 0)}
                    color='default'
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteCompany(company.id ?? 0)}
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
