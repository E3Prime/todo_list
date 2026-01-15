/**
 * @typedef {object} Todo
 * @property {number} id - Unique identifier of the todo item.
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
const todos = [
  {id: 1, title: 'Woah Hey', priority: 'medium', status: 'pending'},
  {id: 2, title: 'Best Buy Card', priority: 'high', status: 'in progress'},
];
let idCounter = 0;
/** @type {number} */
let activeTodoId = 0;
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
todoForm.addEventListener('submit', createTodo);
updateTaskBtn.addEventListener('submit', updateTodo);

/** @param {PointerEvent} e */
function performAction(e) {
  const target = e.target;
  if (!(target instanceof HTMLButtonElement || target instanceof HTMLInputElement)) return;

  const todoElem = /** @type {HTMLElement} */ (target.parentElement?.parentElement);
  if (target.id === 'update') updateTodoSetup(todoElem);
}

/** @param {SubmitEvent} e */
function createTodo(e) {
  e.preventDefault();
  // NOTE Use this to determine which button was used to submit the form
  const btnAction = e.submitter;
  console.log(btnAction);
  const form = /** @type {HTMLFormElement} */ (e.target);
  const priorityError = /** @type {HTMLParagraphElement} */ (todoForm.querySelector('.error-priority'));
  const statusError = /** @type {HTMLParagraphElement} */ (todoForm.querySelector('.error-status'));
  const {todoTitle, priority, status} = /** @type {FormElements} */ (form.elements);
  if (priority.value === 'none') {
    priorityError.style.visibility = 'visible';
    return;
  } else if (status.value === 'none') {
    statusError.style.visibility = 'visible';
  }
  priorityError.style.visibility = 'hidden';
  statusError.style.visibility = 'hidden';
  todos.push({id: idCounter, title: todoTitle.value, priority: priority.value, status: status.value});
  ++idCounter;
  todoFormWrapper.classList.remove('active');
  form.reset();
  renderTodos();
}

/** @param {SubmitEvent} e */
function updateTodo(e) {
  e.preventDefault();
  const form = /** @type {HTMLFormElement} */ (e.target);
  const priorityError = /** @type {HTMLParagraphElement} */ (todoForm.querySelector('.error-priority'));
  const statusError = /** @type {HTMLParagraphElement} */ (todoForm.querySelector('.error-status'));
  const {todoTitle, priority, status} = /** @type {FormElements} */ (form.elements);
  if (priority.value === 'none') {
    priorityError.style.visibility = 'visible';
    return;
  } else if (status.value === 'none') {
    statusError.style.visibility = 'visible';
  }
  priorityError.style.visibility = 'hidden';
  statusError.style.visibility = 'hidden';
  todos.splice(activeTodoId, 1, {id: activeTodoId, title: todoTitle.value, priority: priority.value, status: status.value});
  todoFormWrapper.classList.remove('active');
  form.reset();
  renderTodos();
}

/** @param {HTMLElement} todoElem */
function updateTodoSetup(todoElem) {
  const todoId = Number(todoElem.id.slice(-1));
  const todo = /** @type {Todo} */ (todos.find((t) => t.id === todoId));
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
        <h4 style="text-align: center;">Currently there are no todos present, click create task to have one present</h4>
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
      <div class="todo" id="todo-${todo.id}">
        <div class="todo-action-btns">
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

// const todoList = /** @type {HTMLElement} */ (document.getElementById('todoList'));
// const createTodoBtn = /** @type {HTMLButtonElement} */ (document.getElementById('createTodo'));
// /** @type {Todo[]} */
// const todos = [];

// /** @param {Event} e */
// const performAction = (e) => {
//   const target = e.target;
//   if (!(target instanceof HTMLInputElement || target instanceof HTMLButtonElement)) return;

//   const todoElem = /** @type {HTMLElement} */ (target.parentElement);
//   const checkboxElem = /** @type {HTMLInputElement} */ (todoElem.children[3]);
//   const checkboxElemId = Number(checkboxElem.id.slice(-1));
//   const [action, indexStr] = target.id.split('-');
//   const todoIndex = Number(indexStr);

//   if (action === 'update') updateTodo(todoElem, todoIndex);
//   else if (checkboxElem.checked || action === 'delete') deleteTodo(todoElem, checkboxElemId);
// };

// const createTodo = () => {
//   const inputElem = /** @type {HTMLInputElement} */ (createTodoBtn.previousElementSibling);
//   if (inputElem.value.replaceAll(' ', '').length < 2) return;
//   todos.push({title: inputElem.value});
//   inputElem.value = '';
//   saveTodos(todos);
//   renderTodos(todoList, todos);
// };

// const getTodos = () => {
//   const savedTodos = localStorage.getItem('todos');
//   if (!savedTodos) return;
//   const parsedTodos = /** @type {Todo[]} */ (JSON.parse(savedTodos));
//   parsedTodos.forEach((todo) => todos.push(todo));
// };

// /**
//  * @param {HTMLElement} todoElem
//  * @param {number} todoIndex
//  */
// const updateTodo = (todoElem, todoIndex) => {
//   const [labelElem, checkboxElem, inputElem] = /** @type {[HTMLLabelElement, HTMLInputElement, HTMLInputElement]} */ (Array.from(todoElem.children).slice(-3));
//   const actionImg = /** @type {HTMLImageElement} */ (todoElem.children[1].firstElementChild);
//   const action = /** @type {string} */ (actionImg.getAttribute('src')?.split('/').pop()?.split('.')[0]);

//   if (action === 'pen') {
//     labelElem.style.display = 'none';
//     checkboxElem.style.display = 'none';
//     actionImg.src = 'imgs/check.svg';
//     inputElem.value = todos[todoIndex].title;
//     inputElem.style.display = 'block';
//     inputElem.focus();
//   } else if (action === 'check') {
//     todos.splice(todoIndex, 1, {title: inputElem.value});
//     inputElem.value = '';
//     inputElem.style.display = 'none';
//     actionImg.src = 'imgs/pen.svg';
//     checkboxElem.style.display = 'block';
//     labelElem.style.display = 'block';
//     labelElem.textContent = todos[todoIndex].title;
//     saveTodos(todos);
//   }
// };

// /**
//  * @param {HTMLElement} todoElem
//  * @param {number} todoIndex
//  */
// const deleteTodo = async (todoElem, todoIndex) => {
//   todoElem.classList.add('fade-out');
//   await sleep(1000);
//   todos.splice(todoIndex, 1);
//   saveTodos(todos);
//   renderTodos(todoList, todos);
// };

// getTodos();
// renderTodos(todoList, todos);
// todoList.addEventListener('click', performAction);
// createTodoBtn.addEventListener('click', createTodo);

// /**
//  * @param {HTMLElement} todoList
//  * @param {Todo[]} todos
//  */
// function renderTodos(todoList, todos) {
//   if (!todos) return;
//   todoList.innerHTML = '';
//   for (let i = 0; i < todos.length; ++i) {
//     const todo = todos[i];
//     const todoStructure = `
//       <div class="todo" id="todo-${i}">
//         <button type="button" id="delete-${i}">
//           <img src="imgs/trash.svg" alt="Delete Todo" />
//         </button>
//         <button type="button" id="update-${i}">
//           <img src="imgs/pen.svg" alt="Update Todo" />
//         </button>
//         <label for="todo-title-${i}">${todo.title}</label>
//         <input type="checkbox" id="todo-title-${i}" name="todo-title-${i}" />
//         <input type="text" hidden />
//       </div>
//     `;
//     todoList.innerHTML += todoStructure;
//   }
// }

// /** @param {Todo[]} todos */
// function saveTodos(todos) {
//   localStorage.setItem('todos', JSON.stringify(todos));
// }
