import {
  Route,
  Routes,
} from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './App.css';
import Login from './pages/Login';
import OrderDetails from "./pages/OrderDetails"
import SignatureComponent from "./pages/SignatureComponent"
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Orders from './pages/Orders';
import Challan from './pages/Challan';

function App() {
  const { currentUser } = useContext(AuthContext);

  return (
   <>
      <Routes>
        <Route path='/'  Component={Login} > </Route>
        <Route path={`/orders/${currentUser}`} Component={OrderDetails}> </Route>
        <Route path={'/orderdetail/:id'} Component={Orders}></Route> 
        <Route path='/signature/:id' Component={SignatureComponent} > </Route>
        <Route path='/challan/:id' Component={Challan}> </Route>
      </Routes>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark" />
        </>
  );
}

export default App;
