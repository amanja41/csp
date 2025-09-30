import { useState } from 'react';
import { TapestryButton } from '@avantfinco/tapestry';
import './CustomerSearchPage.css';

export function CustomerSearchPage() {
  const [counter, setCounter] = useState(0);

  const increment = () => {
    setCounter(counter + 1);
  };
  return (
    <div className="CustomerSearchPage">
      Customer Search Page
      <div>Counter: {counter}</div>
      <TapestryButton onClick={increment} label="Increment" />
    </div>
  );
}
