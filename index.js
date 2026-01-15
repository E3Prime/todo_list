/**
 * @typedef {object} Todo
 * @property {string} title - The title of the todo item.
 * @property {string} priority - Priority indicator of the todo item.
 * @property {string} status - Completion status of the todo item.
 */

/**
 * @typedef {HTMLFormControlsCollection & {
 * todoTitle: HTMLInputElement,
 * priority: HTMLSelectElement,
 * status: HTMLSelectElement
 * }} FormElements
 */

/** @param {number} ms */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const todoList = /** @type {HTMLDivElement} */ (document.getElementById('todoList'));
const noTodosPresent = /** @type {HTMLDivElement} */ (todoList.querySelector('.no-todos-present'));
const openTodoFormBtn = /** @type {HTMLButtonElement} */ (document.getElementById('openTodoForm'));
const todoFormWrapper = /** @type {HTMLDivElement} */ (document.getElementById('todoFormWrapper'));
const closeTodoFormBtn = /** @type {HTMLButtonElement} */ (todoFormWrapper.querySelector('#closeTodoForm'));
const todoForm = /** @type {HTMLFormElement} */ (todoFormWrapper.querySelector('#todoForm'));
const createTaskBtn = /** @type {HTMLButtonElement} */ (todoForm.querySelector('#createTask'));
const updateTaskBtn = /** @type {HTMLButtonElement} */ (todoForm.querySelector('#updateTask'));
const formTitle = /** @type {HTMLElement} */ (todoForm.querySelector('#formTitle'));

/** @type {Todo[]} */
const todos = [];
let activeTodoId = 0;

getTodos();
renderTodos();

todoList.addEventListener('click', performAction);
openTodoFormBtn.addEventListener('click', () => todoFormWrapper.classList.add('active'));
closeTodoFormBtn.addEventListener('click', () => {
  todoFormWrapper.classList.remove('active');
  if (updateTaskBtn.checkVisibility()) {
    formTitle.textContent = 'Add New Task';
    createTaskBtn.removeAttribute('hidden');
    updateTaskBtn.setAttribute('hidden', '');
  }
});
todoForm.addEventListener('submit', formAction);

/** @param {PointerEvent} e */
async function performAction(e) {
  const target = e.target;
  if (!(target instanceof HTMLButtonElement || target instanceof HTMLInputElement)) return;

  const todoElem = /** @type {HTMLElement} */ (target.parentElement?.parentElement);

  if (target instanceof HTMLInputElement && target.checked) {
    const todoElem = /** @type {HTMLElement} */ (target.parentElement?.parentElement?.parentElement);
    deleteTodo(todoElem);
  } else if (target.id === 'update') updateTodoSetup(todoElem);
  else if (target.id === 'delete') deleteTodo(todoElem);
}

/** @param {SubmitEvent} e */
function formAction(e) {
  e.preventDefault();
  const formAction = e.submitter?.id;
  const form = /** @type {HTMLFormElement} */ (e.target);
  const priorityError = /** @type {HTMLParagraphElement} */ (todoForm.querySelector('.error-priority'));
  const statusError = /** @type {HTMLParagraphElement} */ (todoForm.querySelector('.error-status'));
  const {todoTitle, priority, status} = /** @type {FormElements} */ (form.elements);
  if (priority.value === 'none') {
    priorityError.style.visibility = 'visible';
    return;
  } else if (status.value === 'none') {
    statusError.style.visibility = 'visible';
    return;
  }
  priorityError.style.visibility = 'hidden';
  statusError.style.visibility = 'hidden';
  formAction === 'createTask' ? createTodo(todoTitle, priority, status) : updateTodo(todoTitle, priority, status);
  todoFormWrapper.classList.remove('active');
  form.reset();
  saveTodos();
  renderTodos();
}

/**
 * @param {HTMLInputElement} todoTitle
 * @param {HTMLSelectElement} priority
 * @param {HTMLSelectElement} status
 */
function createTodo(todoTitle, priority, status) {
  todos.push({title: todoTitle.value, priority: priority.value, status: status.value});
}

function getTodos() {
  const savedTodos = localStorage.getItem('todos');
  if (!savedTodos) return;
  const parsedTodos = /** @type {Todo[]} */ (JSON.parse(savedTodos));
  parsedTodos.forEach((todo) => todos.push(todo));
}

/**
 * @param {HTMLInputElement} todoTitle
 * @param {HTMLSelectElement} priority
 * @param {HTMLSelectElement} status
 */
function updateTodo(todoTitle, priority, status) {
  todos.splice(activeTodoId, 1, {title: todoTitle.value, priority: priority.value, status: status.value});
}

/** @param {HTMLElement} todoElem */
async function deleteTodo(todoElem) {
  const todoId = Number(todoElem.id.slice(-1));
  todoElem.classList.add('fade-out');
  await sleep(1000);
  todos.splice(todoId, 1);
  saveTodos();
  renderTodos();
}

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

/** @param {HTMLElement} todoElem */
function updateTodoSetup(todoElem) {
  const todoId = Number(todoElem.id.slice(-1));
  const todo = /** @type {Todo} */ todos[todoId];
  todoFormWrapper.classList.add('active');
  const titleElem = /** @type {HTMLInputElement} */ (todoForm.querySelector('#todoTitle'));
  const priorityElem = /** @type {HTMLSelectElement} */ (todoForm.querySelector('#priority'));
  const statusElem = /** @type {HTMLSelectElement} */ (todoForm.querySelector('#status'));
  createTaskBtn.setAttribute('hidden', '');
  updateTaskBtn.removeAttribute('hidden');
  formTitle.textContent = 'Update Task';
  titleElem.value = todo.title;
  priorityElem.value = todo.priority;
  statusElem.value = todo.status;
  activeTodoId = todoId;
}

function renderTodos() {
  if (todos.length === 0) {
    todoList.innerHTML = `
      <div style="height: 100%; align-content: center;">
        <h4 style="text-align: center;">Currently there are no todos present, create a task to have one present</h4>
      </div>
    `;
    return;
  }
  todoList.innerHTML = '';
  for (let i = 0; i < todos.length; ++i) {
    const todo = todos[i];
    let starImg = '';
    if (todo.priority === 'low') {
      starImg = 'images/star-green.svg';
    } else if (todo.priority === 'medium') {
      starImg = 'images/star-yellow.svg';
    } else {
      starImg = 'images/star-red.svg';
    }
    const todoStructure = `
      <div class="todo" id="todo-${i}">
        <div class="todo-action-btns">
          <div>
            <label for="completeTask${i}">Complete Task</label>
            <input type="checkbox" id="completeTask${i}" />
          </div>
          <button type="button" id="update">
            <img src="images/pen.svg" alt="Update" />
          </button>
          <button type="button" id="delete">
            <img src="images/trash.svg" alt="Delete" />
          </button>
        </div>
        <h3 class="todo-title">${todo.title}</h3>
        <div class="todo-details">
          <img src="${starImg}" alt="Star" />
          <p class=${todo.priority === 'low' ? 'low' : todo.priority === 'medium' ? 'medium' : 'high'}>${todo.priority}</p>
          <p class="${todo.status === 'pending' ? 'pending' : 'in-progress'}">${todo.status}</p>
        </div>
      </div>
    `;
    todoList.innerHTML += todoStructure;
  }
}
