import React, { useEffect } from "react";
import LoginPage from "./Component/LoginPage";
import { BrowserRouter , Routes , Route, Navigate } from "react-router-dom"
import Tanks from "./Component/Tanks";
import Body from "./Component/Body";
import EditOrViewOnly from "./Component/EditOrViewOnly";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "./utils/Slices/userSlice";
import Premium from "./Component/Premium";
import Automate from "./Component/Automate";

const App = () => {

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {

    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      dispatch(addUser(storedUser));
    }

  }, [dispatch]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Body/>}>
            <Route path='/' element={<LoginPage />} />
            <Route path="/edit-and-view-Or-View-Only" element={user ? <EditOrViewOnly/> :<Navigate to="/" />} />
            <Route path='/allTanks' element={<Tanks />} />
            <Route path="/subscription" element={<Premium />} />
            <Route path="/automate" element={<Automate/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}
export default App;
