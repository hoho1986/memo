# 可執行程式碼及執行環境 

## 可執行程式碼的類型
根據規格書共有三種類型的可執行程式碼。
- 全域程式碼 (Global Code)
    > 全域程式碼是原始程式碼以ECMAScript程式對待。
    > 某一個程式的全域程式碼並且不包含被解析為函數主體(FunctionBody)的原始程式碼。
- 估值程式碼 (Eval Code)
    > 估值程式碼是原始程式碼作為內建函數eval的參數。更準確地說，如果參數是字串，則視為ECMAScript程式。
    > 估值程式碼被內建函數eval調用時將會以程式全域程式碼部份運行。
- 函數程式碼 (Function Code)
    > 函數程式碼是原始程式碼被解析為函數主體(FunctionBody)。
    > 某一個特定函數主體的函數程式碼並不包含任何被解析為嵌套(Nested)函數主體(FunctionBody)的原始程式碼。
    > 函數程式碼也代表提供給內建函數(Function)物件(Object)作為建構函式(Constructor)時使用的原始程式碼用。
    > 更貼切來說，最後一個提供給函數建構函式的參數將會被轉為字串(String)並被視為函數主體(FunctionBody)。
    > 如果提供多於一個參數給函數建構函式，除了最後一個參數外，其他的參數將轉為字串以逗點分隔並串連一起。
    > 合並後得出的字串將會解析為FormalParameterList提供給由最後參數定義的函數主體(FunctionBody)。
    > 函數程式碼提供給某一函數(Function)實例並不會包含任何能被解析為嵌套(Nested)函數主體(FunctionBody)的原始程式碼。
    
### 嚴謹模式程式碼
ECMAScript程式語法單元可以用非嚴謹或嚴謹模式語法和語義來被處理。當使用嚴謹模式處理時上述的三種類型的可執行程式碼將被稱為嚴謹全域程式碼(Strict  Global Code)、嚴謹估值程式碼(Strict Eval Code)及嚴謹函數程式碼(Strict Function Code)。程式碼在以下狀況會被視作嚴謹模式程式碼:
- 全域程式碼是嚴謹全域程式碼當它起始為指示序言(Directive Prologue)而且包含使用嚴謹模式指示(Use Strict Directive)。([參閱章節14.1](http://www.ecma-international.org/ecma-262/5.1/#sec-14.1))
- 估值程式碼是嚴謹估值程式碼當它
    - 起始為指示序言(Directive Prologue)而且包含使用嚴謹模式指示(Use Strict Directive) 或 
    - if the call to eval is a direct call (see 15.1.2.1.1) to the eval function that is contained in strict mode code.
- Function code that is part of a FunctionDeclaration, FunctionExpression, or accessor PropertyAssignment is strict function code if its FunctionDeclaration, FunctionExpression, or PropertyAssignment is contained in strict mode code or if the function code begins with a Directive Prologue that contains a Use Strict Directive.
- Function code that is supplied as the last argument to the built-in Function constructor is strict function code if the last argument is a String that when processed as a FunctionBody begins with a Directive Prologue that contains a Use Strict Directive.

## 詞法環境
詞法環境(Lexical Environment)是....


15.1.2.1.1 直接調用Eval

直接調用Eval函數表示為 調用表達式CallExpression 滿足以下兩個條件

The Reference that is the result of evaluating the MemberExpression in the CallExpression has an environment record as its base value and its reference name is "eval".

The result of calling the abstract operation GetValue with that Reference as the argument is the standard built-in function defined in 15.1.2.1.


http://www.ecma-international.org/ecma-262/5.1/#sec-10.1
https://spec.commonmark.org/dingus/
https://dictionary.cambridge.org/zht/%E8%A9%9E%E5%85%B8/%E8%8B%B1%E8%AA%9E-%E6%BC%A2%E8%AA%9E-%E7%B9%81%E9%AB%94/
https://translate.google.com.hk/