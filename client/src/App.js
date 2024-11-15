// import logo from './logo.svg';
import './App.css';
import Dashboard from './pages/dashboard/Dashboard';
import Friends from './pages/dashboard/friends';
// import { ChakraProvider } from '@chakra-ui/react'
import { CircularProgress, CircularProgressLabel, Box, Stack, Button, ButtonGroup } from '@chakra-ui/react'
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Cookies from "universal-cookie";
import Groups from './pages/dashboard/Groups';
import GroupID from './components/GroupID';
import AddTest from './components/addTest';
import Sidebar from './components/Sidebar';
import { Outlet } from 'react-router-dom';
import AddTestView from './components/addTestView';
import EditQuestions from './components/editQuestions';
import TestInterface from './pages/TestInterface';
import ManualTests from './components/manualTests';
import DashboardOB from "./components/dashboardob";

function App() {
  const cookies = new Cookies();
  const token = cookies.get("TOKEN");

  const ProtectedRoute = ({ children }) => {
    if (token === undefined) {
      return <Navigate to="/" />
    }

    return children;
  }

  const ProtectedRouteLogin = ({ children }) => {
    if (token !== undefined) {
      return <Navigate to="/app/dashboard" />;
    }

    return children
  }

  return (
    <Router>
      <Routes>
        <Route path="*" element={<h1>404</h1>} />
        <Route path="/">
          <Route index element={<ProtectedRouteLogin><Login /></ProtectedRouteLogin>} />
        </Route>
        <Route path="attempt/:testId" element={<TestInterface />}/>
        <Route path="/register" element={<Register />} />
        <Route path="/app" element={
          <ProtectedRoute>
            <Navbar />
            <Box display="flex" height="100vh">
              <Sidebar />
              <Box flex={1} alignSelf="stretch" backgroundColor="#F5F5FA"><Outlet /></Box>
            </Box>
          </ProtectedRoute>} >
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="friends" element={<Friends />} />
          <Route path="addTest" element={<AddTestView/>} />
          <Route path="editQuestions/:paperId" element={<EditQuestions/>} />
          <Route path="groups" element={<Groups />} />
          <Route path="groups/:id" element={<GroupID ifTest={false}/>} />
          <Route path="tests/:id" element={<GroupID ifTest={true}/>} />
          <Route path="create-tool" element={<ManualTests/>} />
          <Route path="dashboardob" element={<DashboardOB/>} />
          </Route>
      </Routes>
    </Router>
  );
}

export default App;
