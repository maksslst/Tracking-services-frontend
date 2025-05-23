import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import Collapse from '@mui/material/Collapse';
import ApartmentIcon from '@mui/icons-material/Apartment';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import TaskIcon from '@mui/icons-material/Task';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const [open, setOpen] = React.useState(true);
  const navigate = useNavigate();

  const handleClick = () => {
    setOpen(!open);
  };

  // Функции для навигации
  const handleCompanyClick = () => {
    navigate('/company');
  };

  const handleServicesClick = () => {
    navigate('/resource');
  };

  const handleTasksClick = () => {
    navigate('/tasks');
  };

  const handleCompanyManagementClick = () => {
    navigate('/companyManagement');
  };

  const handleUserManagementClick = () => {
    navigate('/userManagement');
  };

  return (
    <Drawer
      variant='permanent'
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          backgroundColor: '#100E3A',
          color: '#FFFFFF',
        },
      }}
    >
      <Typography
        variant='h5'
        align='center'
        gutterBottom
        style={{ color: '#FFFFFF', fontWeight: 'bold' }}
      >
        Tracking Services
      </Typography>
      <List>
        <ListItemButton onClick={handleCompanyClick}>
          <ListItemIcon sx={{ color: '#FFFFFF' }}>
            <ApartmentIcon />
          </ListItemIcon>
          <ListItemText primary='Company' />
        </ListItemButton>
        <ListItemButton onClick={handleServicesClick}>
          <ListItemIcon sx={{ color: '#FFFFFF' }}>
            <MiscellaneousServicesIcon />
          </ListItemIcon>
          <ListItemText primary='Services' />
        </ListItemButton>
        <ListItemButton onClick={handleTasksClick}>
          <ListItemIcon sx={{ color: '#FFFFFF' }}>
            <TaskIcon />
          </ListItemIcon>
          <ListItemText primary='Tasks' />
        </ListItemButton>
        <ListItemButton onClick={handleClick}>
          <ListItemIcon sx={{ color: '#FFFFFF' }}>
            <AdminPanelSettingsIcon />
          </ListItemIcon>
          <ListItemText primary='Admin area' />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={open} timeout='auto' unmountOnExit>
          <List component='div' disablePadding>
            <ListItemButton
              sx={{ pl: 4 }}
              onClick={handleCompanyManagementClick}
            >
              <ListItemIcon sx={{ color: '#FFFFFF' }}>
                <ManageAccountsIcon />
              </ListItemIcon>
              <ListItemText primary='Company management' />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={handleUserManagementClick}>
              <ListItemIcon sx={{ color: '#FFFFFF' }}>
                <SupervisedUserCircleIcon />
              </ListItemIcon>
              <ListItemText primary='User management' />
            </ListItemButton>
          </List>
        </Collapse>
      </List>
    </Drawer>
  );
}
