// src/App.jsx
//import React from 'react';
import KanbanBoard from './components/KanbanBoard';
import { CssBaseline } from '@mui/material';

function App() {
  return (
    <>
      <CssBaseline /> {/* Normaliza os estilos CSS entre navegadores */}
      <KanbanBoard />
    </>
  );
}

export default App;