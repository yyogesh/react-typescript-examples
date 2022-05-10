import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import './App.css';

const Heading = ({ title }: { title: string }) => <h2>{title}</h2>

const Box = ({ children }: { children: React.ReactNode }) => <div>{children}</div>

const useNumber = (initialValue: number) => useState<number>(initialValue);

type UseNumberValue = ReturnType<typeof useNumber>[0]
type UseNumberSetValue = ReturnType<typeof useNumber>[1]

const Button: React.FunctionComponent<
  React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & { title?: string }> = ({ title, children, style, ...rest }) => (
    <button {...rest} style={{ ...style, backgroundColor: "green", color: 'white', fontSize: 'large' }}>{title ?? children}</button>
  )

const Increment: React.FunctionComponent<{
  value: UseNumberValue,
  setValue: UseNumberSetValue
}> = ({ value, setValue }) => {
  return <Button onClick={() => setValue(value + 1)} title={`Add - ${value}`}></Button>
}



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

  const [value, setValue] = useNumber(0);

  return (
    <div className="App">
      <Heading title="introduction" />
      <Box>
        Hello there
      </Box>
      <List items={["one", "two"]} listClick={handleListClick} />
      <Box>{JSON.stringify(payload)}</Box>
      <Increment value={value} setValue={setValue} />
      <Heading title="Todos" />
      {
        todos.map(({ id, text, done }) => (
          <div key={id}>
            {text}
            <Button onClick={() => dispatch({
              type: 'REMOVE',
              id: id
            })}>Remove</Button>
          </div>
        ))
      }
      <div>
        <input type="text" ref={newTodoRef} />
        <Button onClick={addNewTodo}>Add</Button>
      </div>
    </div>
  );
}

export default App;
