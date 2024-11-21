const API_URL = "https://6733e8a8a042ab85d1185748.mockapi.io/tareas";

export async function getTasks() {
  try {
    const response = await fetch(API_URL);
    if (response.ok) {
      const tasks = await response.json();
      tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return tasks;
    }
  } catch (error) {
    console.error("Error al cargar tareas:", error);
  }
}

export async function deleteTaskFromAPI(taskId) {
  try {
    const response = await fetch(`${API_URL}/${taskId}`, { method: "DELETE" });
    if (!response.ok) {
      throw new Error("Error al eliminar la tarea");
    }
    return true;
  } catch (error) {
    console.error("Error al eliminar la tarea:", error);
    return false;
  }
}

export async function updateTaskStatus(taskId, status) {
  try {
    // Si el estado es "completada", agrega la fecha de finalización
    const completedAt =
      status === "completada" ? new Date().toISOString() : null;

    await fetch(`${API_URL}/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status,
        completedAt, // Se envía completedAt solo si la tarea está completada
      }),
    });
  } catch (error) {
    console.error("Error al cambiar el estado:", error);
    throw error;
  }
}

export async function createTask(title, detail, status) {
  try {
    await fetch(`${API_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, detail, status }),
    });
  } catch (error) {
    console.error("Error al crear tarea:", error);
    throw error;
  }
}
