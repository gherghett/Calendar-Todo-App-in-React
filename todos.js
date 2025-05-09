// Nyckel för localStorage
const STORAGE_KEY = "todos";

// Hämta todos från localStorage
export function getTodos() {
  const todosJson = localStorage.getItem(STORAGE_KEY);
  const todos =  todosJson ? JSON.parse(todosJson) : [];
  return isIterable(todos) ? todos : [];
}

// Spara todos till localStorage
export function saveTodos(todos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function removeTodo(id) {
  saveTodos(getTodos().filter(todo => todo.id != id));
}

// Skapa en ny todo
export function createTodo(title, date) {
  const newTodo = {
    id: crypto.randomUUID(),
    title: title,
    date: new Date(date).toLocaleDateString("sv-SE"),
    completed: false,
  };

  const todos = getTodos();
  todos.push(newTodo);
  saveTodos(todos);
  return newTodo;
}

// Renders and creates list-items for each todo (open for improvements, just add new elements to forEach)
// Argument passed to parameter should be an array
function renderTodoList(todoList, updateView) {
  const list = document.getElementById("todo-list");
  
  // Clear old content
  list.innerHTML = "";

  todoList.forEach((todo) => {
    const listItem = document.createElement("li");

    const title = document.createElement("h3");
    title.textContent = todo.title;

    const date = document.createElement("p");
    date.textContent = todo.date;

    const done = document.createElement("p");
    done.textContent = Boolean(todo.completed) ? "Done" : "";

    const remove = document.createElement("button");
    remove.textContent = "X";
    remove.setAttribute("data-cy", "delete-todo-button");

    remove.addEventListener("click", () => {
      removeTodo(todo.id);
      updateView();
    });

    listItem.appendChild(title);
    listItem.appendChild(date);
    listItem.appendChild(done);
    listItem.appendChild(remove);


    list.appendChild(listItem);
  });
}

// Only function "getTodos" handles the logic of fetching todo-data
export function updateTodoList(updateView) {
  renderTodoList(getTodos(), updateView);
}

function isIterable(obj) {
    return obj != null && typeof obj[Symbol.iterator] === 'function';
  }
  

