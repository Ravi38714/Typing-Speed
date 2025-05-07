
import { useEffect, useRef, useState } from 'react'
import './App.css'

const sentences = [
  "Coding bhut achi hoti h.",
  "hum bhut jayada ache h",
  "react ek bhut he achi library h",
  "Typing fast is a useful skill."
]
function App() {
  const [text, setText] = useState("");
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [result, setResult] = useState(null);
  const [resultHistory, setResultHistory] = useState([]);
  const [timer, setTimer] = useState(60);
  const inputRef = useRef(null);

  useEffect(() => {
    resetTest();
  }, []);

  useEffect(() => {
    let interval;
    if (startTime && !endTime && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    if (timer === 0 && !result) {
      calculateResult(startTime, new Date(), true);
    }
    return () => clearInterval(interval);
  }, [startTime, timer, endTime, result])

  const resetTest = () => {
    const random = sentences[Math.floor(Math.random() * sentences.length)];
    setText(random);
    setInput("");
    setStartTime(null);
    setEndTime(null);
    setResult(null);
    setTimer(60);
    inputRef.current.focus();
  }
  const handleChange = (e) => {
    const val = e.target.value;
    setInput(val);

    if (!startTime && val.length > 0) {
      const now = new Date();
      setStartTime(now);
    }
    if (val === text) {
      const end = new Date();
      setEndTime(end);
      calculateResult(startTime, end)
    }
  }

  const calculateResult = (start, end, isTimeout = false) => {
    const timeTaken = (end - start) / 1000;
    const words = text.trim().split(" ").length;
    const speed = Math.round((words / timeTaken) * 60);
    const correctChars = input.split("").filter((ch, i) => ch === text[i]).length;
    const accuracy = Math.round((correctChars / text.length) * 100);

    const res = {
      speed: isTimeout ? 0 : speed,
      accuracy,
      time: isTimeout ? 60 : timeTaken.toFixed(2),
    };

    setResult(res);
    setResultHistory((prev) => [res, ...prev]);
  };

  const getHighlightedText = () => {
    return text.split("").map((char, idx) => {
      let typedChar = input[idx];
      let className = "";
      if (typedChar === undefined) className = "";
      else if (typedChar === char) className = "correct";
      else className = "incorrect";

      return (
        <span key={idx} className={className}>{char}</span>
      );
    });
  };

  return (
   <>
  
 <h1> 💻 Typing Speed Tester</h1>
    <div className='container'>
      
      <p className='timer'>Time Left : {timer}s</p>

      <div className='box'>
        <p className='quote'>
          {getHighlightedText()}
        </p>
        <textarea ref={inputRef} className='input' placeholder='Start typing here...' value={input} onChange={handleChange} disabled={result || timer === 0} />
        {result ? (
          <div className='result'>
            <p>Speed : {result.speed} WPM</p>
            <p>Accuracy : {result.accuracy}%</p>
            <p>Time Taken : {result.time} seconds</p>
            <button onClick={resetTest}>Try Again</button>
          </div>
        ) : (
          <p className='instruction'> Type the above sentence to test your speed.</p>
        )}
      </div>

      {resultHistory.length > 0 && (
        <div className='History'>
          <h3>Past Result</h3>
          <ul>
            {resultHistory.map((r,i)=>(
              <li key={i}>
                <b>{i+1}.</b> Speed : {r.speed} WPM | Accuracy : {r.accuracy}% | Time : {r.time}s
              </li>
            ))}
          </ul>
        </div>
      )} 
    </div>
    </>
  )
}

export default App
