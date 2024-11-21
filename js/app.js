import { getTasks, updateTaskStatus, createTask } from "./api.js";
import {
  displayTasks,
  toggleSidebar,
  showChangeStatusFormNav,
  showCreateTaskForm,
  closeChangeStatusForm,
  showConfig,
  closeCreateTaskForm,
  updateRangeValue,
  closeConfig,
  saveConfig,
} from "./dom.js";

async function loadTasks() {
  try {
    const tasks = await getTasks();
    displayTasks(tasks);
  } catch (error) {
    console.error("Error al cargar tareas:", error);
  }
}

async function changeTaskStatus() {
  const taskId = document.getElementById("task-select").value;
  const newStatus = document.getElementById("edit-task-status").value;

  try {
    await updateTaskStatus(taskId, newStatus); // Actualizamos el estado en el backend
    loadTasks(); // Recargamos las tareas para reflejar el cambio
    closeChangeStatusForm(); // Cerramos el formulario de cambio de estado
  } catch (error) {
    console.error("Error al actualizar la tarea en la interfaz:", error);
  }
}

async function createNewTask() {
  const title = document.getElementById("task-title").value;
  const detail = document.getElementById("task-detail").value;
  const status = document.getElementById("task-status").value;
  try {
    await createTask(title, detail, status);
    loadTasks();
    closeCreateTaskForm();
  } catch (error) {
    console.error("Error al crear tarea:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadTasks();

  const configButton = document.getElementById("configButton");
  if (configButton) {
    configButton.addEventListener("click", showConfig);
  } else {
    console.error(
      "El botón de configuración con ID 'configButton' no se encontró en el DOM."
    );
  }

  const rangeInput = document.getElementById("config-range");
  if (rangeInput) {
    rangeInput.addEventListener("input", (e) => {
      updateRangeValue(e.target.value);
    });
  } else {
    console.error("No se encontró el input de rango con ID 'config-range'.");
  }

  const btnToggleSidebar = document.querySelector("#btnToggleSidebar");
  const btnCloseToggleSidebar = document.querySelector(
    "#btnCloseToggleSidebar"
  );
  const btnCloseCreateTaskForm = document.querySelector(
    "#btnCloseCreateTaskForm"
  );
  const btnCreateTask = document.querySelector("#btnCreateTask");
  const btnShowCreateTaskForm = document.querySelector(
    "#btnShowCreateTaskForm"
  );
  const changeStatusButton = document.querySelector("#changeStatusButton");
  const btnCloseChangeStatusForm = document.querySelector(
    "#btnCloseChangeStatusForm"
  );
  const btnChangeTaskStatus = document.querySelector("#btnChangeTaskStatus");
  const btnCloseConfig = document.querySelector("#btnCloseConfig");
  const btnSaveConfig = document.querySelector("#btnSaveConfig");

  btnToggleSidebar.addEventListener("click", toggleSidebar);
  btnCloseToggleSidebar.addEventListener("click", toggleSidebar);
  btnCloseCreateTaskForm.addEventListener("click", closeCreateTaskForm);
  btnCreateTask.addEventListener("click", createNewTask);
  btnShowCreateTaskForm.addEventListener("click", showCreateTaskForm);
  changeStatusButton.addEventListener("click", showChangeStatusFormNav);
  btnCloseChangeStatusForm.addEventListener("click", closeChangeStatusForm);
  btnChangeTaskStatus.addEventListener("click", changeTaskStatus);
  btnCloseConfig.addEventListener("click", closeConfig);
  btnSaveConfig.addEventListener("click", saveConfig);
});
