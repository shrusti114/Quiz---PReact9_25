const bcaSubjects = {
  "JavaScript": [
    { question: "Which type of JavaScript language is?", options: ["Object-Oriented","Object-Based","Assembly-language","High-level"], answer: "Object-Based" },
    { question: "Which company developed JavaScript?", options: ["Netscape","Bell Labs","Sun Microsystems","IBM"], answer: "Netscape" },
    { question: "Inside which HTML element do we put the JavaScript?", options: ["<script>","<js>","<javascript>","<code>"], answer: "<script>" },
    { question: "Which symbol is used for comments in JavaScript?", options: ["//","/* */","#","<!-- -->"], answer: "//" },
    { question: "Which method is used to parse a string to Int in JavaScript?", options: ["parseInt()","parse()","toInteger()","Number()"], answer: "parseInt()" },
    { question: "Which keyword is used to declare variables in JavaScript?", options: ["var","int","float","String"], answer: "var" },
    { question: "How do you write 'Hello World' in an alert box?", options: ["msgBox('Hello World');","alertBox('Hello World');","alert('Hello World');","msg('Hello World');"], answer: "alert('Hello World');" },
    { question: "Which operator is used to assign a value to a variable?", options: ["*","-","=","x"], answer: "=" },
    { question: "Which function is used to join two arrays in JavaScript?", options: ["concat()","join()","merge()","combine()"], answer: "concat()" },
    { question: "Which object is the top of the hierarchy in JavaScript?", options: ["Window","Document","Element","Array"], answer: "Window" },
    { question: "Which method is used to round a number in JavaScript?", options: ["Math.floor()","Math.round()","Math.ceil()","Math.random()"], answer: "Math.round()" },
    { question: "Which loop is guaranteed to run at least once?", options: ["for loop","while loop","do-while loop","for-in loop"], answer: "do-while loop" },
    { question: "How to declare a constant in JavaScript?", options: ["let","const","var","constant"], answer: "const" },
    { question: "Which built-in method returns the length of the string?", options: ["size()","length()","index()","count()"], answer: "length()" },
    { question: "Which function is used to print to the console?", options: ["console.write()","console.log()","print()","log.console()"], answer: "console.log()" },
  ],
  
  "React.js": [
    { question: "Who developed React.js?", options: ["Google","Facebook","Microsoft","Twitter"], answer: "Facebook" },
    { question: "What is the command to create a new React app?", options: ["npm create-react-app","npx create-react-app","react-new-app","npx react-app"], answer: "npx create-react-app" },
    { question: "Everything in React is a ______?", options: ["Module","Component","Class","Package"], answer: "Component" },
    { question: "In React, data flows in ______ direction?", options: ["One-way","Two-way","Both","Circular"], answer: "One-way" },
    { question: "What is JSX?", options: ["Java Syntax Extension","JavaScript XML","JSON Extension","None"], answer: "JavaScript XML" },
    { question: "Which hook is used for state management in functional components?", options: ["useEffect","useState","useContext","useReducer"], answer: "useState" },
    { question: "Which hook is used for side effects in React?", options: ["useEffect","useState","useRef","useMemo"], answer: "useEffect" },
    { question: "What is the default port for React apps?", options: ["3000","5000","8000","8080"], answer: "3000" },
    { question: "Which method is used to render React elements to the DOM?", options: ["ReactDOM.start()","ReactDOM.render()","renderReact()","startReact()"], answer: "ReactDOM.render()" },
    { question: "Which command is used to start the development server?", options: ["npm run dev","npm run start","npm serve","npm react-start"], answer: "npm run start" },
    { question: "How do you pass data from parent to child component?", options: ["State","Props","Functions","Events"], answer: "Props" },
    { question: "What is used to handle multiple elements in React without extra nodes?", options: ["<span>","<div>","<Fragment>","<section>"], answer: "<Fragment>" },
    { question: "Which hook gives you access to lifecycle methods?", options: ["useEffect","useState","useRef","useMemo"], answer: "useEffect" },
    { question: "Which method is used to update state in class components?", options: ["setData()","setState()","updateState()","this.state()"], answer: "setState()" },
    { question: "What is Virtual DOM?", options: ["Direct copy of real DOM","Lightweight copy of real DOM in memory","Database object","None of these"], answer: "Lightweight copy of real DOM in memory" },
  ],
};

export default bcaSubjects;
