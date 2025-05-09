import {
  firstDayOfMonth,
  daysInMonth,
  daysInWeekBeforeFirstMonthDay,
  isSameMonth,
  formattedDateString,
} from "./calendar.js";
import { createTodo, getTodos, saveTodos } from "./todos.js";

function App() {
  console.log("rendering page")

  // Represents the month being displayed
  const [date, setDate] = React.useState(new Date());
  const [todos, setTodos] = React.useState(getTodos());

  function addTodo(title, date) {
    createTodo(title, date);
    setTodos(getTodos());
  }

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
        <Header />
        <main className="p-4 bg-slate-200 w-full">
          <div className="current-month flex flex-row justify-around py-2">
            <Button handler={() => crementDate(-1)}>{"<"} prev </Button>
            <div >
              {date.toLocaleDateString("sv-SE", {month:"long", year:"numeric"})}
            </div>
            <Button handler={() => crementDate(1)}> next {">"}</Button>
          </div>

          <Calendar date={date} todos={todos} />
        </main>
      </div>
      <aside className="p-2 space-y-3 bg-slate-300 w-full sm:w-1/4 sm:-order-1">
        <AddTodoForm addTodo={addTodo} />
        <Todos todos={todos} />
      </aside>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

//Components
function Header() {
  const [now, setNow] = React.useState(new Date()); 

  React.useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    
    return () => clearInterval(interval); 
  }, []);

  return (
      <header className="bg-slate-500 py-2 w-full text-center text-slate-100 font-bold">
        {formattedDateString(now)}
      </header>
  )
}

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
  return <div className="calendar-day empty opacity-50"></div>;
}

function CalendarCell({ dateNumber, todoCount }) {
  return (
    <div className="calendar-day px-2 p-1/2">
      <div className="date-number text-slate-500">{dateNumber}</div>
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
      <ul className="space-y-2" id="todo-list">{todoElements}</ul>
    </>
  );
}

function Todo({ title, dateString, completed }) {
  return (
    <li className="list-disc ml-6">
      {title} - {dateString} {Boolean(completed) ? "klart!" : ""}
    </li>
  );
}

function Button({ handler, children }) {
  return ( <button 
    className="border bg-slate-400 border-slate-900 px-2 rounded"
    onClick={handler}>
      {children}
    </button>
  );
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
    <form className="flex flex-col" onSubmit={(e) => {e.preventDefault(); submit();} }>
      <label className="font-bold mb-2">Lägg till en todo:</label>
      <div className="flex flex-row w-full md: flex-col">
        <div className="flex flex-col flex-1 mb-2">
          <input type="text" name="title" placeholder="titel" value={title} required onChange={(e) => setTitle(e.target.value)}/>
          <input type="date" name="date" placeholder="2025-05-25" value={date} required  onChange={(e) => setDate(e.target.value)}/>
        </div>
        <button className="border bg-slate-400 border-slate-900 px-2 rounded" type="submit"> Lägg till </button>
      </div>
    </form>
  )
}

/*---todos end ----*/
