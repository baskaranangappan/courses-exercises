import { useReducer, useEffect, useState } from "react";
import Todo from "./Todo";

type Action = { type: string; payload?: any };
type AddTodoAction = Action & { type: "addTodo"; payload: string };
type ToggleTodoAction = Action & { type: "toggleTodo"; payload: number };
type DeleteTodoAction = Action & { type: "deleteTodo"; payload: number };
type SetTodosAction = Action & { type: "setTodos"; payload: Array<Todo> };
type TodoAction =
  | AddTodoAction
  | ToggleTodoAction
  | DeleteTodoAction
  | SetTodosAction;

// process synchronous actions
const todosReducer = (todos: Array<Todo>, action: TodoAction) => {
  switch (action.type) {
    case "addTodo":
      let newId = 1;
      for (let todo of todos) {
        newId = Math.max(todo.id + 1, newId);
      }
      return [...todos, { id: newId, title: action.payload, completed: false }];
    case "toggleTodo":
      return todos.map(todo =>
        todo.id === action.payload
          ? { ...todo, completed: !todo.completed }
          : todo
      );
    case "deleteTodo":
      return todos.filter(todo => todo.id !== action.payload);
    case "setTodos":
      return action.payload;
    default:
      return todos;
  }
};

type ApiTodo = {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
};

const useTodos = () => {
  const [todos, todosDispatch] = useReducer(todosReducer, []);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (isLoading) {
      fetch("https://jsonplaceholder.typicode.com/todos")
        .then(res => res.json())
        .then((apiTodos: Array<ApiTodo>) => {
          const todos = apiTodos.map(apiTodo => ({
            id: apiTodo.id,
            title: apiTodo.title,
            completed: apiTodo.completed
          }));
          todosDispatch({ type: "setTodos", payload: todos });
          setIsLoading(false);
        });
    }
  }, [isLoading]);

  return {
    todos: todos,
    isLoading: isLoading,
    loadFromApi: () => setIsLoading(true),
    addTodo: (title: string) =>
      todosDispatch({ type: "addTodo", payload: title }),
    deleteTodo: (id: number) =>
      todosDispatch({ type: "deleteTodo", payload: id }),
    toggleTodo: (id: number) =>
      todosDispatch({ type: "toggleTodo", payload: id })
  };
};

export default useTodos;
