import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, HelpCircle, Trophy, CheckCircle, XCircle, Award, Download, ChevronRight, Code, AlertTriangle } from 'lucide-react';

// --- 題庫資料 (Python While Loop) ---
const QUESTION_BANK = {
  easy: [
    {
      id: 'e1',
      code: [
        { text: 'i = 1' },
        { text: 'while i < 4:' },
        { text: '    print(i)' },
        { text: '    ', isSlot: true, answer: 'i += 1' }
      ],
      options: ['i += 1', 'i -= 1', 'i = 0', 'break'],
      wrongFeedback: {
        'i -= 1': '小心！如果 i 越來越小 (1, 0, -1...)，它永遠都會小於 4，這會造成無限迴圈！',
        'i = 0': '如果把 i 設為 0，它永遠小於 4，程式會卡住變成無限迴圈。',
        'break': 'break 會直接強制結束迴圈，這樣只會印出 1，不會印出 2 和 3。'
      },
      output: '1\n2\n3',
      explanation: '我們需要讓 i 每次增加 1，這樣 i 最終會變成 4，條件 i < 4 才會變成 False 結束迴圈。'
    },
    {
      id: 'e2',
      code: [
        { text: 'count = 5' },
        // Fix: 使用 suffix 將冒號與方塊綁定在同一行，解決排版錯位問題
        { text: 'while ', isSlot: true, answer: 'count > 0', suffix: ':' }, 
        { text: '    print(count)' },
        { text: '    count -= 1' }
      ],
      options: ['count > 0', 'count < 5', 'count == 0', 'True'],
      wrongFeedback: {
        'count < 5': '初始值 count 是 5。5 並不小於 5，所以迴圈連一次都不會執行喔！',
        'count == 0': '初始值是 5，不等於 0，所以迴圈不會執行。',
        'True': 'While True 會變成無限迴圈，因為條件永遠成立，程式停不下來！'
      },
      output: '5\n4\n3\n2\n1',
      explanation: '我們希望倒數計時，所以只要 count 還大於 0 就繼續執行。'
    },
    {
      id: 'e3',
      code: [
        { text: 'x = 0' },
        { text: 'while x < 3:' },
        { text: '    ', isSlot: true, answer: 'print(x)' },
        { text: '    x += 1' }
      ],
      options: ['print(x)', 'input(x)', 'x--', 'pass'],
      wrongFeedback: {
        'input(x)': 'input() 是用來等待使用者輸入的，這會暫停程式，且不會自動印出數字。',
        'x--': 'Python 不支援 x-- 這種寫法喔！這是 C/Java/JS 的語法，Python 要寫 x -= 1。',
        'pass': 'pass 什麼都不做，所以這個迴圈只會增加 x 的值，螢幕上不會顯示任何東西。'
      },
      output: '0\n1\n2',
      explanation: '要在終端機顯示變數的值，必須使用 print() 函數。'
    }
  ],
  medium: [
    {
      id: 'm1',
      code: [
        { text: 'n = 0' },
        { text: 'while n < 5:' },
        { text: '    n += 1' },
        { text: '    if n == 3:' },
        { text: '        ', isSlot: true, answer: 'continue' },
        { text: '    print(n)' }
      ],
      options: ['continue', 'break', 'exit()', 'n = 5'],
      wrongFeedback: {
        'break': 'break 會直接終止整個迴圈，所以印出 1 和 2 之後程式就結束了，不會印出 4 和 5。',
        'exit()': 'exit() 會直接把整個 Python 程式關掉，這太暴力了！',
        'n = 5': '如果在這邊把 n 設為 5，雖然迴圈會結束，但邏輯不對，而且 3 不會被跳過而是被印出來(如果順序不同的話)。'
      },
      output: '1\n2\n4\n5',
      explanation: 'continue 指令會跳過「當次」迴圈剩下的程式碼，直接回到迴圈開頭進行下一次迭代。'
    },
    {
      id: 'm2',
      code: [
        { text: 'i = 1' },
        { text: 'while True:' },
        { text: '    print(i)' },
        { text: '    i += 1' },
        { text: '    if i > 3:' },
        { text: '        ', isSlot: true, answer: 'break' }
      ],
      options: ['break', 'stop', 'continue', 'return'],
      wrongFeedback: {
        'stop': 'Python 沒有 stop 這個關鍵字喔！',
        'continue': 'continue 會跳回迴圈開頭，導致 i 不斷增加但迴圈永遠不會停止 (無限迴圈)。',
        'return': 'return 只能用在函式 (def) 裡面，這裡只是普通的腳本，不能用 return。'
      },
      output: '1\n2\n3',
      explanation: 'While True 是無限迴圈的起手式，必須搭配 break 關鍵字在特定條件下跳出迴圈。'
    },
    {
      id: 'm3',
      code: [
        { text: 'total = 0' },
        { text: 'x = 1' },
        { text: 'while x <= 4:' },
        { text: '    ', isSlot: true, answer: 'total += x' },
        { text: '    x += 1' },
        { text: 'print(total)' }
      ],
      options: ['total += x', 'total = x', 'x += total', 'print(x)'],
      wrongFeedback: {
        'total = x': '這樣會把 total 的值「覆蓋」成 x，而不是累加。最後 total 只會等於最後一個 x 的值 (4)。',
        'x += total': '這是在增加 x 的值，而不是計算總和，會導致迴圈次數變少或邏輯錯誤。',
        'print(x)': '這只會印出數字，不會把數字加到 total 變數中。'
      },
      output: '10',
      explanation: '累加程式 (Accumulator) 需要將每次的變數值加到總和變數中：total = total + x。'
    }
  ],
  hard: [
    {
      id: 'h1',
      code: [
        { text: 'text = "Python"' },
        { text: 'i = 0' },
        // Fix: 將冒號整合
        { text: 'while ', isSlot: true, answer: 'i < len(text)', suffix: ':' },
        { text: '    print(text[i])' },
        { text: '    i += 2' }
      ],
      options: ['i < len(text)', 'i <= 10', 'text[i]', 'True'],
      wrongFeedback: {
        'i <= 10': '字串長度只有 6，如果 i 跑到 6, 8, 10，會發生 IndexError (索引超出範圍)。',
        'text[i]': '條件判斷必須是布林值或可判斷真假的值。雖然字串非空為 True，但這裡邏輯怪怪的，且會有索引錯誤風險。',
        'True': '如果是無限迴圈，當 i 超過字串長度時，text[i] 會讓程式崩潰 (IndexError)。'
      },
      output: 'P\nt\no',
      explanation: '我們要確保索引 i 不會超過字串長度 (len(text))，否則會報錯。'
    },
    {
      id: 'h2',
      code: [
        { text: 'a, b = 0, 1' },
        { text: 'while a < 10:' },
        { text: '    print(a)' },
        { text: '    ', isSlot: true, answer: 'a, b = b, a+b' }
      ],
      options: ['a, b = b, a+b', 'a = a + 1', 'b = a + b', 'a = b'],
      wrongFeedback: {
        'a = a + 1': '這是普通的遞增數列 (0, 1, 2...)，不是費氏數列。',
        'b = a + b': '費氏數列需要同時更新兩個數。如果只更新 b，a 的值沒有變或變動錯誤，無法產生正確序列。',
        'a = b': '這樣會遺失前一個數的值，導致無法計算下一個數 (需要前兩個數相加)。'
      },
      output: '0\n1\n1\n2\n3\n5\n8',
      explanation: '費氏數列：下一個數是前兩個數的總和。Python 支援多重賦值 (Tuple Unpacking) 可以同時更新 a 和 b。'
    },
    {
      id: 'h3',
      code: [
        { text: 'x = 5' },
        { text: 'while x > 0:' },
        { text: '    x -= 1' },
        { text: 'else:' },
        { text: '    ', isSlot: true, answer: 'print("Done")' }
      ],
      options: ['print("Done")', 'break', 'x = 5', 'continue'],
      wrongFeedback: {
        'break': 'break 通常用在迴圈內。如果在 else 裡寫 break 雖然語法上可能不報錯(視上下文)，但在這裡邏輯不通。',
        'x = 5': '迴圈剛結束，如果又把 x 設為 5，只是單純賦值，沒有輸出結果。',
        'continue': 'continue 只能在迴圈「內部」使用，不能用在 else 區塊中，會發生 SyntaxError。'
      },
      output: 'Done',
      explanation: 'Python 的 while 迴圈可以搭配 else。當迴圈「正常結束」(不是被 break 中斷) 時，會執行 else 區塊。'
    }
  ]
};

// --- 隨機選題函數 ---
const getRandomQuestions = (difficulty) => {
  const pool = QUESTION_BANK[difficulty];
  let selected = [];
  while (selected.length < 5) {
    const randomQ = pool[Math.floor(Math.random() * pool.length)];
    const qCopy = JSON.parse(JSON.stringify(randomQ));
    qCopy.currentSlotValue = null; 
    qCopy.shuffledOptions = [...qCopy.options].sort(() => Math.random() - 0.5);
    selected.push(qCopy);
  }
  return selected;
};

// --- 主組件 ---
export default function App() {
  const [gameState, setGameState] = useState('menu'); 
  const [difficulty, setDifficulty] = useState('easy');
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [hints, setHints] = useState(3);
  const [feedback, setFeedback] = useState(null); 
  const [userName, setUserName] = useState('');
  const [draggedItem, setDraggedItem] = useState(null);

  const startGame = (diff) => {
    setDifficulty(diff);
    setQuestions(getRandomQuestions(diff));
    setCurrentQIndex(0);
    setScore(0);
    setHints(3);
    setGameState('playing');
    setFeedback(null);
  };

  const handleSlotFill = (optionText) => {
    if (feedback && feedback.type === 'success') return; 

    const updatedQuestions = [...questions];
    const currentQ = updatedQuestions[currentQIndex];
    currentQ.currentSlotValue = optionText;
    setQuestions(updatedQuestions);
    
    if (feedback && feedback.type === 'error') {
        setFeedback(null);
    }
  };

  const checkAnswer = () => {
    const currentQ = questions[currentQIndex];
    const slot = currentQ.code.find(p => p.isSlot);
    const userAns = currentQ.currentSlotValue;
    
    if (userAns === slot.answer) {
      setFeedback({ 
          type: 'success', 
          msg: '執行成功！邏輯正確。', 
          output: currentQ.output 
      });
      setScore(prev => prev + 20);
    } else {
      const specificError = currentQ.wrongFeedback && currentQ.wrongFeedback[userAns];
      const errorMsg = specificError || '語法或邏輯錯誤，請再試一次！';
      
      setFeedback({ 
          type: 'error', 
          msg: '執行失敗',
          detail: errorMsg 
      });
    }
  };

  const nextQuestion = () => {
    if (currentQIndex < 4) {
      setCurrentQIndex(prev => prev + 1);
      setFeedback(null);
    } else {
      setGameState('finished');
    }
  };

  const useHint = () => {
    if (hints > 0 && (!feedback || feedback.type !== 'success')) {
      const currentQ = questions[currentQIndex];
      const correctAns = currentQ.code.find(p => p.isSlot).answer;
      handleSlotFill(correctAns);
      setHints(prev => prev - 1);
      setFeedback(null);
    }
  };

  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700 text-center">
          <Code className="w-16 h-16 mx-auto text-yellow-400 mb-4" />
          <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-blue-500">
            Python 迴圈大師
          </h1>
          <p className="text-slate-400 mb-8">填空挑戰：掌握 While 迴圈的奧義</p>
          
          <div className="space-y-4">
            <p className="text-sm text-slate-500 mb-2">請選擇難度開始：</p>
            {['easy', 'medium', 'hard'].map((diff) => (
              <button
                key={diff}
                onClick={() => startGame(diff)}
                className="w-full py-4 px-6 rounded-xl bg-slate-700 hover:bg-blue-600 transition-all duration-300 flex items-center justify-between group border border-slate-600 hover:border-blue-400"
              >
                <span className="capitalize font-semibold text-lg">
                  {diff === 'easy' ? '簡單 (新手)' : diff === 'medium' ? '中等 (熟練)' : '困難 (專家)'}
                </span>
                <Play className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'finished') {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700 text-center">
          <Trophy className={`w-20 h-20 mx-auto mb-6 ${score === 100 ? 'text-yellow-400 animate-bounce' : 'text-slate-500'}`} />
          <h2 className="text-3xl font-bold mb-2">挑戰完成！</h2>
          <div className="text-6xl font-black text-blue-400 mb-4">{score} <span className="text-2xl text-slate-500">/ 100</span></div>
          
          <p className="mb-8 text-slate-300">
            {score === 100 ? '太神了！完美的 Python 大師！' : '不錯的嘗試！再接再厲！'}
          </p>

          {score === 100 ? (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="輸入你的名字領取獎狀"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full p-3 rounded-lg bg-slate-900 border border-slate-600 focus:border-blue-500 focus:outline-none text-center"
              />
              <button
                onClick={() => {
                   if(userName.trim()) setGameState('certificate');
                }}
                disabled={!userName.trim()}
                className="w-full py-3 bg-yellow-500 text-slate-900 font-bold rounded-lg hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                領取榮譽證書
              </button>
            </div>
          ) : (
             <button
                onClick={() => setGameState('menu')}
                className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 transition"
              >
                返回主選單重試
              </button>
          )}
        </div>
      </div>
    );
  }

  if (gameState === 'certificate') {
    return <CertificateView userName={userName} score={score} onBack={() => setGameState('menu')} />;
  }

  const currentQ = questions[currentQIndex];
  const isCorrect = feedback?.type === 'success';

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col items-center p-4">
      <div className="w-full max-w-2xl flex justify-between items-center mb-6 bg-slate-800 p-4 rounded-xl border border-slate-700">
        <div className="flex items-center gap-4">
           <div className="flex flex-col">
             <span className="text-xs text-slate-400 uppercase tracking-wider">Score</span>
             <span className="text-2xl font-bold text-blue-400">{score}</span>
           </div>
           <div className="h-8 w-px bg-slate-700"></div>
           <div className="flex flex-col">
             <span className="text-xs text-slate-400 uppercase tracking-wider">Question</span>
             <span className="font-mono">{currentQIndex + 1}/5</span>
           </div>
        </div>
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full">
                <HelpCircle size={16} />
                <span className="text-sm font-bold">{hints}</span>
            </div>
            <button onClick={() => setGameState('menu')} className="p-2 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition">
                <XCircle size={20} />
            </button>
        </div>
      </div>

      <div className="w-full max-w-2xl bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-700 flex flex-col">
        
        {/* Code Editor */}
        <div className="bg-[#1e1e1e] p-6 font-mono text-lg overflow-x-auto border-b border-slate-700 relative">
            <div className="absolute top-2 right-2 text-xs text-slate-500">main.py</div>
            {currentQ.code.map((line, idx) => (
                <div key={idx} className="flex items-center py-1 whitespace-pre">
                    <span className="text-slate-600 w-8 select-none text-right mr-4">{idx + 1}</span>
                    
                    <span className="text-slate-300">{line.text}</span>

                    {line.isSlot && (
                        <div 
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                                e.preventDefault();
                                if(!isCorrect) handleSlotFill(draggedItem);
                            }}
                            onClick={() => {
                                if(!isCorrect) handleSlotFill(null);
                            }}
                            className={`
                                min-w-[120px] h-8 mx-1 px-3 rounded flex items-center justify-center border-2 border-dashed transition-all cursor-pointer inline-flex
                                ${isCorrect 
                                    ? 'border-green-500 bg-green-500/20 text-green-400' 
                                    : currentQ.currentSlotValue 
                                        ? feedback?.type === 'error'
                                            ? 'border-red-500 bg-red-500/20 text-red-300' 
                                            : 'border-blue-400 bg-blue-500/20 text-blue-300' 
                                        : 'border-slate-500 bg-slate-700/50 text-slate-400 hover:border-slate-400'
                                }
                            `}
                        >
                            {currentQ.currentSlotValue || "?"}
                        </div>
                    )}

                    {line.suffix && <span className="text-slate-300">{line.suffix}</span>}
                </div>
            ))}
        </div>

        {/* Controls & Options */}
        <div className="p-6 bg-slate-800">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 min-h-[3.5rem]">
                {feedback ? (
                    <div className={`flex flex-col gap-1 w-full md:w-auto p-3 rounded-lg ${feedback.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                        <div className="flex items-center gap-2">
                             {feedback.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
                             <span className="font-bold text-lg">{feedback.msg}</span>
                        </div>
                        {feedback.detail && (
                            <div className="text-sm opacity-90 pl-7">{feedback.detail}</div>
                        )}
                    </div>
                ) : (
                   <div className="text-slate-400 text-sm flex items-center h-full pt-2">
                       <span className="hidden md:inline">💡 </span> 
                       拖曳下方方塊至程式碼缺口處
                   </div>
                )}

                <div className="flex gap-2 self-end md:self-center shrink-0 mt-2 md:mt-0">
                    {!isCorrect && (
                        <>
                             <button 
                                onClick={useHint}
                                disabled={hints === 0}
                                className="px-4 py-2 text-sm bg-slate-700 hover:bg-slate-600 rounded-lg text-yellow-400 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                <HelpCircle size={16} /> 提示
                            </button>
                            <button 
                                onClick={checkAnswer}
                                disabled={!currentQ.currentSlotValue}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20 transition"
                            >
                                執行程式
                            </button>
                        </>
                    )}
                    {isCorrect && (
                         <button 
                            onClick={nextQuestion}
                            className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-green-900/20 transition animate-pulse"
                        >
                            下一題 <ChevronRight size={18} />
                        </button>
                    )}
                </div>
            </div>

            {!isCorrect && (
                <div className="flex flex-wrap gap-3 p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 min-h-[80px]">
                    {currentQ.shuffledOptions.map((opt, idx) => (
                        <div
                            key={`${currentQ.id}-opt-${idx}`}
                            draggable
                            onDragStart={() => setDraggedItem(opt)}
                            onClick={() => handleSlotFill(opt)}
                            className={`
                                px-4 py-2 rounded-lg font-mono text-sm cursor-grab active:cursor-grabbing border transition-all hover:scale-105 shadow-sm
                                ${currentQ.currentSlotValue === opt 
                                    ? 'bg-slate-700 border-slate-600 text-slate-500 opacity-50' 
                                    : 'bg-slate-700 border-slate-600 hover:bg-slate-600 text-blue-200 border-b-2 border-b-slate-900'
                                }
                            `}
                        >
                            {opt}
                        </div>
                    ))}
                </div>
            )}

            {isCorrect && (
                 <div className="mt-6 bg-black rounded-lg p-4 font-mono text-sm border border-slate-800">
                    <div className="flex items-center gap-2 mb-2 border-b border-slate-800 pb-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-slate-500 text-xs ml-2">Terminal Output</span>
                    </div>
                    <div className="text-green-400 whitespace-pre-wrap animate-fade-in">
                        {feedback.output}
                    </div>
                    <div className="mt-2 text-slate-500 text-xs pt-2 border-t border-slate-900">
                         Process finished with exit code 0
                    </div>
                 </div>
            )}
        </div>
        
        {isCorrect && (
             <div className="bg-green-900/20 p-4 border-t border-green-900/30 flex items-start gap-3">
                 <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={20} />
                 <div>
                     <h4 className="font-bold text-green-400 text-sm mb-1">邏輯解析</h4>
                     <p className="text-slate-300 text-sm leading-relaxed">{currentQ.explanation}</p>
                 </div>
             </div>
        )}
      </div>
    </div>
  );
}

function CertificateView({ userName, score, onBack }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Background
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, 800, 600);
    
    // Border
    ctx.lineWidth = 10;
    ctx.strokeStyle = '#DAA520';
    ctx.strokeRect(20, 20, 760, 560);
    ctx.lineWidth = 2;
    ctx.strokeRect(35, 35, 730, 530);

    // Corners
    ctx.fillStyle = '#DAA520';
    ctx.fillRect(20, 20, 50, 50);
    ctx.fillRect(730, 20, 50, 50);
    ctx.fillRect(20, 530, 50, 50);
    ctx.fillRect(730, 530, 50, 50);

    // Title
    ctx.font = 'bold 50px "Noto Sans TC", sans-serif'; 
    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';
    ctx.fillText('榮 譽 證 書', 400, 150);

    // Body
    ctx.font = '24px sans-serif';
    ctx.fillStyle = '#555';
    ctx.fillText('茲證明', 400, 240);

    ctx.font = 'bold 40px sans-serif';
    ctx.fillStyle = '#1e3a8a'; 
    ctx.fillText(userName, 400, 300);

    ctx.font = '24px sans-serif';
    ctx.fillStyle = '#555';
    ctx.fillText('成功通過 Python While 迴圈大師測驗', 400, 360);
    ctx.fillText('獲得滿分表現', 400, 400);

    // Score
    ctx.font = 'bold 60px sans-serif';
    ctx.fillStyle = '#DAA520';
    // Fix: 這裡實際使用 score 變數，解決 Unused Variable 的部署錯誤
    ctx.fillText(`${score} 分`, 400, 480);

    // Date
    const date = new Date().toLocaleDateString();
    ctx.font = '16px sans-serif';
    ctx.fillStyle = '#888';
    ctx.textAlign = 'right';
    ctx.fillText(`Date: ${date}`, 730, 530);

  }, [userName, score]); // Fix: 將 score 加入依賴陣列

  const downloadCertificate = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `Python_Master_Certificate_${userName}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
      <h2 className="text-2xl font-bold mb-4 text-yellow-400 flex items-center gap-2">
        <Award /> 您的證書已生成
      </h2>
      
      <div className="mb-6 shadow-2xl border-4 border-slate-700 rounded-lg overflow-hidden max-w-full">
         <canvas 
            ref={canvasRef} 
            width={800} 
            height={600} 
            className="w-full max-w-[600px] h-auto bg-white"
         />
      </div>

      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-bold flex items-center gap-2 transition"
        >
          <RotateCcw size={18} /> 返回
        </button>
        <button
          onClick={downloadCertificate}
          className="px-6 py-2 bg-yellow-500 hover:bg-yellow-400 text-slate-900 rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-yellow-500/20 transition"
        >
          <Download size={18} /> 下載證書
        </button>
      </div>
    </div>
  );
}
