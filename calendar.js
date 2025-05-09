// Js -------------------------------------

// Returns a formatted string like "Torsdag 1 maj 2025" (Swedish full date).
export function formattedDateString(date) {
  let dateString = date.toLocaleDateString("sv-SE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  return dateString[0].toUpperCase() + dateString.slice(1);
}

// Returns a new Date object set to the 1st day of the month of the given date.
export function firstDayOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

// Calculates how many days are in a specific month.
// Uses the trick: setting day to 0 returns the last day of the previous month.
export function daysInMonth(fullYear, month) {
  return new Date(fullYear, month + 1, 0).getDate();
}

// Converts JavaScript weekday indices (0 = Sunday) to start from Monday (0 = Monday).
// Useful for aligning calendars where the week begins on Monday.
function weekdayToStartingMonday(indexOfWeekday) {
  return (indexOfWeekday + 6) % 7;
}

// Returns the number of days before the given weekday in a Monday-starting week.
// For example, Monday → 0, Tuesday → 1, etc.
export function daysInWeekBeforeFirstMonthDay(weekday) {
  return weekdayToStartingMonday(weekday);
}

// ----- DOM Manipulation -----

// Adds a single day to the calendar.
// If `empty` is true, the day will be marked as a placeholder (used to fill gaps).
// If `inner` is provided, it will be shown as the content of the day (e.g., the date number).
function addDayToCalendar(empty = false, day = null, todos = null) {
  const cal = document.getElementById("calendar");
  let new_day = document.createElement("div");

  new_day.classList.add("calendar-day");
  new_day.setAttribute("data-cy", "calendar-cell");
  if (empty === true) {
    new_day.classList.add("empty");
  }
  if (day != null) {
    const calendar_cell_date = document.createElement("div");
    calendar_cell_date.setAttribute("data-cy", "calendar-cell-date");
    // console.log(day)
    calendar_cell_date.innerText = day.getDate();
    new_day.appendChild(calendar_cell_date);

    //elementet med data-cy="calendar-cell-todos"
    const todo_count = todos.filter((td) =>
      isSameDay(new Date(td.date), day)
    ).length;
    const calendar_cell_todos = document.createElement("div");
    calendar_cell_todos.setAttribute("data-cy", "calendar-cell-todos");
    if (todo_count > 0) {
      console.log(day + " count: ", todo_count);
      calendar_cell_todos.innerText = todo_count;
      new_day.appendChild(calendar_cell_todos);
    }
  }
  cal.append(new_day);
}

// Clears and redraws the calendar for the month of the given date.
// E.g., passing 2025-03-22 will draw the full calendar for March 2025.
function drawCalendarDays(date, getTodos) {
  document.getElementById("month").innerHTML = date.toLocaleDateString(
    "sv-EN",
    { year: "numeric", month: "long" }
  );
  document.getElementById("calendar").innerHTML = "";

  let day = firstDayOfMonth(date);
  const daysInThisMonth = daysInMonth(date.getFullYear(), date.getMonth());

  // Calculate and add placeholders for empty days before the 1st (to align weekdays).
  const emptyDays = daysInWeekBeforeFirstMonthDay(day.getDay());

  const weekday = day.toLocaleDateString("en-US", { weekday: "long" });
  console.log(
    `${date.getMonth()} has ${daysInThisMonth} days and starts with a ${weekday}, which is getDay() = ${day.getDay()}, or weekday index starting from Monday = ${weekdayToStartingMonday(
      day.getDay()
    )}`
  );

  for (let i = 0; i < emptyDays; i++) {
    addDayToCalendar(true);
  }
  const todos = getTodos();
  // Add calendar days for the current month.
  for (let i = 0; i < daysInThisMonth; i++) {
    addDayToCalendar(
      false,
      new Date(date.getFullYear(), date.getMonth(), i + 1),
      todos
    );
  }
}

// Initializes the calendar using the current date.
function initCalendar(getTodos) {
  let now = new Date();
  drawCalendarDays(now, getTodos);
}

function isSameDay(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export function isSameMonth(date1, date2) {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() 
    );
  }
