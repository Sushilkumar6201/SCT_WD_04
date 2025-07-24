let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

document.addEventListener("DOMContentLoaded", () => {
  renderTasks();
  requestNotificationPermission();
  setInterval(checkForReminders, 60000); // every minute
  loadTheme();

  document.getElementById('theme-toggle').onclick = toggleTheme;
});

function addTask() {
  const title = document.getElementById('task-title').value.trim();
  const time = document.getElementById('task-time').value;
  const category = document.getElementById('task-category').value.trim();

  if (!title) {
    alert("Task title cannot be empty!");
    return;
  }

  tasks.push({ title, time, category, completed: false, notified: false });
  saveTasks();
  clearInputs();
  renderTasks();
}

function clearInputs() {
  document.getElementById('task-title').value = '';
  document.getElementById('task-time').value = '';
  document.getElementById('task-category').value = '';
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  const list = document.getElementById('task-list');
  list.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");

    const title = document.createElement("span");
    title.className = "task-title" + (task.completed ? " completed" : "");
    title.innerText = `${task.title} (${task.category || "No Category"}) - ${task.time || "No time"}`;

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const completeBtn = document.createElement("button");
    completeBtn.innerText = task.completed ? "Undo" : "Done";
    completeBtn.onclick = () => toggleComplete(index);

    const editBtn = document.createElement("button");
    editBtn.innerText = "Edit";
    editBtn.onclick = () => editTask(index);

    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete";
    deleteBtn.onclick = () => deleteTask(index);

    actions.append(completeBtn, editBtn, deleteBtn);
    li.append(title, actions);
    list.appendChild(li);
  });
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function editTask(index) {
  const newTitle = prompt("Edit Task Title:", tasks[index].title);
  if (newTitle !== null) tasks[index].title = newTitle.trim() || tasks[index].title;

  const newTime = prompt("Edit Date/Time:", tasks[index].time);
  if (newTime !== null) tasks[index].time = newTime;

  const newCategory = prompt("Edit Category:", tasks[index].category);
  if (newCategory !== null) tasks[index].category = newCategory.trim();

  saveTasks();
  renderTasks();
}

function requestNotificationPermission() {
  if ("Notification" in window) {
    Notification.requestPermission();
  }
}

function checkForReminders() {
  if (Notification.permission !== "granted") return;

  const now = new Date().toISOString().slice(0, 16); // yyyy-MM-ddTHH:mm
  tasks.forEach((task, index) => {
    if (
      task.time &&
      task.time.slice(0, 16) === now &&
      !task.notified &&
      !task.completed
    ) {
      new Notification("Task Reminder", {
        body: `${task.title} (${task.category || "No Category"}) is due now!`
      });
      tasks[index].notified = true;
      saveTasks();
    }
  });
}

function toggleTheme() {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
}

function loadTheme() {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }
}
