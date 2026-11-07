const tasks = loadTasks();
updateSummary(tasks);
const upcoming = document.getElementById('upcoming');
const openTasks = tasks.filter(function (task) {
  return !task.done;
});
openTasks.sort(function (a, b) {
  return a.date.localeCompare(b.date);
});
openTasks.slice(0, 3).forEach(function (task) {
  addTaskDetails(upcoming, task);
});
if (openTasks.length === 0) {
  upcoming.textContent = 'No open assignments. Add your next study task.';
}
