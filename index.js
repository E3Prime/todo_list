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
  const todos = [];

  /** @param {Event} e */
  const performAction = (e) => {
    const target = e.target;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLButtonElement)) return;

    const todoElem = /** @type {HTMLElement} */ (target.parentElement);
    const checkboxElem = /** @type {HTMLInputElement} */ (todoElem.children[3]);
    const checkboxElemId = Number(checkboxElem.id.slice(-1));
    const [action, indexStr] = target.id.split('-');
    const todoIndex = Number(indexStr);

    if (action === 'update') updateTodo(todoElem, todoIndex);
    else if (checkboxElem.checked || action === 'delete') deleteTodo(todoElem, checkboxElemId);
  };

  const createTodo = () => {
    const inputElem = /** @type {HTMLInputElement} */ (createTodoBtn.previousElementSibling);
    if (inputElem.value.replaceAll(' ', '').length < 2) return;
    todos.push({title: inputElem.value});
    inputElem.value = '';
    saveTodos(todos);
    renderTodos(todoList, todos);
  };

  const getTodos = () => {
    const savedTodos = localStorage.getItem('todos');
    if (!savedTodos) return;
    const parsedTodos = /** @type {Todo[]} */ (JSON.parse(savedTodos));
    parsedTodos.forEach((todo) => todos.push(todo));
  };

  /**
   * @param {HTMLElement} todoElem
   * @param {number} todoIndex
   */
  const updateTodo = (todoElem, todoIndex) => {
    const [labelElem, checkboxElem, inputElem] = /** @type {[HTMLLabelElement, HTMLInputElement, HTMLInputElement]} */ (Array.from(todoElem.children).slice(-3));
    const actionImg = /** @type {HTMLImageElement} */ (todoElem.children[1].firstElementChild);
    const action = /** @type {string} */ (actionImg.getAttribute('src')?.split('/').pop()?.split('.')[0]);

    if (action === 'pen') {
      labelElem.style.display = 'none';
      checkboxElem.style.display = 'none';
      actionImg.src = 'imgs/check.svg';
      inputElem.value = todos[todoIndex].title;
      inputElem.style.display = 'block';
      inputElem.focus();
    } else if (action === 'check') {
      todos.splice(todoIndex, 1, {title: inputElem.value});
      inputElem.value = '';
      inputElem.style.display = 'none';
      actionImg.src = 'imgs/pen.svg';
      checkboxElem.style.display = 'block';
      labelElem.style.display = 'block';
      labelElem.textContent = todos[todoIndex].title;
      saveTodos(todos);
    }
  };

  /**
   * @param {HTMLElement} todoElem
   * @param {number} todoIndex
   */
  const deleteTodo = async (todoElem, todoIndex) => {
    todoElem.classList.add('fade-out');
    await sleep(1000);
    todos.splice(todoIndex, 1);
    saveTodos(todos);
    renderTodos(todoList, todos);
  };

  getTodos();
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
      <div class="todo" id="todo-${i}">
        <button type="button" id="delete-${i}">
          <img src="imgs/trash.svg" alt="Delete Todo" />
        </button>
        <button type="button" id="update-${i}">
          <img src="imgs/pen.svg" alt="Update Todo" />
        </button>
        <label for="todo-title-${i}">${todo.title}</label>
        <input type="checkbox" id="todo-title-${i}" name="todo-title-${i}" />
        <input type="text" hidden />
      </div>
    `;
    todoList.innerHTML += todoStructure;
  }
}

/** @param {Todo[]} todos */
function saveTodos(todos) {
  localStorage.setItem('todos', JSON.stringify(todos));
}
