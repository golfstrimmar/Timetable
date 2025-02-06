import React from "react";
import { Route, Routes } from "react-router-dom";
import CommonDay from "../components/CommonDay/CommonDay";
import Kalendar from "../components/Kalendar/Kalendar";
import Regular from "../components/Regular/Regular";
import Eventino from "../components/Eventino/Eventino";

const AppRouter = () => (
  <Routes>
    <Route path="/" element={<Kalendar />} />
    <Route path="/commonday" element={<CommonDay />} />
    <Route path="/regular/:date" element={<Regular />} />
    <Route path="/event/:id" element={<Eventino />} />
  </Routes>
);
export default AppRouter;
