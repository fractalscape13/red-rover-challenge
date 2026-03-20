import "./App.css";
import { useState, type ReactNode } from "react";

const defaultString =
  "(id, name, email, type(id, name, customFields(c1, c2, c3)), externalId)";

type NestedItem = { [key: string]: (string | NestedItem)[] };
type DataItem = string | NestedItem;

function App() {
  const [input, setInput] = useState<string>(defaultString);
  const [dataArray, setDataArray] = useState<DataItem[]>([]);

  const parseInput = (inputString: string) => {
    let workingString = inputString.trim();
    if (workingString.startsWith("(") && workingString.endsWith(")")) {
      workingString = workingString.slice(1, -1);
    }

    const finalArray: DataItem[] = [];
    const workingArray: string[] = [];

    let currentString = "";
    let parenDepth = 0;

    for (let i = 0; i < workingString.length; i++) {
      const char = workingString[i];
      if (char === "(") parenDepth++;
      if (char === ")") parenDepth--;
      if (char === "," && parenDepth === 0) {
        workingArray.push(currentString.trim());
        currentString = "";
      } else {
        currentString += char;
      }
    }
    if (currentString) workingArray.push(currentString.trim());

    for (let j = 0; j < workingArray.length; j++) {
      const arrayItem = workingArray[j];
      if (arrayItem.includes("(")) {
        const parenIndex = arrayItem.indexOf("(");
        const keyWord = arrayItem.slice(0, parenIndex);
        const values = arrayItem.slice(parenIndex + 1, -1);
        finalArray.push({ [keyWord]: parseInput(values) });
      } else {
        finalArray.push(arrayItem);
      }
    }
    return finalArray;
  };

  const clickHandler = () => {
    const result = parseInput(input);
    setDataArray(result);
  };

  const renderItem = (
    itemsArray: DataItem[],
    depth = 0,
    shouldAlphabetize = false,
  ): ReactNode => {
    let items = itemsArray;
    if (shouldAlphabetize) {
      items = itemsArray.toSorted((a, b) => {
        const keyA = typeof a === "string" ? a : Object.keys(a)[0];
        const keyB = typeof b === "string" ? b : Object.keys(b)[0];
        return keyA.localeCompare(keyB);
      });
    }
    return items.map((item, i) => {
      if (typeof item === "string") {
        return (
          <p className="text" style={{ marginLeft: depth * 20 }} key={i}>
            - {item}
          </p>
        );
      } else {
        const key = Object.keys(item)[0];
        return (
          <div key={i}>
            <p className="text" style={{ marginLeft: depth * 20 }}>
              - {key}
            </p>
            {renderItem(item[key], depth + 1, shouldAlphabetize)}
          </div>
        );
      }
    });
  };

  return (
    <div className="body">
      <div>
        <div className="input-section">
          <p className="text">Input string:</p>
          <input
            className="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button className="button" onClick={clickHandler}>
            Submit
          </button>
        </div>
        {dataArray.length > 0 ? (
          <>
            <div className="section">
              <p className="text">Output (original order):</p>
              <div className="output">{renderItem(dataArray, 0, false)}</div>
            </div>
            <div className="section">
              <p className="text">Output (alphabetical order):</p>
              <div className="output">{renderItem(dataArray, 0, true)}</div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default App;
