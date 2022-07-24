"use strict";

const todoList = document.getElementById("list");
const todoText = document.getElementById("todo-text");
const addBtn = document.getElementById("add-btn");
const totalTodos = document.getElementById("todo-counter");
const todosLeft = document.getElementById("todos-left-counter");
renderTodos();

// Add todo
function addTodo(todo) {
  if (todo) {
    let todos = localStorage.getItem("todos");
    let todoArray;

    if (todos == null) {
      todoArray = [];
    } else {
      todoArray = Array.from(JSON.parse(todos));
    }

    todoArray.push(todo);

    // set todos to localStorage
    localStorage.setItem("todos", JSON.stringify(todoArray));
    renderTodos();

    return;
  }
}

// Delete todo
function deleteTodo(todoId) {
  const todos = localStorage.getItem("todos");
  let todoArray = Array.from(JSON.parse(todos));

  // makes array of todos removing passed todoId
  const newTodos = todoArray.filter((todo) => {
    return todo.id !== todoId;
  });

  // set newTodos to local storage
  localStorage.setItem("todos", JSON.stringify(newTodos));

  renderTodos();
}

// Toggle todo
function toggleTodo(todoId) {
  const todos = localStorage.getItem("todos");
  let todoArray = Array.from(JSON.parse(todos));

  for (const todo of todoArray) {
    if (todo.id === todoId) {
      todo.completed = !todo.completed;
      localStorage.setItem("todos", JSON.stringify(todoArray));
      renderTodos();
      return;
    }
  }

  notify("could not toggle the todo!");
}

// Add todo to DOM
function addTodoDOM(todo) {
  const li = document.createElement("li");

  li.innerHTML = `
    <input
    type="checkbox"
    id="${todo.id}" ${todo.completed ? "checked" : ""}
    class="custom-checkbox"
  />
  <label for="${todo.id}">${todo.text}</label>

  <div>
  <img src="images/delete.svg" class="delete" data-id="${todo.id}" />
  </div>
  `;

  todoList.append(li);
}

// Render todo
function renderTodos() {
  todoList.innerHTML = "";

  let leftTodo = 0;
  let totalTodo = 0;

  let todoArray = JSON.parse(localStorage.getItem("todos"));
  if (todoArray == null) {
    todoArray = [];
  }
  if (todoArray.length > 0) {
    todoArray.forEach((todo) => {
      addTodoDOM(todo);
      if (todo.completed == false) {
        leftTodo++;
      }
      totalTodo++;
    });
  }

  totalTodos.innerHTML = totalTodo;
  todosLeft.innerHTML = leftTodo;
}

// Notify
function notify(text) {
  window.alert(text);
}

// handles  of "ENTER" and click of "add-btn"
function handleKeypress(e) {
  const target = e.target;
  if (e.key === "Enter" || target.id === "add-btn") {
    const text = todoText.value;

    // if user hasn't typed anything and pressed enter or clicked add-btn
    if (!text) {
      notify("Todo text can't be empty!");
      return;
    }

    // creation of todo
    const todo = {
      text: text,
      id: Date.now().toString(),
      completed: false,
    };

    // make input box empty
    todoText.value = "";

    addTodo(todo);
  }
}

// handle clicks for 'Add', 'Delete' and 'Toggle'
function handleClickListner(e) {
  const target = e.target;

  if (target.id === "add-btn") {
    handleKeypress(e);
    return;
  }

  if (target.className === "delete") {
    const todoId = target.dataset.id;
    deleteTodo(todoId);
    return;
  } else if (target.className === "custom-checkbox") {
    const todoId = target.id;
    toggleTodo(todoId);
    return;
  }
}

// event listner for "ENTER"
todoText.addEventListener("keyup", handleKeypress);

// add event listner to whole document
document.addEventListener("click", handleClickListner);
