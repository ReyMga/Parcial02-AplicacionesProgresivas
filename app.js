const API_URL = "https://6733e8a8a042ab85d1185748.mockapi.io/tareas";

// Obtener y mostrar las tareas
async function getTasks() {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        Accept: "application/json", // Asegúrate de que la respuesta sea en JSON
      },
    });
    if (response.ok) {
      const tasks = await response.json();
      // Ordenar las tareas de más nuevas a más viejas
      tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      displayTasks(tasks);
      enableDisableUpdateButton(tasks);
    } else {
      console.error("Error en la respuesta de la API:", response.statusText);
    }
  } catch (error) {
    console.error("Error al cargar tareas:", error);
  }
}

function enableDisableUpdateButton(tasks) {
    const changeStatusButton = document.getElementById("changeStatusButton");
    debugger;
    if (changeStatusButton) {
        changeStatusButton.disabled = tasks.length === 0;
    } else {
        console.error("El botón con ID 'changeStatusButton' no se encontró.");
    }
}


// Función para mostrar las tareas en el DOM
function displayTasks(tasks) {
  const taskList = document.getElementById("task-list");
  taskList.innerHTML = ""; // Limpiar el contenedor antes de agregar las tareas

  tasks.forEach((task) => {
    const taskCard = document.createElement("div");
    taskCard.className = "task-card";
    taskCard.id = `task-${task.id}`; // Agregar ID único para cada tarea

    // Obtener la fecha y hora de creación
    const creationDate = new Date(task.createdAt);
    const formattedDate = `${creationDate.toLocaleDateString()} ${creationDate.toLocaleTimeString()}`;

    taskCard.innerHTML = `
        <div class="task-info">
          <h3>${task.title}</h3>
          <p><strong>Fecha de Creación:</strong> ${formattedDate}</p>
          <p>${task.detail}</p>
        </div>
        <div class="task-actions">
          <button onclick="playTaskDetail('${task.detail}')">▶️</button>
          <button onclick="showChangeStatusForm('${task.id}', '${task.status}', '${task.title}')">Cambiar Estado</button>
          <button onclick="deleteTask('${task.id}')">Eliminar</button>
        </div>
      `;

    taskList.appendChild(taskCard);
  });
}

// Crear una nueva tarea
function createTask() {
  const taskTitle = document.getElementById("task-title").value;
  const taskDetail = document.getElementById("task-detail").value;

  if (taskTitle && taskDetail) {
    const newTask = {
      title: taskTitle,
      detail: taskDetail,
    };

    // Enviar la nueva tarea a MockAPI
    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTask),
    })
      .then((response) => response.json())
      .then((data) => {
        closeCreateTaskForm();
        console.log("Tarea creada:", data);
        Swal.fire({
          icon: "success",
          title: "Tarea creada",
          text: "¡La tarea se ha añadido correctamente!",
          confirmButtonColor: "#3085d6",
        });
        getTasks(); // Recargar las tareas para mostrar la nueva
      })
      .catch((error) => {
        console.error("Error al crear la tarea:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Hubo un problema al guardar la tarea.",
          confirmButtonColor: "#d33",
        });
      });
  } else {
    Swal.fire({
      icon: "error",
      title: "Campos vacíos",
      text: "Por favor, completa todos los campos antes de guardar la tarea.",
      confirmButtonColor: "#d33",
    });
  }
}

// Función para abrir el modal de Crear Tarea
function showCreateTaskForm() {
  const modal = document.getElementById("create-task-modal");
  modal.showModal(); // Abre el modal
  document.getElementById("task-title").focus(); // Establece el foco en el campo de título
}

function closeCreateTaskForm() {
  const taskTitle = document.getElementById("task-title");

  if (taskTitle) {
    taskTitle.value = ""; // Limpiar el campo si lo deseas
    taskTitle.blur(); // Desenfocar el campo
  }

  const createTaskModal = document.getElementById("create-task-modal");

  if (createTaskModal) {
    createTaskModal.close(); // Cerrar el modal
  }
}

// Función para eliminar una tarea
function deleteTask(taskId) {
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
      // Realizar la solicitud DELETE
      fetch(`${API_URL}/${taskId}`, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Tarea eliminada:", data);
          Swal.fire("Borrado", "La tarea ha sido eliminada.", "success");
          // Eliminar la tarea del DOM si la eliminación fue exitosa
          const taskElement = document.getElementById(`task-${taskId}`);
          if (taskElement) {
            taskElement.remove();
          }
        })
        .catch((error) => {
          console.error("Error al eliminar la tarea:", error);
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Hubo un problema al eliminar la tarea.",
          });
        });
    }
  });
}

// Función para abrir el formulario de cambio de estado de la tarea
function showChangeStatusForm(taskId, currentStatus, taskTitle) {
  const modal = document.getElementById("change-status-modal");

  // Verificamos si el modal existe en el DOM
  if (modal) {
    modal.showModal();

    // Obtenemos el elemento que mostrará el título de la tarea
    const taskNameElement = document.getElementById("task-name");
    if (taskNameElement) {
      // Aseguramos que taskTitle tiene un valor
      taskNameElement.textContent = `Tarea: ${taskTitle || "Sin título"}`;
    }

    // Obtenemos el elemento para mostrar el estado actual de la tarea
    const taskStatusElement = document.getElementById("task-status");
    if (taskStatusElement) {
      taskStatusElement.value = currentStatus;
    }

    // Asignamos el ID de la tarea al formulario
    const taskIdElement = document.getElementById("task-id");
    if (taskIdElement) {
      taskIdElement.value = taskId;
    }
  } else {
    console.error("El modal no se encuentra en el DOM");
  }
}

// Función para cerrar el formulario de cambio de estado
function closeChangeStatusForm() {
  const modal = document.getElementById("change-status-modal");
  modal.close(); // Cierra el modal
}

// Función para cambiar el estado de la tarea
function changeTaskStatus() {
  const taskId = document.getElementById("task-id").value;
  const taskStatus = document.getElementById("task-status").value;

  const updatedTask = { status: taskStatus };

  fetch(`${API_URL}/${taskId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedTask),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Estado de la tarea actualizado:", data);
      Swal.fire({
        icon: "success",
        title: "Estado actualizado",
        text: "¡El estado de la tarea ha sido actualizado!",
        confirmButtonColor: "#3085d6",
      });
      closeChangeStatusForm(); // Cierra el modal
      getTasks(); // Recargar las tareas para mostrar el cambio
    })
    .catch((error) => {
      console.error("Error al actualizar el estado:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al actualizar el estado de la tarea.",
        confirmButtonColor: "#d33",
      });
    });
}

// Función para alternar el estado del sidebar
// Habitar o desabilitar boton de cambiar estado según corresponda

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const mainContainer = document.getElementById("main-container");

  // Alterna la clase para abrir/cerrar el sidebar
  sidebar.classList.toggle("open");

  // Si el sidebar se abre, bloquea la interacción con el fondo
  if (sidebar.classList.contains("open")) {
    mainContainer.setAttribute("inert", ""); // Agrega el atributo inert
  } else {
    mainContainer.removeAttribute("inert"); // Elimina el atributo inert
  }
}

// Función para reproducir el detalle de la tarea
function playTaskDetail(taskDetail) {
  if ("speechSynthesis" in window) {
    const speech = new SpeechSynthesisUtterance(taskDetail);
    window.speechSynthesis.speak(speech);
  } else {
    console.log("Lo siento, tu navegador no soporta la síntesis de voz.");
  }
}

// Llamada inicial para obtener y mostrar las tareas
getTasks();
