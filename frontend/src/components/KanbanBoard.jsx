// src/components/KanbanBoard.jsx
// import Container from '@mui/material/Container';
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
// import { CardActions } from "@mui/material";
// import CardHeader from '@mui/material/CardHeader';
import Typography from "@mui/material/Typography";
// import IconButton from '@mui/material/IconButton';
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import { useCallback, useEffect, useState } from "react";
import { getTasks, deleteTasks, updateTasks } from "../services/api";
// import axios from "axios";
import AddTaskDialog from "./AddTaskDialog";
// import { blue } from "@mui/material/colors";

const COLUMNS = [
  { id: "TODO", title: "A Fazer", color: "#f7fafc" },
  { id: "IN_PROGRESS", title: "Em Progresso", color: "#ebf8ff" },
  { id: "DONE", title: "Concluído", color: "#f0fff4" },
];

export default function KanbanBoard() {
  const [tasks, setTasks] = useState([]);
  // const [deleteTasksCard, setDeleteTasksCard] = useState([]);
  // const [updateTasksCard, setUpdateTasksCard] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchTasks = useCallback(async () => {
    try {
      const res = await getTasks();
      setTasks(res.data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    // const fetchTasks = () => {
    //   getTasks().then((res) => {
    //     setTasks(res.data);
    //   });
    // };

    fetchTasks();
  }, [fetchTasks]);

  // DELETE with Axios
  const deleteTasksCards = async (id) => {
    try {
      await deleteTasks({ id });

      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
      fetchTasks()
    } catch (error) {
      console.error(error);
    }
  };

  // update with Axios
  const upDateTasksCards = async (id, data) => {
    try {
      const response = await updateTasks({ id: id, data: data });
      setTasks((prevTasks) =>
        prevTasks.map((task) => (tasks.id === id ? response.data : task)),
      );
      fetchTasks()
      console.log("Patched Post:", data);
    } catch (error) {
      console.error("Error patching post:", error);
    }
  };

  // gemini
  const handleMoveTask = async (taskId, currentStatus, direction) => {
    let nextStatus = currentStatus;
    if (currentStatus === "TODO" && direction === "forward")
      nextStatus = "IN_PROGRESS";
    else if (currentStatus === "IN_PROGRESS" && direction === "forward")
      nextStatus = "DONE";
    else if (currentStatus === "IN_PROGRESS" && direction === "backward")
      nextStatus = "TODO";
    else if (currentStatus === "DONE" && direction === "backward")
      nextStatus = "IN_PROGRESS";

    try {
      // await axios.patch(`http://localhost:8000/api/api/${taskId}/`, { status: nextStatus });
      await upDateTasksCards(taskId, { status: nextStatus });
      console.log(taskId, nextStatus);
      fetchTasks()
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Excluir definitivamente esta tarefa?")) return;
    try {
      // await axios.delete(`http://localhost:8000/api/api/${taskId}/`);
      await deleteTasksCards(taskId);
      console.log("entrei na funcao handleDeleteTask...");
      setTasks(
        tasks.filter((tasks) => {
          return tasks.id !== taskId;
        }),
      );
    } catch (error) {
      console.error("Erro ao deletar tarefa:", error);
    }
  };

  return (
    <Box sx={{ p: 4, minHeight: "100vh", backgroundColor: "#fafafa" }}>
      <Stack
        direction="row"
        sx={{ justifyContent: "space-between", alignItems: "center", mb: 4 }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#1a365d" }}>
          Mini Kanban
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsDialogOpen(true)}
        >
          Nova Tarefa
        </Button>
      </Stack>

      <Grid container spacing={3}>
        {COLUMNS.map((col) => (
          <Grid size={{ xs: 12, md: 4 }} key={col.id}>
            <Box
              sx={{
                backgroundColor: col.color,
                p: 2,
                borderRadius: 2,
                minHeight: "40vh",
                border: "1px solid #e2e8f0",
              }}
            >
              <Typography
                variant="h6"
                sx={{ mb: 2, fontWeight: "bold", color: "#4a5568" }}
              >
                {col.title} ({tasks.filter((t) => t.status === col.id).length})
              </Typography>

              <Stack spacing={2}>
                {tasks
                  .filter((t) => t.status === col.id)
                  .map((task) => (
                    <Card
                      key={task.id}
                      sx={{
                        borderRadius: 1.5,
                        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                      }}
                    >
                      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                        <Stack
                          direction="row"
                          sx={{
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 1,
                          }}
                        >
                          <Chip
                            label={task.priority}
                            size="small"
                            color={
                              task.priority === "HIGH"
                                ? "error"
                                : task.priority === "MEDIUM"
                                  ? "warning"
                                  : "success"
                            }
                          />
                          <Button
                            onClick={() => handleDeleteTask(task.id)}
                            color="error"
                            size="small"
                            style={{ minWidth: "auto" }}
                          >
                            <DeleteOutlineOutlinedIcon fontSize="small" />
                          </Button>
                        </Stack>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: "bold" }}
                        >
                          {task.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ my: 1 }}
                        >
                          {task.description || "Sem descrição."}
                        </Typography>

                        <Stack
                          direction="row"
                          sx={{ justifyContent: "space-between", mt: 2 }}
                        >
                          <Button
                            size="small"
                            disabled={col.id === "TODO"}
                            onClick={() =>
                              handleMoveTask(task.id, task.status, "backward")
                            }
                            startIcon={<ArrowBackOutlinedIcon />}
                          >
                            Voltar
                          </Button>
                          <Button
                            size="small"
                            disabled={col.id === "DONE"}
                            onClick={() =>
                              handleMoveTask(task.id, task.status, "forward")
                            }
                            endIcon={<ArrowForwardOutlinedIcon />}
                          >
                            Avançar
                          </Button>
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}
              </Stack>
            </Box>
          </Grid>
        ))}
      </Grid>

      <AddTaskDialog
        open={isDialogOpen}
        handleClose={() => setIsDialogOpen(false)} onTaskAdded={fetchTasks}
      />
    </Box>
  );
}
