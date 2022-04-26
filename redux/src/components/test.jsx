import React from "react";
import { memo } from "react";
import { useState } from "react";

const Test1 = () => {
  console.log("Test1 render");
  const [num, setNum] = useState(0);
  return (
    <div>
      <Test1Child />
      <button onClick={() => setNum(num + 1)}>Test1 {num}</button>
    </div>
  );
};
const Test2 = () => {
  console.log("Test2 render");
  const [num, setNum] = useState(0);
  return <button onClick={() => setNum(num + 1)}>Test2 {num}</button>;
};
const Test1Child = memo(() => {
  console.log("Test1Child render");
  const [num, setNum] = useState(0);
  return <button onClick={() => setNum(num + 1)}>Test1Child {num}</button>;
});

export { Test1, Test2 };
