import React, { useContext } from 'react'
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { AuthContext } from '../context/AuthContext';

import { Link } from 'react-router-dom';

const Logout = () => {
  const {  logout } = useContext(AuthContext)


  return (
    <Link to='/'>  
    <span className='logout' onClick={logout} ><ExitToAppIcon /></span>
    </Link>
  )
}

export default Logout