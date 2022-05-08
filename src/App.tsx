import React, { useCallback } from 'react';
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

function App() {
  const handleListClick = useCallback((item: string) => {
    console.log(item)
  }, [])
  return (
    <div className="App">
      <Heading title="introduction" />
      <Box>
        Hello there
      </Box>
      <List items={["one", "two"]} listClick={handleListClick} />
    </div>
  );
}

export default App;
