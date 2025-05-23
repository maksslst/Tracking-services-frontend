import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';
import LoginPage from './components/login/loginPage';
import RegisterPage from './components/register/registerPage';
import CompanyPage from './components/company/companyPage';
import TasksPage from './components/tasks/tasksPage';
import UserManagementPage from './components/userManagement/userManagementPage';
import CompanyManagementPage from './components/companyManagement/companyManagementPage';
import MonitoringPage from './components/monitoringSetting/monitoringSettingPage';
import ResourcePage from './components/resource/resourcePage';
import AccountPage from './components/account/accountPage';
import MainPage from './components/main/mainPage';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path='/' element={<MainPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/company' element={<CompanyPage />} />
          <Route path='/tasks' element={<TasksPage />} />
          <Route path='/userManagement' element={<UserManagementPage />} />
          <Route
            path='/companyManagement'
            element={<CompanyManagementPage />}
          />
          <Route path='/monitoringSetting' element={<MonitoringPage />} />
          <Route path='/resource' element={<ResourcePage />} />
          <Route path='/account' element={<AccountPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
