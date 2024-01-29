import React from "react";
import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Signin from "./containers/Signin";
import "./App.css";
import Dashboard from "./containers/Dashboard";
import ListParikrama from "./containers/Parikrama/ListParikrama";
import AddParikrama from "./containers/Parikrama/AddParikrama";
import EditParikrama from "./containers/Parikrama/EditParikrama";
import ListTemple from "./containers/Temple/ListTemple";
import AddTemple from "./containers/Temple/AddTemple";
import EditTemple from "./containers/Temple/EditTemple";
import AddProject from "./containers/Projects/AddProjects";
import ListProjects from "./containers/Projects/ListProjects";
import EditProject from "./containers/Projects/EditProjects";
import AddRetreat from "./containers/Retreats/AddRetreats";
import ListRetreats from "./containers/Retreats/ListRetreats";
import EditRetreat from "./containers/Retreats/EditRetreats";

const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/holywalk"
          element={
            <PrivateRoute>
              <ListParikrama />
            </PrivateRoute>
          }
        />
        <Route
          path="/holywalk/add"
          exact
          element={
            <PrivateRoute>
              <AddParikrama />
            </PrivateRoute>
          }
        />
        <Route
          path="/holywalk/edit/:id"
          exact
          element={
            <PrivateRoute>
              <EditParikrama />
            </PrivateRoute>
          }
        />
        <Route
          path="/holyplaces"
          element={
            <PrivateRoute>
              <ListTemple />
            </PrivateRoute>
          }
        />
        <Route
          path="/holyplaces/add"
          element={
            <PrivateRoute>
              <AddTemple />
            </PrivateRoute>
          }
        />
        <Route
          path="/holyplaces/edit/:id"
          element={
            <PrivateRoute>
              <EditTemple />
            </PrivateRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <PrivateRoute>
              <ListProjects />
            </PrivateRoute>
          }
        />
        <Route
          path="/projects/add"
          element={
            <PrivateRoute>
              <AddProject />
            </PrivateRoute>
          }
        />
        <Route
          path="/projects/edit/:id"
          element={
            <PrivateRoute>
              <EditProject />
            </PrivateRoute>
          }
        />
        <Route
          path="/retreats"
          element={
            <PrivateRoute>
              <ListRetreats />
            </PrivateRoute>
          }
        />
        <Route
          path="/retreats/add"
          element={
            <PrivateRoute>
              <AddRetreat />
            </PrivateRoute>
          }
        />
        <Route
          path="/retreats/edit/:id"
          element={
            <PrivateRoute>
              <EditRetreat />
            </PrivateRoute>
          }
        />
        <Route path="/signin" caseSensitive={false} element={<Signin />} />
      </Routes>
    </div>
  );
};

export default App;
