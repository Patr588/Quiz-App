// script.js

document.addEventListener('DOMContentLoaded', loadTasks);

// Add Task functionality
document.getElementById("addTaskButton").addEventListener("click", function() {
  const taskInput = document.getElementById("taskInput");
  const taskText = taskInput.value.trim();

  if (taskText === "") {
    alert("Please enter a task!");
    return;
  }

  // Create a new task object
  const task = {
    text: taskText,
    id: Date.now(),
    completed: false // New tasks are not completed by default
  };

  // Save task to localStorage
  saveTaskToLocalStorage(task);

  // Create a new list item and append it
  createTaskElement(task);

  // Clear the input field
  taskInput.value = "";
});

// Optionally, press Enter to add a task
document.getElementById("taskInput").addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    document.getElementById("addTaskButton").click();
  }
});

// Save task to localStorage
function saveTaskToLocalStorage(task) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from localStorage dynamically
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.forEach(task => createTaskElement(task));
}

// Create a task element and append it to the list dynamically
function createTaskElement(task) {
  const li = document.createElement("li");
  li.id = task.id;

  // Task text
  const span = document.createElement("span");
  span.textContent = task.text;
  if (task.completed) {
    span.classList.add("completed");
  }

  // Mark task as completed
  const completeButton = document.createElement("button");
  completeButton.textContent = task.completed ? "Undo" : "Complete";
  completeButton.addEventListener("click", function() {
    toggleTaskCompletion(task.id);
  });

  // Remove task
  const removeButton = document.createElement("button");
  removeButton.textContent = "X";
  removeButton.addEventListener("click", function() {
    removeTask(task.id);
    li.remove();
  });

  // Append buttons to the list item
  li.appendChild(span);
  li.appendChild(completeButton);
  li.appendChild(removeButton);

  // Append the new task to the list
  document.getElementById("taskList").appendChild(li);
}

// Toggle task completion (Mark as complete or undo)
function toggleTaskCompletion(taskId) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const task = tasks.find(task => task.id === taskId);
  task.completed = !task.completed;

  // Save updated tasks back to localStorage
  localStorage.setItem('tasks', JSON.stringify(tasks));

  // Update UI dynamically
  const taskItem = document.getElementById(taskId);
  const span = taskItem.querySelector('span');
  const completeButton = taskItem.querySelector('button');

  if (task.completed) {
    span.classList.add("completed");
    completeButton.textContent = "Undo";
  } else {
    span.classList.remove("completed");
    completeButton.textContent = "Complete";
  }
}

// Remove task from localStorage
function removeTask(taskId) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const updatedTasks = tasks.filter(task => task.id !== taskId);
  localStorage.setItem('tasks', JSON.stringify(updatedTasks));
}

// Filter tasks (Show All, Completed, Pending)
document.getElementById("showAll").addEventListener("click", function() {
  filterTasks("all");
});

document.getElementById("showCompleted").addEventListener("click", function() {
  filterTasks("completed");
});

document.getElementById("showPending").addEventListener("click", function() {
  filterTasks("pending");
});

function filterTasks(status) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const filteredTasks = tasks.filter(task => {
    if (status === "completed") return task.completed;
    if (status === "pending") return !task.completed;
    return true; // Show all tasks
  });

  // Clear the current list and reload the filtered tasks
  document.getElementById("taskList").innerHTML = "";
  filteredTasks.forEach(task => createTaskElement(task));
}
