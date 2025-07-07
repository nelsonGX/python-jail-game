"use client";

import React, { useState } from 'react';
import { Play } from 'lucide-react';

const PythonCodeDisplay = () => {  
  const [userInput, setUserInput] = useState('');
  const [output, setOutput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const sampleCode = `from get_flag import get_flag

you_cant_type = ["import", "print", "exec", "eval", "open", "os", "sys"]

def jail(input_string):
    for keyword in you_cant_type:
        input_string = input_string.replace(keyword, "")

    flag = get_flag()
    exec(input_string)

# 請在這裡輸入你的程式碼👇
jail("<INPUT_HERE>")
`;

  const executeCode = async () => {
    setIsExecuting(true);
    setOutput('');
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/exec_code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: userInput }),
      });
      
      const data = await response.json();
      
      if (data.error) {
        setOutput(`Error: ${data.error}`);
      } else if (data.result) {
        const result = data.result;
        if (result.success) {
          setOutput(result.stdout || '執行成功，無輸出');
        } else {
          setOutput(`錯誤: ${result.stderr}`);
        }
      } else {
        setOutput('未知錯誤');
      }
    } catch (error) {
      setOutput(`網路錯誤: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            尋找密碼...
          </h1>
          <p className="text-zinc-300">
            你找到了一個 Python 程式碼，但很可惜的，你只能在框框內輸入，於是聰明的你開始思考如何繞過這個限制來找到密碼...
          </p>
          <div className="relative">
            <button 
              className="text-blue-500 underline focus:outline-none"
              onClick={() => setShowHint(!showHint)}
            >
              {showHint ? '[提示]' : '[隱藏提示]'}
            </button>
            {showHint && (
              <div className="mt-2 p-4 bg-zinc-800 border border-zinc-700 rounded">
                <p className="text-zinc-300">
                  你需要找到 flag 的內容
                </p>
              </div>
            )}
          </div>
        </div>
      
        <div className="bg-zinc-800 rounded-lg shadow-lg border border-zinc-700 overflow-hidden">
          <div className="flex items-center justify-between bg-zinc-750 px-4 py-3 border-b border-zinc-700">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <span className="text-zinc-300 text-sm font-medium">jail.py</span>
          </div>
        
          <div className="flex overflow-x-auto">
            <div className="bg-zinc-700 px-4 py-4 select-none border-r border-zinc-600">
              <pre className="text-sm text-zinc-400 font-mono leading-relaxed">
                {sampleCode.split('\n').map((_, index) => (
                  <div key={index} className="text-right">
                    {index + 1}
                  </div>
                ))}
              </pre>
            </div>
            
            <div className="flex-1 p-4 relative bg-zinc-900">
              <pre className="text-sm">
                <code className="text-zinc-100 font-mono leading-relaxed">
                  {sampleCode.split('<INPUT_HERE>')[0]}
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    className="bg-zinc-800 text-green-400 border border-zinc-600 outline-none font-mono text-sm px-2 py-1 min-w-[100px] w-auto rounded focus:border-green-500 focus:bg-zinc-700"
                    style={{ width: `${Math.max(userInput.length * 8 + 20, 120)}px` }}
                    placeholder="輸入..."
                    onKeyDown={(e) => e.key === 'Enter' && !isExecuting && executeCode()}
                  />
                  {sampleCode.split('<INPUT_HERE>')[1]}
                </code>
              </pre>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={executeCode}
            disabled={isExecuting}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isExecuting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>執行中...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>執行！</span>
              </>
            )}
          </button>
        </div>

        {output && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3 text-white">輸出結果:</h3>
            <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
              <pre className="text-sm text-zinc-200 font-mono whitespace-pre-wrap">
                {output}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PythonCodeDisplay;