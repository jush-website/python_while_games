import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, HelpCircle, Trophy, CheckCircle, XCircle, Award, Download, ChevronRight, Code, AlertTriangle, Loader2, Lock } from 'lucide-react';

// --- 題庫資料 (Python While Loop) ---
// 每個難度 15 題，包含 if, 巢狀 if, 以及各種 while 應用
const QUESTION_BANK = {
  easy: [
    // 1-5: 基礎計數與累加
    {
      id: 'e1',
      code: [{text: 'i = 1'}, {text: 'while i <= 3:'}, {text: '    print(i)'}, {text: '    ', isSlot: true, answer: 'i += 1'}],
      options: ['i += 1', 'i = 1', 'break', 'i -= 1'],
      output: '1\n2\n3',
      explanation: '基礎迴圈：記得增加計數器避免死迴圈。'
    },
    {
      id: 'e2',
      code: [{text: 'x = 5'}, {text: 'while x > 0:'}, {text: '    print(x)'}, {text: '    ', isSlot: true, answer: 'x -= 1'}],
      options: ['x -= 1', 'x += 1', 'x = 0', 'pass'],
      output: '5\n4\n3\n2\n1',
      explanation: '倒數計時：每次將變數減 1。'
    },
    {
      id: 'e3',
      code: [{text: 'total = 0'}, {text: 'n = 1'}, {text: 'while n <= 3:'}, {text: '    ', isSlot: true, answer: 'total += n'}, {text: '    n += 1'}],
      options: ['total += n', 'total = n', 'n += total', 'print(n)'],
      output: '(total becomes 6)',
      explanation: '累加器：將 n 的值加入 total 中。'
    },
    {
      id: 'e4',
      code: [{text: 'msg = ""'}, {text: 'while len(msg) < 3:'}, {text: '    ', isSlot: true, answer: 'msg += "a"'}, {text: 'print(msg)'}],
      options: ['msg += "a"', 'msg = "a"', 'msg + "a"', 'break'],
      output: 'aaa',
      explanation: '字串串接：在迴圈中讓字串變長。'
    },
    {
      id: 'e5',
      code: [{text: 'x = 0'}, {text: 'while x < 5:'}, {text: '    x += 2'}, {text: '    ', isSlot: true, answer: 'print(x)'}],
      options: ['print(x)', 'print(i)', 'x -= 1', 'continue'],
      output: '2\n4\n6',
      explanation: '在迴圈內部變更變數後印出。'
    },
    // 6-10: 簡單條件與 break
    {
      id: 'e6',
      code: [{text: 'n = 1'}, {text: 'while True:'}, {text: '    if n == 3:'}, {text: '        ', isSlot: true, answer: 'break'}, {text: '    n += 1'}],
      options: ['break', 'continue', 'stop', 'exit'],
      output: '(Loop stops)',
      explanation: '使用 break 跳出無限迴圈 (While True)。'
    },
    {
      id: 'e7',
      code: [{text: 'pw = ""'}, {text: 'while pw != "123":'}, {text: '    ', isSlot: true, answer: 'pw = input()'}],
      options: ['pw = input()', 'print(pw)', 'pw == "123"', 'break'],
      output: '(Waits for input)',
      explanation: '模擬輸入密碼，直到輸入正確為止。'
    },
    {
      id: 'e8',
      code: [{text: 'i = 0'}, {text: 'while i < 5:'}, {text: '    i += 1'}, {text: '    if i == 3:'}, {text: '        ', isSlot: true, answer: 'continue'}, {text: '    print(i)'}],
      options: ['continue', 'break', 'pass', 'return'],
      output: '1\n2\n4\n5',
      explanation: 'continue 會跳過本次迴圈剩餘程式碼 (不印出 3)。'
    },
    {
      id: 'e9',
      code: [{text: 'hp = 100'}, {text: 'while hp > 0:'}, {text: '    print("Alive")'}, {text: '    ', isSlot: true, answer: 'hp -= 50'}],
      options: ['hp -= 50', 'hp += 10', 'hp == 0', 'break'],
      output: 'Alive\nAlive',
      explanation: '遊戲血量模擬：扣血直到歸零。'
    },
    {
      id: 'e10',
      code: [{text: 'n = 2'}, {text: 'while ', isSlot: true, answer: 'n <= 10', suffix: ':'}, {text: '    print(n)'}, {text: '    n += 2'}],
      options: ['n <= 10', 'n == 10', 'n < 2', 'True'],
      output: '2\n4\n6\n8\n10',
      explanation: '設定迴圈條件以印出 2 到 10 的偶數。'
    },
    // 11-15: 基礎 IF 應用
    {
      id: 'e11',
      code: [{text: 'x = 1'}, {text: 'while x < 4:'}, {text: '    if x == 2:'}, {text: '        print("Two")'}, {text: '    ', isSlot: true, answer: 'x += 1'}],
      options: ['x += 1', 'x -= 1', 'print(x)', 'break'],
      output: '(Prints Two at x=2)',
      explanation: '在迴圈中使用 if 判斷特定數值。'
    },
    {
      id: 'e12',
      code: [{text: 'run = True'}, {text: 'while run:'}, {text: '    print("Go")'}, {text: '    ', isSlot: true, answer: 'run = False'}],
      options: ['run = False', 'break', 'run == False', 'continue'],
      output: 'Go',
      explanation: '使用布林旗標 (Flag) 控制迴圈結束。'
    },
    {
      id: 'e13',
      code: [{text: 'k = 0'}, {text: 'while k < 3:'}, {text: '    print("Ha")'}, {text: '    ', isSlot: true, answer: 'k = k + 1'}],
      options: ['k = k + 1', 'k = k - 1', 'k = 0', 'k * 1'],
      output: 'Ha\nHa\nHa',
      explanation: 'k = k + 1 與 k += 1 意義相同，都是計數器。'
    },
    {
      id: 'e14',
      code: [{text: 'x = 10'}, {text: 'while x > 5:'}, {text: '    if x % 2 == 0:'}, {text: '        print(x)'}, {text: '    ', isSlot: true, answer: 'x -= 1'}],
      options: ['x -= 1', 'x += 1', 'break', 'continue'],
      output: '10\n8\n6',
      explanation: '結合倒數與偶數判斷 (Modulo)。'
    },
    {
      id: 'e15',
      code: [{text: 'items = 2'}, {text: 'while items > 0:'}, {text: '    print("Sell")'}, {text: '    ', isSlot: true, answer: 'items -= 1'}],
      options: ['items -= 1', 'items += 1', 'items = 0', 'pass'],
      output: 'Sell\nSell',
      explanation: '簡單的庫存扣除邏輯。'
    }
  ],
  medium: [
    // 1-5: 清單與 While
    {
      id: 'm1',
      code: [{text: 'data = [10, 20, 30]'}, {text: 'while ', isSlot: true, answer: 'len(data) > 0', suffix: ':'}, {text: '    print(data.pop())'}],
      options: ['len(data) > 0', 'data == []', 'data > 0', 'True'],
      output: '30\n20\n10',
      explanation: '使用 pop() 遍歷並清空清單。'
    },
    {
      id: 'm2',
      code: [{text: 'nums = [1, 5, 2]'}, {text: 'i = 0'}, {text: 'while i < len(nums):'}, {text: '    ', isSlot: true, answer: 'print(nums[i])'}, {text: '    i += 1'}],
      options: ['print(nums[i])', 'print(i)', 'nums.pop()', 'break'],
      output: '1\n5\n2',
      explanation: '使用索引 (Index) 遍歷清單。'
    },
    {
      id: 'm3',
      code: [{text: 'a = []'}, {text: 'n = 1'}, {text: 'while n <= 3:'}, {text: '    ', isSlot: true, answer: 'a.append(n)'}, {text: '    n += 1'}],
      options: ['a.append(n)', 'a = n', 'a + n', 'print(n)'],
      output: '(a becomes [1, 2, 3])',
      explanation: '在迴圈中建立清單資料 (append)。'
    },
    {
      id: 'm4',
      code: [{text: 's = "Python"'}, {text: 'i = 0'}, {text: 'while i < len(s):'}, {text: '    if s[i] == "h":'}, {text: '        ', isSlot: true, answer: 'break'}, {text: '    i += 1'}],
      options: ['break', 'continue', 'print(s)', 'exit'],
      output: '(Stops at "h")',
      explanation: '在字串搜尋特定字元，找到後停止。'
    },
    {
      id: 'm5',
      code: [{text: 'n = 10'}, {text: 'while n > 0:'}, {text: '    if n == 5:'}, {text: '        n -= 1'}, {text: '        ', isSlot: true, answer: 'continue'}, {text: '    print(n)'}, {text: '    n -= 1'}],
      options: ['continue', 'break', 'pass', 'n = 0'],
      output: '10...6\n4...1',
      explanation: '跳過特定數字 (5)，注意在 continue 前要記得變更計數器以免死迴圈。'
    },
    // 6-10: 數學與邏輯運算
    {
      id: 'm6',
      code: [{text: 'n = 1'}, {text: 'while n < 20:'}, {text: '    print(n)'}, {text: '    ', isSlot: true, answer: 'n = n * 2'}],
      options: ['n = n * 2', 'n += 2', 'n = n * n', 'n += 1'],
      output: '1\n2\n4\n8\n16',
      explanation: '指數增長 (2的次方) 迴圈。'
    },
    {
      id: 'm7',
      code: [{text: 'a, b = 0, 1'}, {text: 'while a < 10:'}, {text: '    print(a)'}, {text: '    ', isSlot: true, answer: 'a, b = b, a + b'}],
      options: ['a, b = b, a + b', 'a = b', 'b = a + b', 'a += b'],
      output: '0\n1\n1\n2\n3\n5\n8',
      explanation: '費氏數列 (Fibonacci) 生成。'
    },
    {
      id: 'm8',
      code: [{text: 'x = 123'}, {text: 'while x > 0:'}, {text: '    digit = x % 10'}, {text: '    print(digit)'}, {text: '    ', isSlot: true, answer: 'x = x // 10'}],
      options: ['x = x // 10', 'x = x / 10', 'x -= 10', 'x % 10'],
      output: '3\n2\n1',
      explanation: '拆解數字的每一位數 (整除 10)。'
    },
    {
      id: 'm9',
      code: [{text: 'n = 13'}, {text: 'd = 2'}, {text: 'while d < n:'}, {text: '    if n % d == 0:'}, {text: '        print("Not Prime")'}, {text: '        break'}, {text: '    ', isSlot: true, answer: 'd += 1'}],
      options: ['d += 1', 'n += 1', 'd = 2', 'continue'],
      output: '(Nothing printed)',
      explanation: '質數檢查邏輯 (試除法)。'
    },
    {
      id: 'm10',
      code: [{text: 'total = 0'}, {text: 'i = 1'}, {text: 'while i <= 5:'}, {text: '    if i % 2 == 0:'}, {text: '        ', isSlot: true, answer: 'total += i'}, {text: '    i += 1'}],
      options: ['total += i', 'total = i', 'total += 1', 'print(i)'],
      output: '(total becomes 6)',
      explanation: '只累加偶數 (2+4)。'
    },
    // 11-15: IF/ELSE 與流程控制
    {
      id: 'm11',
      code: [{text: 'x = 0'}, {text: 'while x < 3:'}, {text: '    if x == 1:'}, {text: '        print("One")'}, {text: '    else:'}, {text: '        ', isSlot: true, answer: 'print("Not One")'}, {text: '    x += 1'}],
      options: ['print("Not One")', 'break', 'x = 0', 'continue'],
      output: 'Not One\nOne\nNot One',
      explanation: 'While 迴圈內的 If-Else 結構。'
    },
    {
      id: 'm12',
      code: [{text: 'fuel = 5'}, {text: 'while fuel > 0:'}, {text: '    if fuel <= 2:'}, {text: '        print("Low")'}, {text: '    ', isSlot: true, answer: 'fuel -= 1'}],
      options: ['fuel -= 1', 'fuel += 1', 'break', 'pass'],
      output: 'Low\nLow',
      explanation: '低油量警示系統邏輯。'
    },
    {
      id: 'm13',
      code: [{text: 'x = 0'}, {text: 'while x < 5:'}, {text: '    x += 1'}, {text: 'else:'}, {text: '    ', isSlot: true, answer: 'print("Done")'}],
      options: ['print("Done")', 'break', 'continue', 'x = 0'],
      output: 'Done',
      explanation: 'While-Else 語法：迴圈正常結束後執行 Else。'
    },
    {
      id: 'm14',
      code: [{text: 'n = 100'}, {text: 'while n > 1:'}, {text: '    if n % 2 == 0:'}, {text: '        ', isSlot: true, answer: 'n = n // 2'}, {text: '    else:'}, {text: '        n = 3 * n + 1'}],
      options: ['n = n // 2', 'n = n - 1', 'n = 0', 'break'],
      output: '(Collatz logic)',
      explanation: 'Collatz 猜想的偶數處理分支。'
    },
    {
      id: 'm15',
      code: [{text: 'i = 0'}, {text: 'while i < 3:'}, {text: '    if i != 1:'}, {text: '        print(i)'}, {text: '    ', isSlot: true, answer: 'i += 1'}],
      options: ['i += 1', 'i -= 1', 'break', 'continue'],
      output: '0\n2',
      explanation: '印出不等於 1 的數字。'
    }
  ],
  hard: [
    // 1-5: 巢狀 IF
    {
      id: 'h1',
      code: [{text: 'x = 0'}, {text: 'while x < 3:'}, {text: '    if x > 0:'}, {text: '        if x % 2 == 0:'}, {text: '            ', isSlot: true, answer: 'print("Even")'}, {text: '    x += 1'}],
      options: ['print("Even")', 'print("Odd")', 'break', 'x = 0'],
      output: 'Even',
      explanation: '巢狀 IF：大於 0 且是偶數 (x=2)。'
    },
    {
      id: 'h2',
      code: [{text: 'n = 10'}, {text: 'while n > 0:'}, {text: '    if n > 5:'}, {text: '        if n == 8:'}, {text: '            ', isSlot: true, answer: 'break'}, {text: '    n -= 1'}],
      options: ['break', 'continue', 'n = 10', 'print(n)'],
      output: '(Stops at 8)',
      explanation: '深層巢狀條件觸發 Break。'
    },
    {
      id: 'h3',
      code: [{text: 'user = "admin"'}, {text: 'pw = "1234"'}, {text: 'tries = 0'}, {text: 'while tries < 3:'}, {text: '    if input() == user:'}, {text: '        if input() == pw:'}, {text: '            ', isSlot: true, answer: 'break'}, {text: '    tries += 1'}],
      options: ['break', 'continue', 'tries = 0', 'return'],
      output: '(Login logic)',
      explanation: '模擬登入：帳號正確且密碼正確才跳出。'
    },
    {
      id: 'h4',
      code: [{text: 'x = 0'}, {text: 'while x < 5:'}, {text: '    if x % 2 == 0:'}, {text: '        if x != 0:'}, {text: '            print(x)'}, {text: '    ', isSlot: true, answer: 'x += 1'}],
      options: ['x += 1', 'x += 2', 'break', 'pass'],
      output: '2\n4',
      explanation: '排除 0 的偶數列印。'
    },
    {
      id: 'h5',
      code: [{text: 'score = 60'}, {text: 'while score < 100:'}, {text: '    if score >= 80:'}, {text: '        if score >= 90:'}, {text: '            print("A")'}, {text: '        else:'}, {text: '            ', isSlot: true, answer: 'print("B")'}, {text: '    score += 10'}],
      options: ['print("B")', 'print("C")', 'break', 'score = 0'],
      output: 'B\nA',
      explanation: '成績分級判斷邏輯 (80分B, 90分A)。'
    },
    // 6-10: 演算法邏輯
    {
      id: 'h6',
      code: [{text: 'low, high = 0, 10'}, {text: 'target = 5'}, {text: 'while ', isSlot: true, answer: 'low <= high', suffix: ':'}, {text: '    mid = (low+high)//2'}, {text: '    if mid == target: break'}, {text: '    low = mid + 1'}],
      options: ['low <= high', 'low < high', 'low == high', 'True'],
      output: '(Binary Search)',
      explanation: '二分搜尋法的迴圈條件。'
    },
    {
      id: 'h7',
      code: [{text: 'a, b = 48, 18'}, {text: 'while b:'}, {text: '    ', isSlot: true, answer: 'a, b = b, a % b'}, {text: 'print(a)'}],
      options: ['a, b = b, a % b', 'a = a - b', 'b = b - 1', 'a = b'],
      output: '6',
      explanation: '輾轉相除法求最大公因數 (GCD)。'
    },
    {
      id: 'h8',
      code: [{text: 's = "radar"'}, {text: 'l, r = 0, len(s)-1'}, {text: 'is_pal = True'}, {text: 'while l < r:'}, {text: '    if s[l] != s[r]:'}, {text: '        is_pal = False; break'}, {text: '    ', isSlot: true, answer: 'l += 1; r -= 1'}],
      options: ['l += 1; r -= 1', 'l -= 1; r += 1', 'l += 1', 'r -= 1'],
      output: '(True)',
      explanation: '雙指標 (Two Pointers) 檢查迴文。'
    },
    {
      id: 'h9',
      code: [{text: 'n = 5'}, {text: 'fact = 1'}, {text: 'while n > 0:'}, {text: '    ', isSlot: true, answer: 'fact *= n'}, {text: '    n -= 1'}],
      options: ['fact *= n', 'fact += n', 'n *= fact', 'fact = n'],
      output: '120',
      explanation: '階乘計算。'
    },
    {
      id: 'h10',
      code: [{text: 'lst = [3, 1, 4, 1, 5]'}, {text: 'i = 0'}, {text: 'max_v = lst[0]'}, {text: 'while i < len(lst):'}, {text: '    if lst[i] > max_v:'}, {text: '        ', isSlot: true, answer: 'max_v = lst[i]'}, {text: '    i += 1'}],
      options: ['max_v = lst[i]', 'max_v += 1', 'lst[i] = max_v', 'break'],
      output: '5',
      explanation: '尋找陣列最大值邏輯。'
    },
    // 11-15: 複雜字串與清單
    {
      id: 'h11',
      code: [{text: 's = "A1B2"'}, {text: 'i = 0'}, {text: 'nums = ""'}, {text: 'while i < len(s):'}, {text: '    if s[i].isdigit():'}, {text: '        ', isSlot: true, answer: 'nums += s[i]'}, {text: '    i += 1'}],
      options: ['nums += s[i]', 'nums = s[i]', 'print(s[i])', 'break'],
      output: '12',
      explanation: '提取字串中的數字字元。'
    },
    {
      id: 'h12',
      code: [{text: 'stack = []'}, {text: 's = "(()"'}, {text: 'i = 0'}, {text: 'while i < len(s):'}, {text: '    if s[i] == "(": stack.append(1)'}, {text: '    elif s[i] == ")":'}, {text: '        ', isSlot: true, answer: 'if stack: stack.pop()'}, {text: '    i += 1'}],
      options: ['if stack: stack.pop()', 'stack.append(0)', 'break', 'pass'],
      output: '(Stack logic)',
      explanation: '括號匹配邏輯：遇到右括號時彈出堆疊，需先檢查堆疊是否為空 (巢狀IF簡寫)。'
    },
    {
      id: 'h13',
      code: [{text: 'm = [[1,2],[3,4]]'}, {text: 'r = 0'}, {text: 'while r < 2:'}, {text: '    c = 0'}, {text: '    while c < 2:'}, {text: '        print(m[r][c])'}, {text: '        ', isSlot: true, answer: 'c += 1'}, {text: '    r += 1'}],
      options: ['c += 1', 'r += 1', 'c = 0', 'break'],
      output: '1\n2\n3\n4',
      explanation: '巢狀 While 迴圈遍歷二維陣列。'
    },
    {
      id: 'h14',
      code: [{text: 'n = 123'}, {text: 'rev = 0'}, {text: 'while n > 0:'}, {text: '    rev = rev * 10 + n % 10'}, {text: '    ', isSlot: true, answer: 'n //= 10'}],
      options: ['n //= 10', 'n %= 10', 'n -= 10', 'rev += 1'],
      output: '321',
      explanation: '整數反轉算法：取餘數加到新數，原數整除。'
    },
    {
      id: 'h15',
      code: [{text: 'n = 100'}, {text: 'while n >= 10:'}, {text: '    sum_d = 0'}, {text: '    temp = n'}, {text: '    while temp > 0:'}, {text: '        sum_d += temp % 10'}, {text: '        temp //= 10'}, {text: '    ', isSlot: true, answer: 'n = sum_d'}],
      options: ['n = sum_d', 'n -= 1', 'break', 'n = 0'],
      output: '(Digital Root)',
      explanation: '數字根 (Digital Root) 計算：重複計算位數和直到剩一位數。'
    }
  ]
};

// 隨機選題函數：從 15 題中取 5 題
const getRandomQuestions = (difficulty) => {
  const pool = QUESTION_BANK[difficulty];
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  
  const selected = shuffled.slice(0, 5).map(q => {
     const qCopy = JSON.parse(JSON.stringify(q));
     qCopy.currentSlotValue = null;
     qCopy.shuffledOptions = [...qCopy.options].sort(() => Math.random() - 0.5);
     // 確保每題初始是未失敗狀態
     qCopy.hasFailed = false; 
     return qCopy;
  });
  
  return selected;
};

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
  const [touchDrag, setTouchDrag] = useState({ active: false, x: 0, y: 0, item: null });
  const [isTailwindLoaded, setIsTailwindLoaded] = useState(false);

  const [unlockedLevels, setUnlockedLevels] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('python_master_unlocked');
        return saved ? JSON.parse(saved) : ['easy'];
      }
    } catch (e) {
      console.error('LocalStorage read error', e);
    }
    return ['easy'];
  });

  useEffect(() => {
    try {
        localStorage.setItem('python_master_unlocked', JSON.stringify(unlockedLevels));
    } catch (e) {
        console.error('LocalStorage write error', e);
    }
  }, [unlockedLevels]);

  useEffect(() => {
    const startTime = Date.now();
    const minLoadTime = 2000;

    const finishLoading = () => {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadTime - elapsedTime);
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

  const customStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;700&display=swap');
    body {
      font-family: 'Noto Sans TC', sans-serif;
      background-color: #0f172a; 
      color: white;
      margin: 0;
      padding: 0;
      overflow-x: hidden;
    }
    @keyframes fade-in {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
      animation: fade-in 0.5s ease-out forwards;
    }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }
    .shake-on-hover:hover .lock-icon {
      animation: shake 0.5s ease-in-out;
    }
  `;

  const startGame = (diff) => {
    if (!unlockedLevels.includes(diff)) return;
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
    
    // 如果之前是錯誤狀態，現在填了新的，就清除錯誤訊息
    if (feedback && feedback.type === 'error') {
        setFeedback(null);
    }
  };

  // --- 核心修改：計分邏輯 ---
  const checkAnswer = () => {
    const updatedQuestions = [...questions];
    const currentQ = updatedQuestions[currentQIndex];
    const slot = currentQ.code.find(p => p.isSlot);
    const userAns = currentQ.currentSlotValue;
    
    if (userAns === slot.answer) {
      // 答對了
      let pointsToAdd = 0;
      let msg = '正確！+20分';

      // 檢查是否曾經失敗過
      if (currentQ.hasFailed) {
        pointsToAdd = 0;
        msg = '正確！(重試不加分)';
      } else {
        pointsToAdd = 20;
      }

      setScore(prev => prev + pointsToAdd);
      setFeedback({ 
          type: 'success', 
          msg: msg, 
          output: currentQ.output 
      });

    } else {
      // 答錯了
      // 標記此題為失敗過
      currentQ.hasFailed = true;
      setQuestions(updatedQuestions);

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
      if (difficulty === 'easy' && !unlockedLevels.includes('medium')) {
          setUnlockedLevels(prev => [...prev, 'medium']);
      } else if (difficulty === 'medium' && !unlockedLevels.includes('hard')) {
          setUnlockedLevels(prev => [...prev, 'hard']);
      }
    }
  };

  const useHint = () => {
    if (hints > 0 && (!feedback || feedback.type !== 'success')) {
      const currentQ = questions[currentQIndex];
      const correctAns = currentQ.code.find(p => p.isSlot).answer;
      handleSlotFill(correctAns);
      setHints(prev => prev - 1);
      
      // 使用提示不算失敗，但如果之前沒失敗過，使用提示後直接給答案通常會讓這題變簡單
      // 這裡維持原本邏輯：提示只是填入答案，使用者還是要按執行。
      // 如果想要「使用提示也不給分」，可以在這裡設定 hasFailed = true
      
      setFeedback(null);
    }
  };

  // --- Mobile Touch Drag Handlers ---
  const handleTouchStart = (e, item) => {
    const touch = e.touches[0];
    setDraggedItem(item);
    setTouchDrag({
      active: true,
      x: touch.clientX,
      y: touch.clientY,
      item: item
    });
  };

  const handleTouchMove = (e) => {
    if (!touchDrag.active) return;
    const touch = e.touches[0];
    setTouchDrag(prev => ({ ...prev, x: touch.clientX, y: touch.clientY }));
  };

  const handleTouchEnd = (e) => {
    if (!touchDrag.active) return;
    const touch = e.changedTouches[0];
    const elements = document.elementsFromPoint(touch.clientX, touch.clientY);
    const slotElement = elements.find(el => el.getAttribute('data-type') === 'slot');
    if (slotElement) {
        handleSlotFill(touchDrag.item);
    }
    setTouchDrag({ active: false, x: 0, y: 0, item: null });
    setDraggedItem(null);
  };

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
        fontFamily: 'sans-serif',
        margin: 0, 
        padding: 0,
        position: 'fixed', 
        top: 0,
        left: 0,
        zIndex: 9999
      }}>
        <style>{`body { margin: 0; padding: 0; background-color: #0f172a; overflow: hidden; }`}</style>
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
              {['easy', 'medium', 'hard'].map((diff) => {
                const isUnlocked = unlockedLevels.includes(diff);
                return (
                  <button
                    key={diff}
                    onClick={() => startGame(diff)}
                    disabled={!isUnlocked}
                    className={`
                        w-full py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-between group border
                        ${isUnlocked 
                            ? 'bg-slate-700 hover:bg-blue-600 border-slate-600 hover:border-blue-400 cursor-pointer' 
                            : 'bg-slate-800/50 border-slate-800 text-slate-600 cursor-not-allowed shake-on-hover'
                        }
                    `}
                  >
                    <div className="flex items-center gap-3">
                        {isUnlocked ? (
                            <div className={`w-2 h-2 rounded-full ${diff === 'easy' ? 'bg-green-400' : diff === 'medium' ? 'bg-yellow-400' : 'bg-red-400'}`}></div>
                        ) : (
                            <Lock size={18} className="lock-icon" />
                        )}
                        <span className="capitalize font-semibold text-lg">
                        {diff === 'easy' ? '簡單 (新手)' : diff === 'medium' ? '中等 (熟練)' : '困難 (專家)'}
                        </span>
                    </div>
                    {isUnlocked && <Play className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />}
                  </button>
                );
              })}
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
            
            {score > 0 && difficulty === 'easy' && !unlockedLevels.includes('medium') && (
                <div className="mb-6 p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-lg text-yellow-400 font-bold animate-pulse">
                    🎉 解鎖「中等」難度！
                </div>
            )}
            {score > 0 && difficulty === 'medium' && !unlockedLevels.includes('hard') && (
                 <div className="mb-6 p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-lg text-yellow-400 font-bold animate-pulse">
                    🔥 解鎖「困難」難度！
                 </div>
            )}

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
               <div className="space-y-3">
                   <button
                      onClick={() => setGameState('menu')}
                      className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 transition"
                    >
                      返回主選單重試
                    </button>
                    <p className="text-yellow-400 text-sm font-bold animate-pulse mt-2">
                        ✨ 獲得 100 分會有特別獎勵喔！ ✨
                    </p>
               </div>
            )}
            
            {score === 100 && (
                <button
                  onClick={() => setGameState('menu')}
                  className="w-full mt-3 py-3 bg-slate-700 text-white font-bold rounded-lg hover:bg-slate-600 transition"
                >
                  返回主選單
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
        {touchDrag.active && (
            <div style={{
                position: 'fixed',
                left: touchDrag.x,
                top: touchDrag.y,
                transform: 'translate(-50%, -50%)',
                zIndex: 9999,
                pointerEvents: 'none',
                opacity: 0.8
            }}>
                <div className="px-4 py-2 rounded-lg font-mono text-sm bg-blue-600 text-white shadow-xl border border-blue-400">
                    {touchDrag.item}
                </div>
            </div>
        )}

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
          <div className="bg-[#1e1e1e] p-6 font-mono text-lg overflow-x-auto border-b border-slate-700 relative">
              <div className="absolute top-2 right-2 text-xs text-slate-500">main.py</div>
              {currentQ.code.map((line, idx) => (
                  <div key={idx} className="flex items-center py-1 whitespace-pre">
                      <span className="text-slate-600 w-8 select-none text-right mr-4">{idx + 1}</span>
                      <span className="text-slate-300">{line.text}</span>
                      {line.isSlot && (
                          <div 
                              data-type="slot"
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
                         拖曳(或點擊)下方方塊至程式碼缺口處
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
                              onTouchStart={(e) => handleTouchStart(e, opt)}
                              onTouchMove={handleTouchMove}
                              onTouchEnd={handleTouchEnd}
                              className={`
                                  px-4 py-2 rounded-lg font-mono text-sm cursor-grab active:cursor-grabbing border transition-all hover:scale-105 shadow-sm select-none touch-none
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
    
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, 800, 600);
    ctx.lineWidth = 10;
    ctx.strokeStyle = '#DAA520';
    ctx.strokeRect(20, 20, 760, 560);
    ctx.lineWidth = 2;
    ctx.strokeRect(35, 35, 730, 530);
    ctx.fillStyle = '#DAA520';
    ctx.fillRect(20, 20, 50, 50);
    ctx.fillRect(730, 20, 50, 50);
    ctx.fillRect(20, 530, 50, 50);
    ctx.fillRect(730, 530, 50, 50);
    ctx.font = 'bold 50px "Noto Sans TC", "Microsoft JhengHei", sans-serif'; 
    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';
    ctx.fillText('榮 譽 證 書', 400, 150);
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
    ctx.font = 'bold 60px sans-serif';
    ctx.fillStyle = '#DAA520';
    ctx.fillText(`${score} 分`, 400, 480);
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
         <canvas ref={canvasRef} width={800} height={600} className="w-full max-w-[600px] h-auto bg-white" />
      </div>
      <div className="flex gap-4">
        <button onClick={onBack} className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-bold flex items-center gap-2 transition">
          <RotateCcw size={18} /> 返回
        </button>
        <button onClick={downloadCertificate} className="px-6 py-2 bg-yellow-500 hover:bg-yellow-400 text-slate-900 rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-yellow-500/20 transition">
          <Download size={18} /> 下載證書
        </button>
      </div>
    </div>
  );
}
