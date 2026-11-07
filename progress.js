const tasks = loadTasks();
updateSummary(tasks);
const completed = tasks.filter(function (task) {
  return task.done;
}).length;
const percentage = tasks.length === 0 ? 0 : Math.round(completed / tasks.length * 100);
document.getElementById('progress-bar').value = percentage;
document.getElementById('progress-text').textContent = percentage + '% complete · ' + completed + ' of ' + tasks.length + ' tasks finished';

const subjects = [];
tasks.forEach(function (task) {
  if (!subjects.includes(task.subject)) subjects.push(task.subject);
});
const subjectList = document.getElementById('subject-progress');
subjects.forEach(function (subject) {
  const subjectTasks = tasks.filter(function (task) {
    return task.subject === subject;
  });
  const finished = subjectTasks.filter(function (task) {
    return task.done;
  }).length;
  const row = document.createElement('p');
  row.textContent = subject + ': ' + finished + ' of ' + subjectTasks.length + ' completed';
  subjectList.appendChild(row);
});
if (subjects.length === 0) subjectList.textContent = 'Add an assignment to see subject progress.';

const today = new Date();
today.setHours(0, 0, 0, 0);
const nextWeek = new Date(today);
nextWeek.setDate(nextWeek.getDate() + 7);
let overdue = 0;
let upcoming = 0;
tasks.forEach(function (task) {
  const date = new Date(task.date + 'T00:00:00');
  if (!task.done && date < today) overdue++;
  if (!task.done && date >= today && date <= nextWeek) upcoming++;
});
document.getElementById('deadline-summary').textContent = overdue + ' overdue assignments. ' + upcoming + ' assignments due between today and seven days from now.';
