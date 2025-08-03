import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {Routes, Route} from 'react-router-dom'
import Homepage from '../homepage';
import SignInPage from './pages/sign-in'
import SignUpPage from './pages/sign-up'
import DashBoardPage from './pages/dashboard';

import './App.css'
function App() {
  return (
    <Routes>
      <Route path='/' element ={ <Homepage />}/>
      <Route path='/dashboard' element ={ <DashBoardPage />}/>
      <Route path='/sign-in' element ={ <SignInPage />}/>
      <Route path='/sign-up' element ={ <SignUpPage />}/>
    </Routes>
  );
}

export default App;
