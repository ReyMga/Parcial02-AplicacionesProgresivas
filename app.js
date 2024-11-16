const API_URL = "https://6733e8a8a042ab85d1185748.mockapi.io/tareas";

// Obtener tareas desde MockAPI
async function getTasks() {
  try {
    const response = await fetch(API_URL);
    if (response.ok) {
      const tasks = await response.json();
      tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      displayTasks(tasks);
    }
  } catch (error) {
    console.error("Error al cargar tareas:", error);
  }
}

async function loadTasksSelector() {
  try {
    const response = await fetch(API_URL);
    if (response.ok) {
      const tasks = await response.json();
      const taskSelect = document.getElementById("task-select");
      tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      tasks.forEach((task) => {
        taskSelect.innerHTML += `<option value="${task.id}">${task.title}</option>`;
      });
    }
  } catch (error) {
    console.error("Error al cargar tareas:", error);
  }
}
// Función para eliminar una tarea
function deleteTask(taskId) {
  if (!taskId) {
    console.error("ID de tarea no válido");
    return;
  }

  Swal.fire({
    title: "¿Estás seguro?",
    text: "No podrás revertir esta acción",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, borrar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`${API_URL}/${taskId}`, { method: "DELETE" })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error al eliminar la tarea");
          }
          Swal.fire("Borrado", "La tarea ha sido eliminada.", "success");
          document.getElementById(`task-${taskId}`)?.remove();
        })
        .catch((error) => {
          console.error("Error al eliminar la tarea:", error);
          Swal.fire("Error", "No se pudo eliminar la tarea.", "error");
        });
    }
  });
}

// Mostrar tareas en el DOM
function displayTasks(tasks) {
  const taskList = document.getElementById("task-list");
  taskList.innerHTML = "";

  tasks.forEach((task) => {
    const taskCard = document.createElement("div");
    taskCard.className = "task-card";
    taskCard.id = `task-${task.id}`;

    // Determinar ícono y color según el estado de la tarea
    let statusIcon = "";
    let statusColor = "";
    if (task.status === "pendiente") {
      statusIcon = '<i class="fas fa-hourglass-start text-warning"></i>'; // Icono de "Pendiente"
      statusColor = "text-warning"; // Color amarillo
    } else if (task.status === "en progreso") {
      statusIcon = '<i class="fas fa-spinner text-info"></i>'; // Icono de "En progreso"
      statusColor = "text-info"; // Color azul
    } else if (task.status === "completada") {
      statusIcon = '<i class="fas fa-check-circle text-success"></i>'; // Icono de "Completada"
      statusColor = "text-success"; // Color verde
    }

    taskCard.innerHTML = `
      <div class="task-info">
        <h3>${task.title} ${statusIcon}</h3>
        <p class="${statusColor}"><strong>Estado:</strong> ${task.status}</p>
        <p><strong>Fecha de creación:</strong> ${new Date(task.createdAt).toLocaleString()}</p>
        <p>${task.detail}</p>
      </div>
      <div class="task-actions">
        <button onclick="playTaskDetail('${task.title}', '${task.detail}')">▶️ Play</button>
        <button onclick="deleteTask('${task.id}')">Eliminar</button>
        <button onclick="showChangeStatusForm('${task.id}', '${task.status}', '${task.title}')">Cambiar Estado</button>
      </div>
    `;

    taskList.appendChild(taskCard);
  });
}


// Función para reproducir el detalle de una tarea en audio
function playTaskDetail(title, detail) {
  const taskCard = document.getElementById(`task-${title}`);
  taskCard?.classList.add("task-playing");
  const speech = new SpeechSynthesisUtterance(`${title}. ${detail}`);
  speech.onend = () => taskCard?.classList.remove("task-playing");
  speechSynthesis.speak(speech);
}

// Alternar la visibilidad del sidebar
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  if (sidebar) {
    sidebar.classList.toggle("open");
  } else {
    console.error("No se encontró el elemento con ID 'sidebar'");
  }
}

// Abrir el modal para cambiar estado
function showChangeStatusForm(taskId, currentStatus, taskTitle) {
  const modal = document.getElementById("change-status-modal");
  const taskSelect = document.getElementById("task-select");
  const taskStatusSelect = document.getElementById("edit-task-status");
  taskSelect.innerHTML = `<option value="${taskId}">${taskTitle}</option>`;
  taskStatusSelect.value = currentStatus;
  modal.showModal();
}

async function showChangeStatusFormNav() {
  const modal = document.getElementById("change-status-modal");
  //Colocar Todas las tareas
  await loadTasksSelector();
  modal.showModal();
}

function showCreateTaskForm() {
  const modal = document.getElementById("create-task-modal");
  modal.showModal();
}

// Cambiar estado de la tarea
async function changeTaskStatus() {
  const taskId = document.getElementById("task-select").value;
  const newStatus = document.getElementById("edit-task-status").value;
  try {
    await fetch(`${API_URL}/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    getTasks();
    closeChangeStatusForm();
  } catch (error) {
    console.error("Error al cambiar el estado:", error);
  }
}

async function createTask() {
  const title = document.getElementById("task-title").value;
  const detail = document.getElementById("task-detail").value;
  const status = document.getElementById("task-status").value;
  try {
    await fetch(`${API_URL}/${taskId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, detail, status }),
    });
    getTasks();
    closeCreateTaskForm();
  } catch (error) {
    console.error("Error al crear tarea:", error);
  }
}

// Cerrar el modal de cambiar estado
function closeChangeStatusForm() {
  document.getElementById("change-status-modal").close();
}

function closeCreateTaskForm() {
  document.getElementById("create-task-modal").close();
}

// Cargar las tareas al inicio
getTasks();
