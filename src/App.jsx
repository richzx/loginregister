import { useEffect, useState } from 'react'
import { createBrowserRouter, createRoutesFromElements, Navigate, Route, RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { auth } from './firebase/config.js';

// import pages
import Login from './pages/Login.jsx';
import SignUp from './pages/SignUp.jsx';
import Profile from './pages/Profile.jsx';

function App() {
  // hook for user
  const [user, setUser] = useState();
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
    })
  });

  // router
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route
          path='/'
          element={user ? <Navigate to="/profile" /> : <Login />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<SignUp />} />
        <Route path='/profile' element={user ? <Profile /> : <Navigate to="/" />} />
      </>
    ));

  return (
    <>
      <Toaster />
      <RouterProvider router={router} />
    </>
  )
}

export default App
