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
import AddIcon from '@mui/icons-material/Add';
import Sidebar from '../sidebar/sidebar';
import { ResourceDto } from '../../api/models/resource';
import { ResourceStatus } from '../../api/enums/resourceStatus';

export default function ResourcePage() {
  const companyResources: ResourceDto[] = [
    {
      id: 1,
      name: 'test',
      type: 'admin',
      source: '',
      companyId: 1,
      resourceStatus: ResourceStatus.Active,
    },
  ];

  const allServices: ResourceDto[] = [
    {
      id: 2,
      name: 'AddServiceTest',
      type: 'test',
      source: 'test',
      resourceStatus: ResourceStatus.Inactive,
    },
    {
      id: 3,
      name: 'AddServiceTest2',
      type: 'test',
      source: 'test',
      resourceStatus: ResourceStatus.Inactive,
    },
  ];

  const handleAddResource = () => {
    return;
  };

  const handleEditResource = (id: number) => {
    return;
  };

  const handleDeleteResource = (id: number) => {
    return;
  };

  const handleAddService = (id: number) => {
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
          Resources
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
            Add Service
          </Button>
          <Stack spacing={2}>
            <TextField label='Name' margin='normal' size='small' fullWidth />
            <TextField label='Type' margin='normal' size='small' fullWidth />
            <TextField label='Source' margin='normal' size='small' fullWidth />
            <TextField label='Status' margin='normal' size='small' fullWidth />
            <Button
              variant='outlined'
              onClick={handleAddResource}
              sx={{
                mt: 1,
                borderColor: theme.palette.text.secondary,
                color: theme.palette.text.primary,
              }}
            >
              Add Service
            </Button>
          </Stack>
        </Box>
        <Typography
          variant='h6'
          sx={{ mb: 2, color: theme.palette.text.primary }}
        >
          All company resources
        </Typography>
        <Stack spacing={2}>
          {companyResources.map((resource) => (
            <Card
              key={resource.id}
              sx={{ p: 2, border: '1px solid #E0E0E0', borderRadius: 2 }}
            >
              <CardContent>
                <Typography variant='body2' color='textSecondary'>
                  {resource.name}
                </Typography>
                <Typography variant='body2' color='textSecondary'>
                  Type: {resource.type}
                </Typography>
                <Typography variant='body2' color='textSecondary'>
                  Source: {resource.source || 'N/A'}
                </Typography>
                <Typography variant='body2' color='textSecondary'>
                  Status: {resource.resourceStatus}
                </Typography>
                <Box
                  sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}
                >
                  <IconButton
                    onClick={() => handleEditResource(resource.id ?? 0)}
                    color='default'
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteResource(resource.id ?? 0)}
                    color='error'
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
        <Typography
          variant='h6'
          sx={{ mb: 2, mt: 4, color: theme.palette.text.primary }}
        >
          All services
        </Typography>
        <Stack spacing={2}>
          {allServices.map((service) => (
            <Card
              key={service.id}
              sx={{ p: 2, border: '1px solid #E0E0E0', borderRadius: 2 }}
            >
              <CardContent>
                <Typography variant='body2' color='textSecondary'>
                  {service.name}
                </Typography>
                <Typography variant='body2' color='textSecondary'>
                  Type: {service.type}
                </Typography>
                <Typography variant='body2' color='textSecondary'>
                  Source: {service.source}
                </Typography>
                <Typography variant='body2' color='textSecondary'>
                  Status: {service.resourceStatus}
                </Typography>
                <Box
                  sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}
                >
                  <IconButton
                    onClick={() => handleAddService(service.id ?? 0)}
                    color='success'
                  >
                    <AddIcon />
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
