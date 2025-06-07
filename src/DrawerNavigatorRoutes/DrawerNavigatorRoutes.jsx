import React from "react";
import { Routes, Route } from "react-router-dom";
import DrawerNavigation from "../DrawerNavigation/DrawerNavigation";
import Home from "../PagesFolder/Home";
import Reports from "../PagesFolder/Reports";
import Updates from "../PagesFolder/Updates";

function DrawerNavigatorRoutes() {

  return (
    <DrawerNavigation>
      <Routes>
        <Route path="/" element={<Updates />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/updates" element={<Home />} />
      </Routes>
    </DrawerNavigation>
  );
}

export default DrawerNavigatorRoutes;