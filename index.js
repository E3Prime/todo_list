initialize();

/**
 * @typedef {object} Todo
 * @property {string} title - The title of the todo item.
 */

/** @param {number} ms */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function initialize() {
  const todoList = /** @type {HTMLElement} */ (document.getElementById('todoList'));
  const createTodoBtn = /** @type {HTMLButtonElement} */ (document.getElementById('createTodo'));
  /** @type {Todo[]} */
  const todos = [{title: 'Learn C++'}, {title: 'Learn Rust'}];

  /** @param {Event} e */
  const performAction = (e) => {
    const target = e.target;
    if (!(target instanceof HTMLButtonElement)) return;
    const [action, todoStr] = target.id.split('-');
    const todoIndex = Number(todoStr);
    // NOTE Left off here - implement action handlers
  };

  const createTodo = () => {};

  const updateTodo = () => {};

  const deleteTodo = () => {};

  renderTodos(todoList, todos);
  todoList.addEventListener('click', performAction);
  createTodoBtn.addEventListener('click', createTodo);
}

/**
 * @param {HTMLElement} todoList
 * @param {Todo[]} todos
 */
function renderTodos(todoList, todos) {
  if (!todos) return;
  todoList.innerHTML = '';
  for (let i = 0; i < todos.length; ++i) {
    const todo = todos[i];
    const todoStructure = `
      <div class="todo">
        <button type="button" id="delete-${i}">
          <img src="imgs/trash.svg" alt="Delete Todo" />
        </button>
        <button type="button" id="update-${i}">
          <img src="imgs/pen.svg" alt="Update Todo" />
        </button>
        <label for="todo-${i}">${todo.title}</label>
        <input type="checkbox" id="todo-${i}" name="todo-${i}" />
        <input type="text" hidden />
      </div>
    `;
    todoList.innerHTML += todoStructure;
  }
}
