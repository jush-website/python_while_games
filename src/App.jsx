import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, HelpCircle, Trophy, CheckCircle, XCircle, Award, Download, ChevronRight, Code, AlertTriangle, Loader2 } from 'lucide-react';

// --- 題庫資料 (Python While Loop) ---
const QUESTION_BANK = {
  easy: [
    {
      id: 'e1',
      // 題目：基礎計數器
      code: [
        { text: 'day = 1' },
        { text: 'while day <= 3:' },
        { text: '    print("Day", day)' },
        { text: '    ', isSlot: true, answer: 'day += 1' }
      ],
      options: ['day += 1', 'day = 1', 'break', 'continue'],
      wrongFeedback: {
        'day = 1': '如果每次都把 day 設回 1，day 永遠不會大於 3，會變成無限迴圈！',
        'break': 'break 會直接結束迴圈，這樣只會印出 Day 1 就停止了。',
        'continue': 'continue 會跳回迴圈開頭，導致 day 數值沒變，變成無限迴圈。'
      },
      output: 'Day 1\nDay 2\nDay 3',
      explanation: '最基礎的迴圈：記得要在迴圈內改變計數變數，否則會變成無限迴圈。'
    },
    {
      id: 'e2',
      // 題目：密碼輸入模擬 (條件判斷)
      code: [
        { text: 'secret = "1234"' },
        { text: 'guess = ""' },
        { text: 'while ', isSlot: true, answer: 'guess != secret', suffix: ':' }, 
        { text: '    guess = "1234"' }, // 模擬使用者輸入正確
        { text: '    print("Unlocked!")' }
      ],
      options: ['guess != secret', 'guess == secret', 'guess > secret', 'True'],
      wrongFeedback: {
        'guess == secret': '一開始 guess 是空的，跟 secret 不一樣，所以這個條件一開始就是 False，迴圈完全不會執行。',
        'True': '這樣會變成無限迴圈，除非裡面有 break，但這題的邏輯是「猜錯就繼續猜」。',
        'guess > secret': '字串比大小通常不是用來做密碼驗證的邏輯。'
      },
      output: 'Unlocked!',
      explanation: '這模擬了登入系統：只要「猜測不等於秘密」，就繼續要求輸入；一旦猜對，迴圈條件不成立，就會結束。'
    },
    {
      id: 'e3',
      // 題目：火箭倒數 (遞減)
      code: [
        { text: 't = 3' },
        { text: 'while t > 0:' },
        { text: '    print(t)' },
        { text: '    ', isSlot: true, answer: 't -= 1' }
      ],
      options: ['t -= 1', 't += 1', 't = 0', 'pass'],
      wrongFeedback: {
        't += 1': '如果 t 越來越大 (3, 4, 5...)，它永遠大於 0，火箭永遠發射不了(無限迴圈)！',
        't = 0': '這樣只會跑一次迴圈，雖然會停止，但就沒有倒數的效果了。',
        'pass': 'pass 什麼都不做，t 的值不會變，導致無限迴圈。'
      },
      output: '3\n2\n1',
      explanation: '倒數計時需要使用遞減 (t -= 1)，直到變數歸零為止。'
    }
  ],
  medium: [
    {
      id: 'm1',
      // 題目：處理購物車 (List Pop)
      code: [
        { text: 'cart = ["Apple", "Milk"]' },
        { text: 'while ', isSlot: true, answer: 'len(cart) > 0', suffix: ':' },
        { text: '    item = cart.pop()' },
        { text: '    print("Bought", item)' }
      ],
      options: ['len(cart) > 0', 'cart == []', 'item in cart', 'len(cart) < 2'],
      wrongFeedback: {
        'cart == []': '一開始購物車有東西，所以「等於空列表」是 False，迴圈不會執行。',
        'item in cart': 'item 變數在迴圈開始前還沒定義，這樣寫會報錯 (NameError)。',
        'len(cart) < 2': '這個條件邏輯相反了，我們是要在「還有東西」的時候執行。'
      },
      output: 'Bought Milk\nBought Apple',
      explanation: '這展示了如何用 while 迴圈處理清單：只要清單長度大於 0 (或寫 while cart:)，就不斷取出物品直到清空。'
    },
    {
      id: 'm2',
      // 題目：跳過奇數 (Continue & Modulo)
      code: [
        { text: 'n = 0' },
        { text: 'while n < 4:' },
        { text: '    n += 1' },
        { text: '    if n % 2 == 1:' },
        { text: '        ', isSlot: true, answer: 'continue' },
        { text: '    print(n)' }
      ],
      options: ['continue', 'break', 'pass', 'n -= 1'],
      wrongFeedback: {
        'break': 'break 會直接停止迴圈，遇到第一個奇數 1 就停了，什麼都不會印出來。',
        'pass': 'pass 會繼續往下執行，所以奇數也會被印出來 (1, 2, 3, 4)，不符合只印偶數的要求。',
        'n -= 1': '在迴圈裡把 n 減回去，加上前面的 n += 1，n 的值會卡住不變，變成無限迴圈。'
      },
      output: '2\n4',
      explanation: 'n % 2 == 1 代表是奇數。使用 continue 可以跳過本次迴圈剩下的 print 指令，只印出偶數。'
    },
    {
      id: 'm3',
      // 題目：存款目標 (累加與條件)
      code: [
        { text: 'money = 0' },
        { text: 'goal = 30' },
        { text: 'while ', isSlot: true, answer: 'money < goal', suffix: ':' },
        { text: '    money += 10' },
        { text: 'print("Rich!")' }
      ],
      options: ['money < goal', 'money > goal', 'money == goal', 'True'],
      wrongFeedback: {
        'money > goal': '一開始 0 不大於 30，條件為 False，迴圈不會執行，存不到錢。',
        'money == goal': '0 不等於 30，條件為 False，直接結束。',
        'True': '這會變成無限存款，永遠停不下來！'
      },
      output: 'Rich!',
      explanation: '這是典型的「達成目標前持續執行」。只要錢還沒存夠 (小於目標)，就繼續存錢。'
    }
  ],
  hard: [
    {
      id: 'h1',
      // 題目：計算階乘 (數學邏輯)
      code: [
        { text: 'n = 5' },
        { text: 'fact = 1' },
        { text: 'while n > 0:' },
        { text: '    ', isSlot: true, answer: 'fact *= n' },
        { text: '    n -= 1' }
      ],
      options: ['fact *= n', 'fact += n', 'n *= fact', 'fact = n'],
      wrongFeedback: {
        'fact += n': '這是累加 (Summation)，不是階乘 (Factorial)。階乘需要用乘法。',
        'n *= fact': '我們是要計算 fact，不是改變 n 的縮放方式。',
        'fact = n': '這樣會覆蓋掉 fact 之前累積的值，最後結果只會等於 1。'
      },
      output: '120', // 5*4*3*2*1
      explanation: '階乘 (Factorial) 是連乘積。fact *= n 等同於 fact = fact * n，這是累積乘積的標準寫法。'
    },
    {
      id: 'h2',
      // 題目：Collatz 猜想 (複雜條件)
      code: [
        { text: 'n = 6' },
        { text: 'while ', isSlot: true, answer: 'n != 1', suffix: ':' },
        { text: '    if n % 2 == 0:' },
        { text: '        n = n // 2' },
        { text: '    else:' },
        { text: '        n = 3 * n + 1' }
      ],
      options: ['n != 1', 'n > 10', 'n == 1', 'n % 2 == 0'],
      wrongFeedback: {
        'n > 10': '6 不大於 10，迴圈連一次都不會跑。',
        'n == 1': '6 不等於 1，條件為 False，直接結束。',
        'n % 2 == 0': '這只能保證 n 是偶數時執行，但 Collatz 猜想過程中 n 會變成奇數，這時迴圈就會意外中斷。'
      },
      output: '(Loops until n is 1)',
      explanation: 'Collatz 猜想：如果是偶數除以 2，奇數乘 3 加 1，最終都會回到 1。所以迴圈條件是「只要不等於 1 就繼續」。'
    },
    {
      id: 'h3',
      // 題目：反轉字串 (索引操作)
      code: [
        { text: 's = "ABC"' },
        { text: 'i = len(s) - 1' }, // Index starts at 2
        { text: 'while i >= 0:' },
        { text: '    print(s[i])' },
        { text: '    ', isSlot: true, answer: 'i -= 1' }
      ],
      options: ['i -= 1', 'i += 1', 'i = 0', 'break'],
      wrongFeedback: {
        'i += 1': 'i 會變大 (2, 3, 4...)，超過字串長度會發生 IndexError (索引錯誤)！',
        'i = 0': '這會造成死循環，而且邏輯上無法遍歷前面的字元。',
        'break': '印出最後一個字元 "C" 後就結束了，無法印出 "B" 和 "A"。'
      },
      output: 'C\nB\nA',
      explanation: '我們要從字串尾端往前讀取，所以索引變數 i 必須每次遞減，直到小於 0 為止。'
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
  const [isTailwindLoaded, setIsTailwindLoaded] = useState(false);

  // --- Style Injection with FORCED 2-Second Loading State ---
  useEffect(() => {
    // 記錄開始載入的時間
    const startTime = Date.now();
    const minLoadTime = 2000; // 最小載入時間：2秒

    // 定義完成載入的處理函式
    const finishLoading = () => {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadTime - elapsedTime);
      
      // 無論腳本載入多快，都至少等待 remainingTime，湊滿 2 秒
      setTimeout(() => {
        setIsTailwindLoaded(true);
      }, remainingTime);
    };

    if (window.tailwind) {
      finishLoading();
      return;
    }

    const scriptId = 'tailwind-cdn';
    let script = document.getElementById(scriptId);

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = "https://cdn.tailwindcss.com";
      script.async = true;
      document.head.appendChild(script);
    }

    script.addEventListener('load', finishLoading);

    return () => {
      script.removeEventListener('load', finishLoading);
    };
  }, []);

  // 自定義樣式 (字體、動畫)
  const customStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;700&display=swap');
    
    body {
      font-family: 'Noto Sans TC', sans-serif;
      background-color: #0f172a; 
      color: white;
      margin: 0;
    }
    
    @keyframes fade-in {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
      animation: fade-in 0.5s ease-out forwards;
    }
  `;

  // --- 遊戲邏輯函數 ---
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

  // --- 載入畫面 (防止白畫面閃爍) ---
  if (!isTailwindLoaded) {
    return (
      <div style={{
        backgroundColor: '#0f172a',
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontFamily: 'sans-serif'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Loader2 style={{ animation: 'spin 1s linear infinite' }} />
          <span>載入資源中...</span>
        </div>
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // --- 渲染內容選擇器 ---
  const renderContent = () => {
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

    // gameState === 'playing'
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
  };

  return (
    <>
      <style>{customStyles}</style>
      {renderContent()}
    </>
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
    ctx.font = 'bold 50px "Noto Sans TC", "Microsoft JhengHei", sans-serif'; 
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
    ctx.fillText(`${score} 分`, 400, 480);

    // Date
    const date = new Date().toLocaleDateString();
    ctx.font = '16px sans-serif';
    ctx.fillStyle = '#888';
    ctx.textAlign = 'right';
    ctx.fillText(`Date: ${date}`, 730, 530);

  }, [userName, score]);

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
