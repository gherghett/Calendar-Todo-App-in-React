import {
  firstDayOfMonth,
  daysInMonth,
  daysInWeekBeforeFirstMonthDay,
  isSameMonth,
  formattedDateString,
} from "./calendar.js";
import { createTodo, getTodos, saveTodos } from "./todos.js";

function App() {
  const [date, setDate] = React.useState(new Date());
  const [now, setNow] = React.useState(new Date());
  const [todos, setTodos] = React.useState(getTodos());

  function addTodo(title, date) {
    createTodo(title, date);
    setTodos(getTodos());
  }

  React.useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  function crementDate(dir) {
    if (dir > 0) dir = 1;
    if (dir < 0) dir = -1;
    let newDate = new Date(
      date.getFullYear(),
      date.getMonth() + dir,
      date.getDate()
    );
    setDate(newDate);
  }

  return (
    <div
      id="container"
      className="bg-slate-400 px-2 flex flex-col sm:flex-row lg:w-[1024px] lg:mx-auto"
    >
      <div className="w-full">
        <header className="bg-slate-500 w-full">
          {formattedDateString(now)}
        </header>
        <main className="px-2 bg-slate-200 w-full">
          <Button handler={() => crementDate(-1)}> prev </Button>
          <Button handler={() => crementDate(1)}> next </Button>

          <Calendar date={date} todos={todos} />
        </main>
      </div>
      <aside className="bg-slate-300 w-full sm:w-1/4 sm:-order-1">
        <AddTodoForm addTodo={addTodo} />
        <Todos todos={todos} />
      </aside>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

//Components

/*-------------Calendar---------------*/

function Calendar({ date, todos }) {
  const firstDay = firstDayOfMonth(date);
  const daysInThisMonth = daysInMonth(date.getFullYear(), date.getMonth());
  const emptyDays = daysInWeekBeforeFirstMonthDay(firstDay.getDay());

  todos = todos
    //todos only for the month we render
    .filter((todo) => {
      const fullDate = new Date(todo.date);
      return isSameMonth(fullDate, date);
    })
    //keep only info about what day it is in the month
    .map((todo) => 
      { return {day: new Date(todo.date).getDate()} }
  );
  
  const calendarDays = [];
  
  for (let i = 0; i < daysInThisMonth; i++) {
    const todosForDay = todos.filter((t) => t.day == i + 1).length;
    calendarDays.push(
      <CalendarCell key={i} dateNumber={i + 1} todoCount={todosForDay} />
    );
  }
  
  return (
    <div id="calendar" className="grid grid-cols-7 gap-2">
      <EmptyDays emptyDays={emptyDays} />
      {calendarDays}
    </div>
  );
}

function EmptyDays({ emptyDays }) {
  let days = [];

  for (let i = 0; i < emptyDays; i++) {
    days.push(<EmptyDay key={i} />);
  }

  return <>{days}</>;
}

function EmptyDay() {
  return <div className=" calendar-day empty"></div>;
}

function CalendarCell({ dateNumber, todoCount }) {
  return (
    <div className="calendar-day">
      <div className="date-number">{dateNumber}</div>
      {todoCount > 0 ? <div className="calendar-day-todo-count">{todoCount}</div> : ""}
    </div>
  );
}

/*  calendar end */

/*------------- Todos --------------------*/

function Todos({ todos }) {
  const todoElements = [];

  for (let i in todos) {
    todoElements.push(
      <Todo
        key={i}
        title={todos[i].title}
        dateString={todos[i].date}
        completed={todos[i].completed}
      />
    );
  }

  return (
    <>
      <h3>Todos:</h3>
      <ul id="todo-list">{todoElements}</ul>
    </>
  );
}

function Todo({ title, dateString, completed }) {
  return (
    <li>
      {title} - {dateString} {Boolean(completed) ? "klart!" : ""}
    </li>
  );
}

function Button({ handler, children }) {
  return <button onClick={handler}>{children}</button>;
}

function AddTodoForm({addTodo}) {
  const [title, setTitle] = React.useState('');
  const [date, setDate] = React.useState('');

  function submit() {
    addTodo(title, date);
    setDate("");
    setTitle("");
  }

  return (
    <form onSubmit={(e) => {e.preventDefault(); submit();} }>
      <label>Lägg till en todo</label>
      <input type="text" name="title" placeholder="titel" value={title} required onChange={(e) => setTitle(e.target.value)}/>
      <input type="date" name="date" placeholder="2025-05-25" value={date} required  onChange={(e) => setDate(e.target.value)}/>
      <button type="submit"> Lägg till </button>
    </form>
  )
}

/*---todos end ----*/
