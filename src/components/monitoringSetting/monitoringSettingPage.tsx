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
import { ResourceDto } from '../../api/models/resource';
import { ResourceStatus } from '../../api/enums/resourceStatus';
import { MonitoringSettingDto } from '../../api/models/monitoringSetting';

export default function MonitoringPage() {
  const resources: ResourceDto[] = [
    {
      id: 1,
      name: 'yandex',
      type: 'Web',
      source: 'https://test.ru',
      resourceStatus: ResourceStatus.Active,
    },
  ];

  const monitoringSettings: MonitoringSettingDto[] = [
    {
      resourceId: 1,
      checkInterval: 'Every 5 minutes',
      mode: true,
    },
  ];

  const handleAddCheck = () => {
    return;
  };

  const handleEditResource = (id: number) => {
    return;
  };

  const handleDeleteResource = (id: number) => {
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
          Monitoring
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
            Add check
          </Button>
          <Stack spacing={2}>
            <TextField
              label='Enter resource name'
              margin='normal'
              size='small'
              fullWidth
            />
            <TextField
              label='Enter type'
              margin='normal'
              size='small'
              fullWidth
            />
            <TextField
              label='Enter source'
              margin='normal'
              size='small'
              fullWidth
            />
            <TextField
              label='Enter check interval'
              margin='normal'
              size='small'
              fullWidth
              multiline
              rows={2}
            />
            <TextField
              label='Enter mode'
              margin='normal'
              size='small'
              fullWidth
              multiline
              rows={2}
            />
            <Button
              variant='outlined'
              onClick={handleAddCheck}
              sx={{
                mt: 1,
                borderColor: theme.palette.text.secondary,
                color: theme.palette.text.primary,
              }}
            >
              Add check
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
          {resources.map((resource) => {
            const setting = monitoringSettings.find(
              (s) => s.resourceId === resource.id
            );
            return (
              <Card
                key={resource.id}
                sx={{ p: 2, border: '1px solid #E0E0E0', borderRadius: 2 }}
              >
                <CardContent>
                  <Typography variant='body2' color='textSecondary'>
                    Resource: {resource.name}
                  </Typography>
                  <Typography variant='body2' color='textSecondary'>
                    Type: {resource.type}
                  </Typography>
                  <Typography variant='body2' color='textSecondary'>
                    Source: {resource.source}
                  </Typography>
                  <Typography variant='body2' color='textSecondary'>
                    Status: {resource.resourceStatus}
                  </Typography>
                  <Typography variant='body2' color='textSecondary'>
                    Check Interval: {setting?.checkInterval || 'N/A'}
                  </Typography>
                  <Typography variant='body2' color='textSecondary'>
                    Mode: {setting?.mode ? 'Enabled' : 'Disabled'}
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
            );
          })}
        </Stack>
      </Box>
    </Box>
  );
}
