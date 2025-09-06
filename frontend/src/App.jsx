import { useSelector } from 'react-redux'
import AppRoutes from './routes'
import { useDispatch } from 'react-redux'

import { useEffect, useState } from 'react'
import { refreshToken } from './features/auth/authSlice.js'
import { fetchUser as fetchProfile } from './features/auth/userSlice.js'
import { useLocation } from 'react-router-dom'
import {setInitialized} from './features/auth/authSlice.js'


const App = () => {

  const dispatch = useDispatch();
  const {isAuthenticated, isInitialized } = useSelector(state => state.auth);
  const location = useLocation();



  const [isAppReady, setIsAppReady] = useState(false);


useEffect(() => {
  if (location.pathname !== "/" && location.pathname !== "/login") {
    dispatch(refreshToken()).finally(() => setIsAppReady(true));
  } else {
    dispatch(setInitialized()); // ✅ mark as initialized
    setIsAppReady(true);
  }
}, [dispatch, location.pathname]);


  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchProfile());
    }
  }, [dispatch, isAuthenticated]);

  if (!isInitialized || !isAppReady) {
  return (
    <div className="h-screen text-3xl flex justify-center items-center">
      <p>Loading...</p> {/* or Loader component */}
    </div>
  );
}

  return (
    <div>
      <AppRoutes isAuthenticated={isAuthenticated}/>
      
    </div>
  )
}

export default App