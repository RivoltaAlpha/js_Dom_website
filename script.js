document.addEventListener("DOMContentLoaded", () => {
  const newTodoInput = document.getElementById("new-todo");
  const addTodoButton = document.getElementById("add-todo");
  const todoList = document.getElementById("todo-list");
  const filterButtons = document.querySelectorAll(".filters button");
  const clearCompletedButton = document.getElementById("clear-completed");

  let todos = JSON.parse(localStorage.getItem("todos")) || [];
  let filter = "all";

  const saveTodos = () => {
    localStorage.setItem("todos", JSON.stringify(todos));
  };

  const renderTodos = () => {
    todoList.innerHTML = "";
    const filteredTodos = todos.filter((todo) => {
      if (filter === "active") return !todo.completed;
      if (filter === "completed") return todo.completed;
      return true;
    });
    filteredTodos.forEach((todo, index) => {
      const todoItem = document.createElement("li");
      todoItem.className = todo.completed ? "completed" : "";
      todoItem.draggable = true;
      todoItem.innerHTML = `
                <input type="radio" ${
                  todo.completed ? "checked" : ""
                } onclick="toggleComplete(${index})">
                <span>${todo.text}</span>
                <div>
                    <button onclick="deleteTodo(${index})">✖</button>
                </div>
            `;
      todoList.appendChild(todoItem);
    });
  };

  const addTodo = (text) => {
    if (text.trim() !== "") {
      todos.push({ text, completed: false });
      saveTodos();
      renderTodos();
    }
  };

  window.toggleComplete = (index) => {
    todos[index].completed = !todos[index].completed;
    saveTodos();
    renderTodos();
  };

  window.deleteTodo = (index) => {
    todos.splice(index, 1);
    saveTodos();
    renderTodos();
  };

  addTodoButton.addEventListener("click", () => addTodo(newTodoInput.value));
  newTodoInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTodoButton.click();
  });

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filter = button.dataset.filter;
      renderTodos();
    });
  });

  clearCompletedButton.addEventListener("click", () => {
    todos = todos.filter((todo) => !todo.completed);
    saveTodos();
    renderTodos();
  });

  // Drag and drop functionality
  let draggedIndex;
  todoList.addEventListener("dragstart", (e) => {
    draggedIndex = [...todoList.children].indexOf(e.target);
  });

  todoList.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  todoList.addEventListener("drop", (e) => {
    const droppedIndex = [...todoList.children].indexOf(e.target.closest("li"));
    if (droppedIndex >= 0) {
      const draggedTodo = todos.splice(draggedIndex, 1)[0];
      todos.splice(droppedIndex, 0, draggedTodo);
      saveTodos();
      renderTodos();
    }
  });

  const fetchTodos = async () => {
    try {
      const response = await fetch("data.json");
      const data = await response.json();
      todos = JSON.parse(localStorage.getItem("todos")) || data;
      renderTodos();
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  fetchTodos();

  renderTodos();
});
