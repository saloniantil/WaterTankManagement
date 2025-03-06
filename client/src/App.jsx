import React from "react";
import LoginPage from "./Component/LoginPage";
import { BrowserRouter , Routes , Route } from "react-router-dom"
import Tanks from "./Component/Tanks";
import Body from "./Component/Body";
import EditOrViewOnly from "./Component/EditOrViewOnly";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Body/>}>
            <Route path='/' element={<LoginPage />} />
            <Route path="/edit-and-view-Or-View-Only" element={<EditOrViewOnly/>} />
            <Route path='/allTanks' element={<Tanks />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}
export default App;
