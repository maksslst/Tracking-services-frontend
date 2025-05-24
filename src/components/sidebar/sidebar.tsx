import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import Link from '@mui/material/Link';
import { useTheme } from '@mui/material/styles';
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
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';

export default function Sidebar() {
  const [open, setOpen] = React.useState(true);
  const navigate = useNavigate();
  const theme = useTheme();

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

  const handleProfileClick = () => {
    navigate('/account');
  };

  const handleMonitoringSettingClick = () => {
    navigate('/monitoringSetting');
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
          color: theme.palette.background.default,
        },
      }}
    >
      <Link href='/' underline='none'>
        <Typography
          variant='h5'
          align='center'
          gutterBottom
          style={{
            color: theme.palette.background.default,
            fontWeight: 'bold',
          }}
        >
          Tracking Services
        </Typography>
      </Link>
      <List>
        <ListItemButton onClick={handleMonitoringSettingClick}>
          <ListItemIcon sx={{ color: theme.palette.background.default }}>
            <MonitorHeartIcon />
          </ListItemIcon>
          <ListItemText primary='Monitoring setting' />
        </ListItemButton>
        <ListItemButton onClick={handleCompanyClick}>
          <ListItemIcon sx={{ color: theme.palette.background.default }}>
            <ApartmentIcon />
          </ListItemIcon>
          <ListItemText primary='Company' />
        </ListItemButton>
        <ListItemButton onClick={handleServicesClick}>
          <ListItemIcon sx={{ color: theme.palette.background.default }}>
            <MiscellaneousServicesIcon />
          </ListItemIcon>
          <ListItemText primary='Resources' />
        </ListItemButton>
        <ListItemButton onClick={handleTasksClick}>
          <ListItemIcon sx={{ color: theme.palette.background.default }}>
            <TaskIcon />
          </ListItemIcon>
          <ListItemText primary='Tasks' />
        </ListItemButton>
        <ListItemButton onClick={handleClick}>
          <ListItemIcon sx={{ color: theme.palette.background.default }}>
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
              <ListItemIcon sx={{ color: theme.palette.background.default }}>
                <ManageAccountsIcon />
              </ListItemIcon>
              <ListItemText primary='Company management' />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={handleUserManagementClick}>
              <ListItemIcon sx={{ color: theme.palette.background.default }}>
                <SupervisedUserCircleIcon />
              </ListItemIcon>
              <ListItemText primary='User management' />
            </ListItemButton>
          </List>
        </Collapse>
        <ListItemButton onClick={handleProfileClick}>
          <ListItemIcon sx={{ color: theme.palette.background.default }}>
            <AccountCircleIcon />
          </ListItemIcon>
          <ListItemText primary='Profile' />
        </ListItemButton>
      </List>
    </Drawer>
  );
}
