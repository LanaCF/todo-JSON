const doc = document;
const chkFilter = doc.querySelector('.todo-filter-block input');
const todoListEl = doc.querySelector('.todo-list');
const addTodoForm = doc.querySelector('.add-todo-form');
const btnDelAll = doc.querySelector('.btn-del-all');

let isFiltered = chkFilter.checked;

let todos = getLocalStorage() || [
  { id: 1, text: 'Todo 1', completed: false },
  { id: 2, text: 'Todo 2', completed: false },
  { id: 3, text: 'Todo 3', completed: false },
];

// let lastId = todos.length 
//   ? todos[todos.length - 1].id
//   : 0;

//-----------

localStorage.setItem('todos', JSON.stringify(todos));

if (getIdFromLocalStorage() == null) {
  localStorage.setItem('id', 3)
};

getLocalStorage();

console.log('---- :', getIdFromLocalStorage(), '--', localStorage.getItem('id'));

//-----------------------/

let lastId = getIdFromLocalStorage() !== null
? getIdFromLocalStorage()
: 0;

const addText = doc.createElement('input');
const btnAdd = doc.createElement('button');

addText.className = 'add-text';
addText.placeholder = 'Add your new task';

btnAdd.className = 'btn-add';
btnAdd.setAttribute('disabled', '');
btnAdd.innerHTML = 'Add';

addTodoForm.append(addText);
addTodoForm.append(btnAdd);

renderTodoList(todos, todoListEl);

btnDelAll.onclick = function(event) {
  event.preventDefault();

  const todoItems = doc.querySelectorAll('.todo-item');

  todoItems.forEach(function(todoItem) {
    todoItem.classList.add('del');

    setTimeout(() => {
      todoItem.remove();
    }, 500);
  });

  todos = [];
  localStorage.clear('todos');
  saveLocalStorage();
  console.log('Data cleared:', todos);
}

chkFilter.onchange = function() {
  isFiltered = this.checked;
  renderTodoList(todos, todoListEl);
}

addText.addEventListener('input', function() {
  const valueText = addText.value;

  if (valueText.length >= 1) {
    btnAdd.removeAttribute('disabled');
  } else {
    btnAdd.setAttribute('disabled', '');
  }
});

btnAdd.onclick = function(event) {
  event.preventDefault();

  btnAdd.setAttribute('disabled', '');

  const valueText = addText.value;

  const id = ++lastId;
  const arrTodoAdd = {
    id: id,
    text: valueText,
    completed: false,
  }

  todos.push(arrTodoAdd);
  renderTodoList(todos, todoListEl);

  setTimeout(() => {
    const todoItemInput = doc.querySelectorAll('.todo-item');
    const lastTodo = todoItemInput[todoItemInput.length - 1];

    if (lastTodo) {
      lastTodo.classList.add('show');
      lastTodo.removeAttribute('style');
    }
  }, 100);

  // const todoItemInput = doc.querySelectorAll('.todo-item');
  // const lastTodo = todoItemInput[todoItemInput.length - 1];
  // console.log('l: ', lastTodo);
  // setTimeout(() => {
  //   lastTodo.classList.add('show');
  //   lastTodo.removeAttribute('style');
  //   console.log('Show class applied');
  // }, 500);


  addText.value = '';
  saveLocalStorage();
}

function getFilteredTodos(data) {
  let filteredTodos = [];
  if (isFiltered) {
    filteredTodos = data.filter(function(todo) {
      return !todo.completed;
    });
  } else {
    filteredTodos = data.filter(function(todo) {
      return todo;
    });
  }

  return filteredTodos;
}

function renderTodoList(rawData, parentEl) {
  if (!checkValidArgs(rawData, parentEl)) {
    return;
  }

  const data = getFilteredTodos(rawData);

  let todoChksEls;

  let todoItems = data.map(function(item, index) {
    const todoItem = `
      <li class="todo-item show" data-id="${ item.id }">
        <span class="todo-item__number mr-1">${ index + 1 }</span>
        <input 
          class="todo-item__completed mr-1" 
          type="checkbox" 
          ${ item.completed ? 'checked' : '' }
        >
        <p class="todo-item__text mr-1${ item.completed ? ' todo-item__text_completed' : '' }">
          ${ item.text }
        </p>
        <button class="todo-item__delBtn">del</button>
      </li>
    `;
      
      return todoItem })
    .join('');
    
  parentEl.innerHTML = todoItems;

  todoChksEls = doc.querySelectorAll('.todo-item__completed');
  if (!todoChksEls.length) {
    console.warn('Todo checks not found !!!');
    return;
  }
  
  todoChksEls.forEach(function(chk) {
    chk.onchange = function() {
      const id = this.parentElement.dataset.id;
      const todo = data.find(function(item) {
        return item.id == id
      });

      if (!todo) {
        return;
      }

      todo.completed = !todo.completed;
      renderTodoList(todos, todoListEl);      
      saveLocalStorage();
    }
  });

  const delBtns = doc.querySelectorAll('.todo-item__delBtn');
  delBtns.forEach(function(delBtn) {
    delBtn.onclick = function() {
      const id = this.parentElement.dataset.id;
      const todoItemToRemove = this.parentElement;
      const indexToRemove = todos.findIndex(function(item) {
        return item.id == id;
      });      

      if (indexToRemove !== -1) {
        todos.splice(indexToRemove, 1);

        todoItemToRemove.classList.add('del');

        setTimeout(() => {
          todoItemToRemove.remove();
          saveLocalStorage();
        },500);
      }
    }
  });
}

function checkValidArgs(data, parentEl) {
  
  if (!parentEl) {
    console.warn('Parent Elemetn not found');
    return; 
  }
  if (!Array.isArray(data)) {
    console.warn('Arg data mast be Array');
    return;
  }

  return true;
}

function saveLocalStorage() {
  const jsonData = JSON.stringify(todos);
  localStorage.setItem('todos', jsonData);
  localStorage.setItem('id', lastId);

  console.log('Data saved:', todos);
  return todos;
}

function getLocalStorage() {
  const getData = localStorage.getItem('todos');
  const todosData = JSON.parse(getData);
  
  console.log('Data loaded:', todosData);
  return todosData;
}

function getIdFromLocalStorage() {
  const storedId = localStorage.getItem('id');
  return storedId ? parseInt(storedId) : null;
}















// Реалізоване видалення не через масив, ще один варіант **************


// delItem();

// function delItem() {
//   const delBtns = doc.querySelectorAll('.todo-item__delBtn');

//   delBtns.forEach(function(btn) {
//     btn.onclick = function() {
//       const listItem = this.closest('.todo-item');
      
//       if (listItem) {
//         listItem.remove();
//       }
//     };
//   });
// }






// btnDelAll.onclick = function(event) {
//   event.preventDefault();

//   todos = [];
//   renderTodoList(todos, todoListEl);

//   localStorage.clear('todos');
//   saveLocalStorage();
//   console.log('Data cleared:', todos);
//   // const arrItem = Array.from(todoListEl.children);
//   // arrItem.forEach(function(item) {
//   //   todoListEl.removeChild(item);
//   // });
//   // ------------------------------
//   // todoListEl.remove();
// }

// ------------------