function loadTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem('simple-study-tasks'));
    if (!Array.isArray(saved)) return [];
    return saved.filter(function (task) {
      return typeof task.title === 'string' && typeof task.subject === 'string' &&
        typeof task.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(task.date) &&
        ['High', 'Medium', 'Low'].includes(task.priority) && typeof task.id === 'number';
    });
  } catch {
    return [];
  }
}

function storeTasks(tasks) {
  try {
    localStorage.setItem('simple-study-tasks', JSON.stringify(tasks));
    return true;
  } catch {
    return false;
  }
}

function updateSummary(tasks) {
  const completed = tasks.filter(function (task) {
    return task.done;
  }).length;
  document.getElementById('total').textContent = tasks.length;
  document.getElementById('completed').textContent = completed;
  document.getElementById('pending').textContent = tasks.length - completed;
}

function addTaskDetails(container, task) {
  const item = document.createElement('article');
  item.className = task.done ? 'task done' : 'task';
  const title = document.createElement('h4');
  title.textContent = task.title;
  const details = document.createElement('p');
  details.textContent = task.subject + ' · ' + new Date(task.date + 'T00:00:00').toLocaleDateString() + ' · ' + task.priority + ' priority' + (task.done ? ' · Completed' : ' · To do');
  item.append(title, details);
  container.appendChild(item);
}
