import { deleteTaskFromAPI, getTasks } from "./api.js";

export async function loadTasksSelector(tasks) {
  try {
    const taskSelect = document.getElementById("task-select");
    taskSelect.innerHTML = "";
    tasks.forEach((task) => {
      taskSelect.innerHTML += `<option value="${task.id}">${task.title}</option>`;
    });
  } catch (error) {
    console.error("Error al crear las tareas:", error);
  }
}

export function playTaskDetail(title, detail) {
  const taskCard = document.getElementById(`task-${title}`);
  taskCard?.classList.add("task-playing");

  const savedConfig = JSON.parse(localStorage.getItem("appConfig"));

  const speechRate = savedConfig?.sliderValue || 1;
  const speechLanguage = savedConfig?.language || "es-ES";

  const speech = new SpeechSynthesisUtterance(`${title}. ${detail}`);
  speech.rate = speechRate;
  speech.lang = speechLanguage;

  speech.onend = () => taskCard?.classList.remove("task-playing");

  speechSynthesis.speak(speech);
}

export function showChangeStatusForm(taskId, currentStatus, taskTitle) {
  const modal = document.getElementById("change-status-modal");
  const taskSelect = document.getElementById("task-select");
  const taskStatusSelect = document.getElementById("edit-task-status");
  taskSelect.innerHTML = `<option value="${taskId}">${taskTitle}</option>`;
  taskStatusSelect.value = currentStatus;
  modal.showModal();
}

export function confirmAndDeleteTask(task) {
  if (!task) {
    console.error("ID de tarea no válido");
    return;
  }

  Swal.fire({
    title: "¿Estás seguro?",
    text: "Vas a eliminar la tarea '" + task.title + "'",
    icon: "warning",
    showCancelButton: true,
    cancelButtonText: "Cancelar",
    confirmButtonText: "Sí, borrar",
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    backdrop: true, // Esto asegura que el modal se muestre encima de todo
  }).then(async (result) => {
    if (result.isConfirmed) {
      const success = await deleteTaskFromAPI(task.id);
      if (success) {
        Swal.fire("Borrado", "La tarea ha sido eliminada.", "success");
        document.getElementById(`task-${task.id}`)?.remove();
      } else {
        Swal.fire("Error", "No se pudo eliminar la tarea.", "error");
      }
    }
  });
}

export function displayTasks(tasks) {
  const taskList = document.getElementById("task-list");
  taskList.innerHTML = "";

  tasks.forEach((task) => {
    const taskCard = document.createElement("div");
    taskCard.className = "task-card";
    taskCard.id = `task-${task.id}`;

    let statusIcon = "";
    let statusColor = "";
    if (task.status === "pendiente") {
      statusIcon = '<i class="fas fa-hourglass-start text-warning"></i>';
      statusColor = "text-warning";
    } else if (task.status === "en progreso") {
      statusIcon = '<i class="fas fa-spinner text-info"></i>';
      statusColor = "text-info";
    } else if (task.status === "completada") {
      statusIcon = '<i class="fas fa-check-circle text-success"></i>';
      statusColor = "text-success";
    }

    let taskDate;
    if (typeof task.createdAt === "number") {
      taskDate = new Date(task.createdAt * 1000);
    } else {
      taskDate = new Date(task.createdAt);
    }

    const formatter = new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "America/Argentina/Buenos_Aires",
    });

    const formattedCreationDate =
      taskDate instanceof Date && !isNaN(taskDate)
        ? formatter.format(taskDate)
        : "Fecha no disponible";

    // Agregar fecha de finalización si la tarea está completada
    let formattedCompletionDate = "";
    if (task.status === "completada" && task.completedAt) {
      const completionDate = new Date(task.completedAt);
      formattedCompletionDate =
        completionDate instanceof Date && !isNaN(completionDate)
          ? formatter.format(completionDate)
          : "Fecha de finalización no disponible";
    }

    // Contenedor de la información de la tarea
    const taskInfo = document.createElement("div");
    taskInfo.classList.add("task-info");

    const taskTitle = document.createElement("h3");
    taskTitle.innerHTML = `${task.title} ${statusIcon}`;
    taskInfo.appendChild(taskTitle);
    const taskStatus = document.createElement("p");
    taskStatus.className = statusColor;
    taskStatus.innerHTML = `<strong>Estado:</strong> ${task.status}`;
    taskInfo.appendChild(taskStatus);

    const pTaskDate = document.createElement("p");
    pTaskDate.innerHTML = `<strong>Fecha de creación:</strong> ${formattedCreationDate}`;
    taskInfo.appendChild(pTaskDate);

    if (formattedCompletionDate) {
      const pCompletionDate = document.createElement("p");
      pCompletionDate.innerHTML = `<strong>Fecha de finalización:</strong> ${formattedCompletionDate}`;
      taskInfo.appendChild(pCompletionDate);
    }

    taskCard.appendChild(taskInfo);

    const taskActions = document.createElement("div");
    taskActions.classList.add("task-actions");

    const playButton = document.createElement("button");
    playButton.textContent = "▶️ Play";
    playButton.onclick = () => playTaskDetail(task.title, task.detail);
    taskActions.appendChild(playButton);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Eliminar";
    deleteButton.onclick = () => confirmAndDeleteTask(task);
    taskActions.appendChild(deleteButton);
    const changeStatusButton = document.createElement("button");
    changeStatusButton.textContent = "Cambiar Estado";
    changeStatusButton.onclick = () =>
      showChangeStatusForm(task.id, task.status, task.title);
    taskActions.appendChild(changeStatusButton);

    taskCard.appendChild(taskActions);

    taskList.appendChild(taskCard);
  });
}

export function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  if (sidebar) {
    sidebar.classList.toggle("open");
  } else {
    console.error("No se encontró el elemento con ID 'sidebar'");
  }
}

export async function showChangeStatusFormNav() {
  const modal = document.getElementById("change-status-modal");
  const tasks = await getTasks();
  await loadTasksSelector(tasks);
  modal.showModal();
}

export function showCreateTaskForm() {
  const modal = document.getElementById("create-task-modal");
  modal.showModal();
}

export function closeChangeStatusForm() {
  document.getElementById("change-status-modal").close();
}

export function closeCreateTaskForm() {
  document.getElementById("create-task-modal").close();
}

// *** Funciones para Configuración ***

async function loadConfigOptions() {
  const select = document.getElementById("config-select");
  if (!select) {
    console.error("El elemento config-select no se encontró en el DOM.");
    return;
  }
  select.innerHTML = "<option>Cargando opciones...</option>";

  try {
    const tasks = await getTasks();
    select.innerHTML = "";
    tasks.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = item.title;
      select.appendChild(option);
    });
  } catch (error) {
    console.error("Error al cargar opciones de configuración:", error);
    select.innerHTML = "<option>Error al cargar opciones</option>";
  }
}

export function showConfig() {
  const modal = document.getElementById("config-modal");
  loadConfigOptions();

  const savedConfig = JSON.parse(localStorage.getItem("appConfig"));
  if (savedConfig) {
    document.getElementById("config-select").value =
      savedConfig.selectedOption || "";
    document.getElementById("config-range").value =
      savedConfig.sliderValue || 1;
    document.getElementById("language-select").value =
      savedConfig.language || "es-ES";

    updateRangeValue(savedConfig.sliderValue || 1);
  }

  modal.showModal();
}

export function closeConfig() {
  document.getElementById("config-modal").close();
}

export function updateRangeValue(value) {
  const rangeValueElement = document.getElementById("range-value");
  if (rangeValueElement) {
    rangeValueElement.textContent = `Valor actual: ${value}`;
  }

  const savedConfig = JSON.parse(localStorage.getItem("appConfig")) || {};
  savedConfig.sliderValue = value;
  localStorage.setItem("appConfig", JSON.stringify(savedConfig));
}

export function saveConfig() {
  const configSelect = document.getElementById("config-select");
  const configRange = document.getElementById("config-range");
  const languageSelect = document.getElementById("language-select");

  if (!configSelect || !configRange || !languageSelect) {
    console.error(
      "Uno o más elementos de configuración no se encontraron en el DOM."
    );
    return;
  }

  const selectedOption = configSelect.value;
  const sliderValue = configRange.value;
  const language = languageSelect.value;

  const config = { selectedOption, sliderValue, language };

  // Guardar la configuración en localStorage
  localStorage.setItem("appConfig", JSON.stringify(config));

  Swal.fire(
    "Configuración guardada",
    "Tus ajustes han sido aplicados.",
    "success"
  );
  closeConfig();
}
