const tasks = loadTasks();
let month = new Date();
month = new Date(month.getFullYear(), month.getMonth(), 1);
let selectedDate = new Date();

function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function showDay() {
  document.getElementById('day-title').textContent = selectedDate.toLocaleDateString(undefined, {
    day: 'numeric', month: 'long', year: 'numeric'
  });
  const list = document.getElementById('day-tasks');
  list.replaceChildren();
  const dayTasks = tasks.filter(function (task) {
    return sameDay(new Date(task.date + 'T00:00:00'), selectedDate);
  });
  dayTasks.forEach(function (task) {
    addTaskDetails(list, task);
  });
  if (dayTasks.length === 0) list.textContent = 'No assignments due on this day.';
}

function showCalendar() {
  document.getElementById('month').textContent = month.toLocaleDateString(undefined, {
    month: 'long', year: 'numeric'
  });
  const grid = document.getElementById('calendar-grid');
  grid.replaceChildren();
  const firstDay = (month.getDay() + 6) % 7;
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    grid.appendChild(document.createElement('span'));
  }

  for (let day = 1; day <= days; day++) {
    const date = new Date(month.getFullYear(), month.getMonth(), day);
    const count = tasks.filter(function (task) {
      return sameDay(new Date(task.date + 'T00:00:00'), date);
    }).length;
    const button = document.createElement('button');
    button.textContent = day;
    button.setAttribute('aria-label', date.toLocaleDateString() + ', ' + count + ' tasks');
    button.setAttribute('aria-pressed', sameDay(date, selectedDate));
    if (sameDay(date, new Date())) button.classList.add('today');
    if (sameDay(date, selectedDate)) button.classList.add('selected');
    if (count > 0) {
      const marker = document.createElement('small');
      marker.textContent = count + (count === 1 ? ' task' : ' tasks');
      button.appendChild(marker);
    }
    button.addEventListener('click', function () {
      selectedDate = date;
      showCalendar();
      showDay();
    });
    grid.appendChild(button);
  }
}

document.getElementById('previous').addEventListener('click', function () {
  month = new Date(month.getFullYear(), month.getMonth() - 1, 1);
  showCalendar();
});
document.getElementById('next').addEventListener('click', function () {
  month = new Date(month.getFullYear(), month.getMonth() + 1, 1);
  showCalendar();
});
showCalendar();
showDay();
