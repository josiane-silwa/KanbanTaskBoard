// src/components/AddTaskDialog.jsx
import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Stack } from '@mui/material';
import { createTasks } from '../services/api'
// import axios from 'axios';

export default function AddTaskDialog({ open, handleClose, onTaskAdded }) {
  const [formData, setFormData] = useState({ title: '', description: '', priority: 'MEDIUM', status: 'TODO' });

  // update with Axios
  const createTasksCards = async (...formData) => {
    try {
      await createTasks(  ...formData  );
      // createTasks.post(formData);
      console.log('Patched Post:', ...formData);
    } catch (error) {
      console.error("Error Post:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    try {
      // await axios.post('http://localhost:8000/api/api/', formData);
      await createTasksCards(formData);
      setFormData({ title: '', description: '', priority: 'MEDIUM', status: 'TODO' });
      onTaskAdded(); // Dispara o recarregamento do quadro
      handleClose(); // Fecha o modal
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 'bold' }}>Nova Tarefa</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField label="Título da Tarefa" name="title" value={formData.title} onChange={handleChange} required fullWidth />
            <TextField label="Descrição" name="description" value={formData.description} onChange={handleChange} fullWidth multiline rows={3} />
            <TextField select label="Prioridade" name="priority" value={formData.priority} onChange={handleChange} fullWidth>
              <MenuItem value="LOW">Baixa</MenuItem>
              <MenuItem value="MEDIUM">Média</MenuItem>
              <MenuItem value="HIGH">Alta</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleClose} color="inherit">Cancelar</Button>
          <Button type="submit" variant="contained" color="primary">Salvar</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}