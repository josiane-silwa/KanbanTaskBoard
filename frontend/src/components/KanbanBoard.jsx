// src/components/KanbanBoard.jsx
import { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Box, Button, Stack, Chip } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import AddIcon from '@mui/icons-material/Add';
import axios from "axios";
import AddTaskDialog from './AddTaskDialog';

const COLUMNS = [
  { id: 'TODO', title: 'A Fazer', color: '#f7fafc' },
  { id: 'IN_PROGRESS', title: 'Em Progresso', color: '#ebf8ff' },
  { id: 'DONE', title: 'Concluído', color: '#f0fff4' }
];

export default function KanbanBoard() {
  const [tasks, setTasks] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/api/');
      setTasks(response.data);
    } catch (error) {
      console.error("Erro ao carregar dados da API:", error);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleMoveTask = async (taskId, currentStatus, direction) => {
    let nextStatus = currentStatus;
    if (currentStatus === 'TODO' && direction === 'forward') nextStatus = 'IN_PROGRESS';
    else if (currentStatus === 'IN_PROGRESS' && direction === 'forward') nextStatus = 'DONE';
    else if (currentStatus === 'IN_PROGRESS' && direction === 'backward') nextStatus = 'TODO';
    else if (currentStatus === 'DONE' && direction === 'backward') nextStatus = 'IN_PROGRESS';

    try {
      await axios.patch(`http://localhost:8000/api/api/${taskId}/`, { status: nextStatus });
      fetchTasks();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Excluir definitivamente esta tarefa?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/api/${taskId}/`);
      fetchTasks();
    } catch (error) {
      console.error("Erro ao deletar tarefa:", error);
    }
  };

  return (
    <Box sx={{ p: 4, minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <Stack direction="row" sx={{justifyContent:"space-between", alignItems:"center", mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a365d' }}>Meu Kanban</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setIsDialogOpen(true)}>Nova Tarefa</Button>
      </Stack>

      <Grid container spacing={3}>
        {COLUMNS.map((col) => (
          <Grid size={{ xs: 12, md: 4 }} key={col.id}>
            <Box sx={{ backgroundColor: col.color, p: 2, borderRadius: 2, minHeight: '70vh', border: '1px solid #e2e8f0' }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#4a5568' }}>
                {col.title} ({tasks.filter(t => t.status === col.id).length})
              </Typography>
              
              <Stack spacing={2}>
                {tasks.filter(t => t.status === col.id).map((task) => (
                  <Card key={task.id} sx={{ borderRadius: 1.5, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                      <Stack direction="row" sx={{ justifyContent: "space-between",alignItems: "center", mb: 1 }}>
                        <Chip 
                          label={task.priority} 
                          size="small" 
                          color={task.priority === 'HIGH' ? 'error' : task.priority === 'MEDIUM' ? 'warning' : 'success'} 
                        />
                        <Button onClick={() => handleDeleteTask(task.id)} color="error" size="small" style={{ minWidth: 'auto' }}>
                          <DeleteOutlineOutlinedIcon fontSize="small" />
                        </Button>
                      </Stack>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{task.title}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ my: 1 }}>{task.description || "Sem descrição."}</Typography>
                      
                      <Stack direction="row" sx={{ justifyContent:"space-between", mt: 2 }}>
                        <Button size="small" disabled={col.id === 'TODO'} onClick={() => handleMoveTask(task.id, task.status, 'backward')} startIcon={<ArrowBackIcon />}>Voltar</Button>
                        <Button size="small" disabled={col.id === 'DONE'} onClick={() => handleMoveTask(task.id, task.status, 'forward')} endIcon={<ArrowForwardIcon />}>Avançar</Button>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </Box>
          </Grid>
        ))}
      </Grid>

      <AddTaskDialog open={isDialogOpen} handleClose={() => setIsDialogOpen(false)} onTaskAdded={fetchTasks} />
    </Box>
  );
}