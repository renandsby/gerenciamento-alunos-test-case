import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { authAPI } from './services/api';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import TurmasList from './components/TurmasList';
import TurmaDetail from './components/TurmaDetail';
import TurmaForm from './components/TurmaForm';
import AlunoForm from './components/AlunoForm';

// Componente para rotas protegidas
const PrivateRoute = ({ children }) => {
  return authAPI.isAuthenticated() ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/turmas"
            element={
              <PrivateRoute>
                <TurmasList />
              </PrivateRoute>
            }
          />
          <Route
            path="/turmas/nova"
            element={
              <PrivateRoute>
                <TurmaForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/turmas/:id/editar"
            element={
              <PrivateRoute>
                <TurmaForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/turmas/:id"
            element={
              <PrivateRoute>
                <TurmaDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/alunos/novo"
            element={
              <PrivateRoute>
                <AlunoForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/alunos/:id/editar"
            element={
              <PrivateRoute>
                <AlunoForm />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

