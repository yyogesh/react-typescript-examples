import React, { useCallback, useEffect, useReducer, useRef } from 'react';
import './App.css';

const Heading = ({ title }: { title: string }) => <h2>{title}</h2>

const Box = ({ children }: { children: React.ReactNode }) => <div>{children}</div>

interface ListItem {
  items: string[],
  listClick?: (item: string) => void
}

const List: React.FunctionComponent<ListItem> = ({ items, listClick }) => {
  return <ul>
    {
      items.map((item, index) => <li onClick={() => listClick?.(item)} key={index}>{item}</li>)
    }
  </ul>
}

interface Payload {
  text: string;
}

interface Todo {
  id: number;
  done: boolean;
  text: string;
}

type ActionType =
  { type: 'ADD', text: string } |
  { type: 'REMOVE', id: number }

function App() {
  const handleListClick = useCallback((item: string) => {
    console.log(item)
  }, []);

  const [payload, setPayload] = React.useState<Payload | null>(null);

  useEffect(() => {
    fetch("/data.json")
      .then(resp => resp.json())
      .then(data => {
        console.log(data)
        setPayload(data)
      });
  }, []);


  const [todos, dispatch] = useReducer((state: Todo[], action: ActionType) => {
    switch (action.type) {
      case 'ADD':
        return [
          ...state,
          {
            id: state.length + 1,
            text: action.text,
            done: false
          }
        ]
      case "REMOVE":
        return state.filter(({ id }) => id !== action.id)
      default:
        throw new Error()
    }
  }, [])

  const newTodoRef = useRef<HTMLInputElement>(null);

  const addNewTodo = () => {
    if (newTodoRef.current) {
      dispatch({
        type: 'ADD',
        text: newTodoRef.current?.value,
      })
    }
  }

  return (
    <div className="App">
      <Heading title="introduction" />
      <Box>
        Hello there
      </Box>
      <List items={["one", "two"]} listClick={handleListClick} />
      <Box>{JSON.stringify(payload)}</Box>
      <Heading title="Todos" />
      {
        todos.map(({ id, text, done }) => (
          <div key={id}>
            {text}
            <button onClick={() => dispatch({
              type: 'REMOVE',
              id: id
            })}>Remove</button>
          </div>
        ))
      }
      <div>
        <input type="text" ref={newTodoRef} />
        <button onClick={addNewTodo}>Add</button>
      </div>
    </div>
  );
}

export default App;
