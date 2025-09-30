import { useState } from "react";

export function CustomerSearchPage() {
  const [counter, setCounter] = useState(0);

  const increment = () => {
    setCounter(counter + 1);
  };
  return (
    <div>
      Customer Search Page
      <div>Counter: {counter}</div>
      <button onClick={increment}>Increment</button>
    </div>
  );
}
