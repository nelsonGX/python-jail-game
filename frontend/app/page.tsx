"use client";

import React, { useState } from 'react';

const PythonCodeDisplay = () => {  
  const [userInput, setUserInput] = useState('');
  const [output, setOutput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);

  const sampleCode = `from get_flag import get_flag
from execute_code import execute_code

you_cant_type = ["import", "print", "exec", "eval", "open", "os", "sys"]
# you_cant_type = []

flag = get_flag()

def jail(input_string):
    for keyword in you_cant_type:
        if keyword in input_string:
            print("偵測到禁用字詞!")
        else:
            eval(input_string)

# 你只能在框框內輸入!
jail(<INPUT_HERE>)
`;

  const executeCode = async () => {
    setIsExecuting(true);
    setOutput('');
    
    try {
      const response = await fetch('http://localhost:8000/exec_code', {
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
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-zinc-800">Python Code Display</h2>
      
      <div className="relative bg-zinc-900 rounded-lg overflow-hidden shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between bg-zinc-800 px-4 py-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <span className="text-zinc-400 text-sm">jail.py</span>
        </div>
        
        {/* Code content with line numbers */}
        <div className="flex overflow-x-auto">
          {/* Line numbers */}
          <div className="bg-zinc-800 px-4 py-4 select-none">
            <pre className="text-sm text-zinc-500 font-mono leading-relaxed">
              {sampleCode.split('\n').map((_, index) => (
                <div key={index} className="text-right">
                  {index + 1}
                </div>
              ))}
            </pre>
          </div>
          
          {/* Code */}
          <div className="flex-1 p-4 relative">
            <pre className="text-sm">
              <code className="text-zinc-100 font-mono leading-relaxed">
                {sampleCode.split('<INPUT_HERE>')[0]}
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  className="bg-transparent text-zinc-100 border-none outline-none font-mono text-sm px-1 py-0 min-w-[100px] w-auto"
                  style={{ width: `${Math.max(userInput.length * 8 + 20, 100)}px` }}
                  placeholder="your_code_here"
                  onKeyPress={(e) => e.key === 'Enter' && !isExecuting && executeCode()}
                />
                {sampleCode.split('<INPUT_HERE>')[1]}
              </code>
            </pre>
          </div>
        </div>
      </div>

      {/* Execute Button */}
      <div className="mt-6">
        <button
          onClick={executeCode}
          disabled={isExecuting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExecuting ? '執行中...' : '執行代碼'}
        </button>
      </div>

      {/* Output Section */}
      {output && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2 text-zinc-800">輸出結果:</h3>
          <div className="bg-zinc-100 border border-zinc-300 rounded-md p-4">
            <pre className="text-sm text-zinc-800 font-mono whitespace-pre-wrap">
              {output}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default PythonCodeDisplay;