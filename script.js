const form = document.getElementById('task-form');
const titleInput = document.getElementById('title');
const subjectInput = document.getElementById('subject');
const dateInput = document.getElementById('date');
const priorityInput = document.getElementById('priority');
const taskList = document.getElementById('task-list');
const searchInput = document.getElementById('search');
const filterInput = document.getElementById('filter');
const message = document.getElementById('message');
const cancelButton = document.getElementById('cancel');
let tasks = loadTasks();
let editingId = null;

function saveTasks() {
  message.textContent = storeTasks(tasks) ? message.textContent : 'Storage is unavailable. Changes are temporary.';
  showTasks();
}

function resetForm() {
  form.reset();
  editingId = null;
  document.getElementById('form-title').textContent = 'Add a task';
  document.getElementById('save').textContent = 'Add task';
  cancelButton.hidden = true;
}

form.addEventListener('submit', function (event) {
  event.preventDefault();
  const title = titleInput.value.trim();
  const subject = subjectInput.value.trim();

  if (!title || !subject) {
    message.textContent = 'Please enter an assignment and subject.';
    return;
  }

  if (editingId === null) {
    tasks.push({
      id: Date.now(),
      title: title,
      subject: subject,
      date: dateInput.value,
      priority: priorityInput.value,
      done: false
    });
    message.textContent = 'Task added.';
  } else {
    const task = tasks.find(function (task) {
      return task.id === editingId;
    });
    task.title = title;
    task.subject = subject;
    task.date = dateInput.value;
    task.priority = priorityInput.value;
    message.textContent = 'Task updated.';
  }

  resetForm();
  saveTasks();
});

function createButton(text, className, action) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = text;
  button.className = className;
  button.addEventListener('click', action);
  return button;
}

function showTasks() {
  taskList.replaceChildren();
  let completed = 0;
  let shown = 0;
  const search = searchInput.value.toLowerCase().trim();
  const filter = filterInput.value;
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  tasks.sort(function (a, b) {
    return a.date.localeCompare(b.date);
  });

  tasks.forEach(function (task) {
    if (task.done) completed++;
    const matchesSearch = (task.title + ' ' + task.subject).toLowerCase().includes(search);
    const matchesFilter = filter === 'all' ||
      (filter === 'completed' && task.done) ||
      (filter === 'pending' && !task.done) ||
      (filter === 'overdue' && !task.done && new Date(task.date + 'T00:00:00') < now);
    const selectedPriority = document.getElementById('priority-filter').value;
    const matchesPriority = selectedPriority === 'all' || selectedPriority === task.priority;

    if (!matchesSearch || !matchesFilter || !matchesPriority) return;
    shown++;

    const item = document.createElement('article');
    item.className = task.done ? 'task done' : 'task';

    const heading = document.createElement('h4');
    heading.textContent = task.title;

    const details = document.createElement('p');
    const deadline = new Date(task.date + 'T00:00:00');
    details.textContent = task.subject + ' · Due ' + deadline.toLocaleDateString();
    if (!task.done && deadline < now) {
      details.textContent += ' · Overdue';
      details.className = 'overdue';
    }

    const priority = document.createElement('span');
    priority.className = 'badge ' + task.priority.toLowerCase();
    priority.textContent = task.priority + ' priority';

    const actions = document.createElement('div');
    actions.className = 'actions';
    actions.appendChild(createButton(task.done ? 'Undo' : 'Mark done', '', function () {
      task.done = !task.done;
      message.textContent = task.done ? 'Task completed.' : 'Task marked to do.';
      saveTasks();
    }));

    actions.appendChild(createButton('Edit', 'secondary', function () {
      editingId = task.id;
      titleInput.value = task.title;
      subjectInput.value = task.subject;
      dateInput.value = task.date;
      priorityInput.value = task.priority;
      document.getElementById('form-title').textContent = 'Edit task';
      document.getElementById('save').textContent = 'Save changes';
      cancelButton.hidden = false;
      titleInput.focus();
    }));

    actions.appendChild(createButton('Delete', 'delete', function () {
      if (confirm('Delete this task?')) {
        tasks = tasks.filter(function (savedTask) {
          return savedTask.id !== task.id;
        });
        if (editingId === task.id) resetForm();
        message.textContent = 'Task deleted.';
        saveTasks();
      }
    }));

    item.append(heading, priority, details, actions);
    taskList.appendChild(item);
  });

  document.getElementById('total').textContent = tasks.length;
  document.getElementById('completed').textContent = completed;
  document.getElementById('pending').textContent = tasks.length - completed;

  if (shown === 0) {
    const empty = document.createElement('p');
    empty.className = 'empty';
    empty.textContent = tasks.length === 0 ? 'No tasks yet. Add your first assignment.' : 'No matching tasks.';
    taskList.appendChild(empty);
  }
}

document.getElementById('priority-filter').addEventListener('change', showTasks);
cancelButton.addEventListener('click', resetForm);
searchInput.addEventListener('input', showTasks);
filterInput.addEventListener('change', showTasks);
showTasks();
