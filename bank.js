/* Question generators for the 16 midterm outcomes. No external dependencies. */
(function(root){
const topics=[];
const rand=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const pick=a=>a[rand(0,a.length-1)];
function shuffle(a){a=[...a]; for(let i=a.length-1;i>0;i--){const j=rand(0,i);[a[i],a[j]]=[a[j],a[i]];}return a;}
const s=x=>String(x), uniq=a=>[...new Set(a.map(s))];
const opts=(answer,wrong)=>shuffle(uniq([answer,...wrong]));
function mc(prompt,answer,wrong,explanation,extra={}){return {type:'mc',prompt,answer:s(answer),options:opts(answer,wrong),explanation,...extra};}
function multi(prompt,answer,wrong,explanation,extra={}){return {type:'multi',prompt,answer:answer.map(s),options:shuffle(uniq([...answer,...wrong])),explanation,...extra};}
function fill(prompt,answer,explanation,extra={}){return {type:'fill',prompt,answer:s(answer),explanation,...extra};}
function drop(prompt,fields,explanation,extra={}){return {type:'drop',prompt,fields:fields.map(([label,answer,...wrong])=>({label,answer:s(answer),options:opts(answer,wrong)})),answer:fields.map(f=>s(f[1])),explanation,...extra};}
function order(prompt,lines,explanation,extra={}){return drop(prompt,lines.map((line,i)=>[`Line ${i+1}`,line,...lines.filter((_,j)=>j!==i)]),explanation,{...extra,order:true});}
function add(id,points,name,...generators){topics.push({id,points,name,generators});}
const out=(code,expected)=>({code,audit:{code,expected:s(expected)}});
const val=(code,expr,expected)=>({code,audit:{code:code+'\nprint('+expr+')',expected:s(expected)}});
const trace=(code,answer,explanation,kind='fill',wrong=[])=>kind==='mc'?mc('What is printed?',answer,wrong,explanation,out(code,answer)):fill('What is printed?',answer,explanation,{...out(code,answer),multiline:s(answer).includes('\n')});
const value=(code,expr,answer,explanation,kind='fill',wrong=[])=>kind==='mc'?mc(`What is the final value of ${expr}?`,answer,wrong,explanation,val(code,expr,answer)):fill(`What is the final value of ${expr}?`,answer,explanation,val(code,expr,answer));
const nums=(n)=>uniq([n+1,n-1,n+2,n-2]);
const pybool=b=>b?'True':'False';
const flow=(mode)=>({mode});
add('EM_01',6,'Printed output: arithmetic and string operations',
()=>{let a=rand(7,24),b=rand(3,6),c=rand(2,4),v=Math.floor(a/b)+a%b*c;return trace(`a = ${a}\nb = ${b}\nprint(a // b + a % b * ${c})`,v,'Compute the quotient and remainder before multiplication and addition.','mc',nums(v));},
()=>{let n=rand(2,5),w=pick(['ab','xy','go','no']);return trace(`word = "${w}"\nprint(word * ${n} + str(${n} + 2))`,w.repeat(n)+s(n+2),'The string is repeated; the integer sum is converted to text before concatenation.');},
()=>{let n=rand(2,8),a=n+3;let code=`print(${a} / 2)\nprint(${a} // 2)\nprint(${a} % 2)`;let lines=[(a/2).toFixed(1),s(Math.floor(a/2)),s(a%2)];return multi('Select ALL correct descriptions of the printed lines.',lines.map((v,i)=>`Line ${i+1}: ${v}`),[`Line 1: ${Math.floor(a/2)}`,`Line 2: ${(a/2).toFixed(1)}`,`Line 3: ${a%2+1}`],'/ produces a float, // gives the floor quotient, and % gives the remainder.',out(code,lines.join('\n')));});
add('EM_02',6,'Numerical self-assignment operations',
()=>{let a=rand(5,15),b=rand(2,5),v=(a+b)*2-3;return value(`n = ${a}\nn += ${b}\nn *= 2\nn -= 3`,'n',v,`Update n in order: ${a+b}, ${(a+b)*2}, then ${v}.`);},
()=>{let a=rand(13,30),b=rand(3,6),v=Math.floor(a/b)**2;return value(`x = ${a}\nx //= ${b}\nx **= 2`,'x',v,'Floor division occurs first. Square the updated quotient.','mc',nums(v));},
()=>{let a=rand(3,9),b=rand(2,5),v=(a+0.5)*b;return value(`x = ${a}\nx += 0.5\nx *= ${b}\nx /= 2`,'x',(v/2).toFixed(v%2===0?1:(v*2)%2===0?1:2),'Each operation uses the current value of x. True division gives a float.');});
add('EM_03',6,'Self-assignment and multiple variable assignment',
()=>{let a=rand(2,7),b=rand(8,15);return trace(`a, b = ${a}, ${b}\na += 3\na, b = b, a + b\nb -= 2\nprint(a, b)`,`${b} ${a+b+1}`,'The right-hand expressions of multiple assignment use the old values; b is then decreased by 2.','mc',[`${b} ${a+b+3}`,`${b+1} ${a+b+1}`,`${a+b+3} ${b-2}`]);},
()=>{let n=rand(2,5),w=pick(['ha','go','up']);return trace(`a, b = "${w}", ${n}\na *= b\na, b = a + "!", b + 1\nprint(a, b)`,w.repeat(n)+`! ${n+1}`,'Repeat the string, then evaluate both new values before assigning.');},
()=>{let a=rand(2,8),b=rand(9,14),c=rand(2,5),x=b+c,y=a*2;return trace(`x, y = ${a}, ${b}\ny += ${c}\nx *= 2\nx, y = y, x\nprint(x - y, y)`,`${x-y} ${y}`,'Update both values before swapping them. Subtract the swapped y from the swapped x.','mc',[`${x-y+1} ${y}`,`${x-y} ${y+1}`,`${x-y-1} ${y-1}`]);});
add('EM_04',6,'Formatted print output with sep and end',
()=>{let a=rand(2,8),b=rand(10,19);return trace(`print(${a}, ${b}, sep=":", end=" | ")\nprint("done", "!", sep="")`,`${a}:${b} | done!`,'sep separates arguments within one print; end replaces its final newline.','mc',[`${a} ${b} | done !`,`${a}:${b}\ndone!`,`${a}:${b}|done!`]);},
()=>{let [a,b,c,d]=shuffle(['red','blue','green','gold']);let lines=[`print("${a}", "${b}", sep="-", end="|")`,`print("${c}", end="!")`,`print("${d}")`];return order('Arrange the print statements to produce this exact output.',lines,'The first print ends with |, the second ends with !, and the third completes the line.',{target:`${a}-${b}|${c}!${d}`,audit:{code:lines.join('\n'),expected:`${a}-${b}|${c}!${d}`}});},
()=>{let n=rand(2,9);return trace(`print("A", ${n}, sep="", end="-")\nprint("B", ${n+1}, sep=":")\nprint("C", end="!")`,`A${n}-B:${n+1}\nC!`,'The first two calls share one line. The second restores the default newline; the last ends in !.');});
add('EM_05',6,'Arithmetic, strings, and type conversions',
()=>{let a=rand(2,8),v=Number(s(a+2).repeat(2))-3;return value(`x = ${a}\nx = str(x + 2)\nx = x * 2\nx = int(x) - 3`,'x',v,'Convert the sum to text, repeat it, then convert the resulting digits to an integer before subtracting.');},
()=>{let a=rand(4,9);return value(`x = "${a}.75"\nx = float(x) * 2\nx = int(x)\nx = str(x) + "0"`,'x',`${a*2+1}0`,'float converts the text; int truncates the decimal part; the final + concatenates a character. The displayed answer is the string contents without quotes.','mc',[`${a*2+2}0`,`${a*2+1}`,`${a*2+1}.50`]);},
()=>{let a=rand(3,8),b=rand(2,5),v=(a+b)*2;return drop('Choose the value of x after each indicated line. String values are shown with quotation marks.',[['After line 2',`"${a+b}"`,a+b,`"${a}${b}"`],['After line 3',`"${s(a+b).repeat(2)}"`,v,`"${v}"`],['After line 4',Number(s(a+b).repeat(2)),`"${s(a+b).repeat(2)}"`,v]],'str converts a number into text; multiplying a string repeats it; int converts the resulting digits.',{code:`x = ${a}\nx = str(x + ${b})\nx *= 2\nx = int(x)`});});
add('EM_06',6,'f-strings and formatting specifiers',
()=>{let n=rand(2,8),p=rand(2,8)+.25;let code=`qty = ${n}\nprice = ${p}`;let correct=`print(f"Qty: {qty:03d}")\nprint(f"Total: $${'{qty * price:.2f}'}")`;let target=`Qty: ${s(n).padStart(3,'0')}\nTotal: $${(n*p).toFixed(2)}`;return mc('Which pair of print statements produces the specified output?',correct,[correct.replace('03d','3d'),correct.replace('.2f','.1f'),correct.replace('qty * price','price')],'03d adds leading zeroes; .2f displays exactly two decimal places.',{code,target,audit:{code:code+'\n'+correct,expected:target}});},
()=>{let n=rand(2,9),p=rand(2,8)+.5;return drop('Choose the format specifiers to match the displayed output.',[['First blank','04d','4d','02d','.2f'],['Second blank','.2f','.1f','.0f','04d']],'04d pads to width four with zeroes; .2f prints exactly two fractional digits.',{code:`count = ${n}\nrate = ${p}\nprint(f"Count: {count:___}")\nprint(f"Rate: {rate:___}")`,target:`Count: ${s(n).padStart(4,'0')}\nRate: ${p.toFixed(2)}`});},
()=>{let n=rand(2,8)/10;let code=`rate = ${n}\nname = "Ada"`;let good=[`print(f"{name:>5}")`,`print(f"{rate:.0%}")`];return multi('Select BOTH statements needed to print the two target lines in the order shown.',good,[`print(f"{name:<5}")`,`print(f"{rate:.1%}")`,`print(f"{rate:.0f}")`],' >5 right-aligns the text in width five; .0% converts a proportion to a percentage without decimals.',{code,target:`  Ada\n${Math.round(n*100)}%`,audit:{code:code+'\n'+good.join('\n'),expected:`  Ada\n${Math.round(n*100)}%`}});});
add('EM_07',6,'Function parameters, print, and return values',
()=>{let n=rand(2,8);return trace(`def change(x):\n    print(x + 1)\n    return x * 2\n\nresult = change(${n})\nprint(result + 3)`,`${n+1}\n${n*2+3}`,'The print in change occurs during the call. The returned value is assigned to result, then the final print runs.');},
()=>{let n=rand(2,8);let code=`def show(n):\n    print(n * 2, end=" ")\n    return n + 1\n\nprint(show(${n}))`;return multi('Select ALL statements that correctly describe the output.',[`The first printed number is ${n*2}.`,`The second printed number is ${n+1}.`,'The two numbers appear on the same line.'],[`The first printed number is ${n+1}.`,'The outer print displays None.','Each number appears on a separate line.'],'The argument to the outer print is evaluated first. The inner print ends with a space.',out(code,`${n*2} ${n+1}`));},
()=>{let n=rand(3,9);return trace(`import math\n\ndef calculate(x, offset=2):\n    print(x + offset)\n    return math.sqrt(x)\n\nprint(calculate(${n*n}, offset=3))`,`${n*n+3}\n${n}.0`,'The keyword argument overrides the default. math.sqrt returns a float.','mc',[`${n*n+2}\n${n}.0`,`${n}.0\n${n*n+3}`,`${n*n+3}\n${n}`]);});
add('EM_08',6,'Function parameters and looping structures',
()=>{let n=rand(3,6),a=rand(2,5),v=0,lines=[];for(let i=0;i<n;i++){v+=a+i;lines.push(v);}return trace(`def accumulate(start, count):\n    total = 0\n    for i in range(count):\n        total += start + i\n        print(total)\n\naccumulate(${a}, ${n})`,lines.join('\n'),'Each iteration adds start + i to the running total and prints the new total.');},
()=>{let n=rand(3,6),word=pick(['x','go','ab']);return trace(`def repeat(word, count):\n    result = ""\n    for i in range(count):\n        result += word\n    return result\n\nprint(repeat("${word}", ${n}))`,word.repeat(n),'The loop builds one string, which is returned and printed once.','mc',[Array(n).fill(word).join('\n'),word.repeat(n-1),word.repeat(n+1)]);},
()=>{let n=rand(3,7);return trace(`def reduce(n):\n    while n > 0:\n        print(n, end=" ")\n        n -= 2\n    return n\n\nprint(reduce(${n}))`,Array.from({length:Math.ceil(n/2)+1},(_,i)=>n-i*2).join(' '),'The while loop prints each positive value. After it finishes, the outer print displays the returned nonpositive value.');});
add('EM_09',10,'Constructing functions with numeric and string operations and control flow',
()=>{let n=rand(2,5);return drop(`Complete label_score. Return "high:" followed by the score if score is at least ${n*10}; otherwise return "low:" followed by the score.`,[['Condition',`score >= ${n*10}`,`score > ${n*10}`,`score <= ${n*10}`],['High return','return "high:" + str(score)','return "high:" + score','print("high:" + str(score))'],['Low return','return "low:" + str(score)','return "low:" + score','return "high:" + str(score)']],'Use an inclusive comparison. Convert the number to a string before concatenating, and return rather than print.',{code:'def label_score(score):\n    if ___:\n        ___\n    else:\n        ___'});},
()=>{let n=rand(3,6);return drop(`Complete scaled_label. It returns text repeated n times if n is positive and even; if n is positive and odd, repeat text n + ${n} times; otherwise return an empty string.`,[['First condition','n > 0 and n % 2 == 0','n > 0 or n % 2 == 0','n % 2 != 0'],['First return','return text * n','return text + n','return n'],['Second condition','n > 0','n < 0','n == 0'],['Second return',`return text * (n + ${n})`,`return text * n + ${n}`,`return text + str(n + ${n})`]],'Check both positivity and evenness first. The next branch handles the remaining positive integers; repetition requires an integer.',{code:'def scaled_label(text, n):\n    if ___:\n        ___\n    elif ___:\n        ___\n    else:\n        return ""'});},
()=>{let k=rand(2,5);let good=`def tag(n):\n    result = ""\n    for i in range(1, n + 1):\n        if i % ${k} == 0:\n            result += "*"\n        else:\n            result += str(i)\n    return result`;return mc(`Which function returns a string containing the numbers 1 through n, replacing multiples of ${k} with *? The numbers should be concatenated without spaces.`,good,[good.replace('range(1, n + 1)','range(1, n)'),good.replace('i % '+k+' == 0','i % '+k+' != 0'),good.replace('result += str(i)','result = str(i)')],'Use an inclusive upper endpoint via n + 1, test divisibility, and accumulate characters without resetting the string.');},
()=>{let n=rand(2,5);return drop(`Complete the function. For each integer from 1 through count, append the word if i is divisible by ${n}; otherwise append i as text. Return the total string.`,[['Loop stop','count + 1','count','count - 1'],['Condition',`i % ${n} == 0`,`i // ${n} == 0`,`i % ${n} != 0`],['True branch','result += word','result = word','result += i'],['False branch','result += str(i)','result += i','result = str(i)'],['Last line','return result','print(result)','return word']],'Initialize the accumulator once, visit the inclusive range, convert numbers to text, and return after the loop.',{code:'def build(word, count):\n    result = ""\n    for i in range(1, ___):\n        if ___:\n            ___\n        else:\n            ___\n    ___'});});
add('EM_10',6,'Final variable value after if-elif-else',
()=>{let n=rand(1,12),v=n<5?n+10:n<9?n*2:n-3;return value(`x = ${n}\nif x < 5:\n    x += 10\nelif x < 9:\n    x *= 2\nelse:\n    x -= 3`,'x',v,'Exactly one branch runs based on the original value.');},
()=>{let n=rand(2,12),v=n%3===0?n+4:n%2===0?n*3:n-1;return value(`x = ${n}\nif x % 3 == 0:\n    x += 4\nelif x % 2 == 0:\n    x *= 3\nelse:\n    x -= 1`,'x',v,'The first true condition wins, even if both tests could have been true.','mc',nums(v));},
()=>{let a=rand(2,10),b=rand(2,10),v=a>b&&a%2===0?a+b:a>=b?a-b:b-a;return value(`a, b = ${a}, ${b}\nif a > b and a % 2 == 0:\n    result = a + b\nelif a >= b:\n    result = a - b\nelse:\n    result = b - a`,'result',v,'Evaluate both parts of the first condition. If it is false, evaluate the elif; otherwise skip it.');});
add('EM_11',6,'Printed output with independent if and if-else statements',
()=>{let x=rand(2,10);return trace(`x = ${x}\nif x > 4:\n    print("A")\nif x % 2 == 0:\n    print("B")\nelse:\n    print("C")`,(x>4?'A\n':'')+(x%2===0?'B':'C'),'The first if is independent; the else belongs only to the second if.');},
()=>{let n=rand(2,8),v=n+3;v=v>8?v*2:v-1;return trace(`x = ${n}\nif x % 2 == 0 or x < 9:\n    x += 3\nif x > 8:\n    x *= 2\nelse:\n    x -= 1\nprint(x)`,v,'The second if sees the updated x produced by the first.','mc',nums(v));},
()=>{let n=rand(2,10),x=n,lines=[];if(x%2===0){x+=3;lines.push('even');}if(x>7){lines.push('large');}else{lines.push('small');}if(x%2===1){lines.push('odd');}lines.push(s(x));return trace(`x = ${n}\nif x % 2 == 0:\n    x += 3\n    print("even")\nif x > 7:\n    print("large")\nelse:\n    print("small")\nif x % 2 == 1:\n    print("odd")\nprint(x)`,lines.join('\n'),'All three if statements are independent; later tests use the current value of x.');});
add('EM_12',6,'Constructing conditional game simulations',
()=>{let max=rand(5,9);return drop(`Complete the guessing game. Choose the secret randomly from 1 through ${max}, inclusive. Print "win" for a match, "low" for a guess below the secret, otherwise "high".`,[['Random expression',`random.randint(1, ${max})`,`random.randrange(1, ${max})`,`random.randint(0, ${max})`],['First condition','guess == secret','guess != secret','guess = secret'],['Second condition','guess < secret','guess > secret','guess <= 0']], 'randint includes both endpoints. Test equality first, then the lower guess; else catches the remaining case.',{code:'import random\nsecret = ___\nguess = int(input("Guess: "))\nif ___:\n    print("win")\nelif ___:\n    print("low")\nelse:\n    print("high")'});},
()=>{let n=rand(4,9);let lines=[`if roll == ${n}:`,'    print("jackpot")',`elif roll >= ${n-2}:`,'    print("small prize")','else:','    print("try again")'];return order(`Arrange the lines. A roll of ${n} wins the jackpot; the next two smaller rolls get a small prize; all other rolls get no prize.`,lines,'Check the jackpot first, then the overlapping range, then the remaining values.',{code:`import random\nroll = random.randint(1, ${n})`});},
()=>{let good=['player == computer','(player == 1 and computer == 3) or (player == 2 and computer == 1) or (player == 3 and computer == 2)'];return drop('Complete rock-paper-scissors. 1 = rock, 2 = paper, 3 = scissors. Equal choices tie; rock beats scissors, paper beats rock, scissors beats paper.',[['Tie condition',good[0],'player != computer','player > computer'],['Win condition',good[1],good[1].replaceAll(' or ',' and '),'player > computer','player < computer']],'The three winning matchups are independent alternatives, each requiring two matching choices.',{code:'import random\nplayer = int(input("Choice (1–3): "))\ncomputer = random.randint(1, 3)\nif ___:\n    print("tie")\nelif ___:\n    print("win")\nelse:\n    print("lose")'});});
add('EM_13',6,'Numerical for-loop tracing',
()=>{let a=rand(1,5),b=a+rand(3,6),v=2;for(let i=a;i<b;i++)v+=i*2;return value(`total = 2\nfor i in range(${a}, ${b}):\n    total += i * 2`,'total',v,`range excludes ${b}; add twice each i to the initial total of 2.`);},
()=>{let n=rand(3,6),v=1;for(let i=1;i<=n;i++)v*=i;return value(`product = 1\nfor i in range(1, ${n+1}):\n    product *= i`,'product',v,`Multiply by each integer from 1 through ${n}.`,'mc',[v+n,v*2,v-1,n*(n+1)/2].filter(x=>x!==v));},
()=>{let a=rand(8,14),b=rand(1,4),step=rand(2,3),v=10;for(let i=a;i>b;i-=step)v-=i;return value(`total = 10\nfor i in range(${a}, ${b}, -${step}):\n    total -= i`,'total',v,'A negative step counts downward and excludes the stop value. Subtract each visited number.');});
add('EM_14',6,'While-loop construction and output tracing',
()=>{let start=rand(2,5),step=rand(2,4),end=start+step*rand(3,5),a=[];for(let n=start;n<end;n+=step)a.push(n);return trace(`n = ${start}\nwhile n < ${end}:\n    print(n)\n    n += ${step}`,a.join('\n'),'Print before incrementing; the loop stops at the exclusive upper bound.');},
()=>{let sentinel=pick([-1,0,-99]);return drop(`Add integers entered by the user until ${sentinel} is entered. Do not include the sentinel in the total.`,[['Loop condition',`n != ${sentinel}`,`n == ${sentinel}`,'total != n'],['Update total','total += n','total = n','n += total'],['Last line of loop','n = int(input("Number: "))','print(total)','total = 0']],'Prime the input before the loop, check the sentinel before adding, and read a fresh value each iteration.',{code:'total = 0\nn = int(input("Number: "))\nwhile ___:\n    ___\n    ___\nprint(total)'});},
()=>{let start=rand(8,15),step=rand(2,4),a=[];for(let n=start;n>0;){n-=step;a.push(n);}return trace(`n = ${start}\nwhile n > 0:\n    n -= ${step}\n    print(n)`,a.join('\n'),'Subtraction occurs before each print, so the last printed number can be zero or negative.','mc',[[start,...a.slice(0,-1)].join('\n'),a.filter(n=>n>0).join('\n'),a.map(n=>n+1).join('\n')]);});
add('EM_15',6,'If-elif-else inside a loop',
()=>{let a=rand(1,4),b=a+rand(4,7),lines=[];for(let i=a;i<b;i++)lines.push(i%3===0?'A':i%2===0?'B':'C');return trace(`for i in range(${a}, ${b}):\n    if i % 3 == 0:\n        print("A")\n    elif i % 2 == 0:\n        print("B")\n    else:\n        print("C")`,lines.join('\n'),'For each i, check divisibility by 3 before checking whether it is even. Each iteration prints one line.');},
()=>{let n=rand(4,7),v=0,lines=[];for(let i=1;i<=n;i++){if(i%2===0)v+=i;else if(i>3)v-=i;else v+=1;lines.push(v);}let code=`total = 0\nfor i in range(1, ${n+1}):\n    if i % 2 == 0:\n        total += i\n    elif i > 3:\n        total -= i\n    else:\n        total += 1\n    print(total)`;let indices=[0,1,n-1];return multi('Select ALL correct line-number and output pairs.',indices.map(i=>`Line ${i+1}: ${lines[i]}`),indices.map(i=>`Line ${i+1}: ${lines[i]+1}`),'Trace the running total after exactly one branch per iteration.',out(code,lines.join('\n')));},
()=>{let n=rand(4,8),t='';for(let i=0;i<n;i++)t+=i===0?'S':i%2===0?'E':'o';return trace(`text = ""\nfor i in range(${n}):\n    if i == 0:\n        text += "S"\n    elif i % 2 == 0:\n        text += "E"\n    else:\n        text += "o"\nprint(text)`,t,'At zero the first branch wins; subsequent even indices append E and odd indices append o.','mc',[t.replace('S','E'),t.slice(1),t+'o']);});
add('EM_16',6,'Nested loops and conditionals for printed patterns',
()=>{let n=rand(3,6),lines=[];for(let r=0;r<n;r++){let line='';for(let c=0;c<n;c++)line+=r===c?'X':'.';lines.push(line);}return trace(`for r in range(${n}):\n    for c in range(${n}):\n        if r == c:\n            print("X", end="")\n        else:\n            print(".", end="")\n    print()`,lines.join('\n'),'The inner loop prints one row. X appears where the row and column indices match. The final print moves to the next line.','mc',[lines.map(l=>l.split('').reverse().join('')).join('\n'),Array(n).fill('X'+'.'.repeat(n-1)).join('\n'),lines.join('')]);},
()=>{let a=rand(3,5),b=rand(3,6),lines=[];for(let r=0;r<a;r++){let line='';for(let c=0;c<b;c++)line+=(r+c)%2===0?'#':'-';lines.push(line);}return trace(`for row in range(${a}):\n    for col in range(${b}):\n        if (row + col) % 2 == 0:\n            print("#", end="")\n        else:\n            print("-", end="")\n    print()`,lines.join('\n'),'The parity of row + col alternates across every row and column, beginning with #.');},
()=>{let n=rand(3,6),lines=[];for(let r=1;r<=n;r++){let line='';for(let c=1;c<=r;c++)line+=c===r?'*':s(c);lines.push(line);}return trace(`for r in range(1, ${n+1}):\n    for c in range(1, r + 1):\n        if c == r:\n            print("*", end="")\n        else:\n            print(c, end="")\n    print()`,lines.join('\n'),'Each row has r characters. The last character is *, while earlier characters are the column numbers.','mc',[lines.map(l=>l.split('').reverse().join('')).join('\n'),Array.from({length:n},(_,i)=>'*'.repeat(i+1)).join('\n'),lines.join('')]);});
const hints={
  "EM_01": [
    "Evaluate // and % separately, then follow Python precedence.",
    "Track whether each expression is a number or a string before combining them.",
    "Compare the type and value produced by each of the three division-related operators."
  ],
  "EM_02": [
    "Make a trace table with one row for every assignment. Use the previous row as the starting value.",
    "Rewrite the augmented assignments as ordinary assignments and evaluate in order.",
    "Keep the fractional part until the final line; do not round intermediate results."
  ],
  "EM_03": [
    "Write down both values immediately before the multiple assignment. Evaluate both right-hand expressions before updating either variable.",
    "Track the type of a and b, and distinguish repeating text from multiplication of numbers.",
    "Complete the two updates before swapping. Then label the new x and y explicitly."
  ],
  "EM_04": [
    "Separate the characters between arguments from the characters printed after each call.",
    "Look at the first characters of the target and the ending character of each print statement.",
    "Draw a cursor after every print call. Which calls move the cursor to a new line?"
  ],
  "EM_05": [
    "Keep a value and type column in your trace table; multiplying a string behaves differently from multiplying an integer.",
    "Remember that int on a positive float discards its fractional part, rather than rounding.",
    "For each line, ask whether the value is text or a number. Quotes in the answer choices matter."
  ],
  "EM_06": [
    "Check both the number of digits before the first output and the number of digits after the decimal point in the second.",
    "Count the desired leading zeroes and decimal places. Which specifiers control those separately?",
    "Count the spaces before the name, then decide whether the rate must be displayed as a decimal or a percentage."
  ],
  "EM_07": [
    "Follow execution into the function before continuing the calling code. Keep printed values separate from returned values.",
    "The argument to print must be evaluated before print itself runs. Track the ending character of the inner print.",
    "Check whether the call supplies an explicit offset, and remember the type of a square-root result."
  ],
  "EM_08": [
    "Create a table of i and total. Add a line to the output each time print executes.",
    "Pay attention to the indentation of return and print. How many times is each reached?",
    "Track n at the top of each iteration and again when the loop exits. The outer print still has work to do."
  ],
  "EM_09": [
    "Test your choices mentally with a score exactly at the threshold, and check whether the function must return or print text.",
    "Try a negative number, a positive even number, and a positive odd number. Does each reach the right branch?",
    "Test the function with n equal to the divisor. Check the loop boundary, the branch test, and whether earlier characters survive.",
    "Test a count equal to the divisor. Track both what gets appended and when the function finishes."
  ],
  "EM_10": [
    "Evaluate the conditions in order using the initial x. Once a branch is entered, check whether any other branch can execute.",
    "Consider what happens when a value satisfies more than one test. How does elif differ from a second if?",
    "Evaluate the two comparisons in the first condition separately; then combine them using and."
  ],
  "EM_11": [
    "Mark which else belongs to which if. The first decision does not prevent the second decision from being evaluated.",
    "Update x after the first block before testing the next condition.",
    "Keep an output list alongside your trace of x. Recheck parity after x changes."
  ],
  "EM_12": [
    "Check the endpoints of each random function, then test guesses that are equal to, below, and above the secret.",
    "The prize ranges overlap at the top. Consider which condition needs to be tested before a broader condition.",
    "Make a small table of the three winning pairs. Each pair needs two simultaneous matches, but any one pair is enough."
  ],
  "EM_13": [
    "List the actual values produced by range before calculating the total. Include the initial value of the accumulator.",
    "Write the running product after each iteration. Remember where range stops.",
    "List the descending values first. Check the sign of the step and whether the stop value is included."
  ],
  "EM_14": [
    "Write the value at the top of the loop, at print, and after the update. Check the condition before each iteration.",
    "Try the sentinel as the very first input and as the second input. Does your loop exclude it and obtain fresh input?",
    "Compare the position of print with the subtraction. A value can change after the condition is checked."
  ],
  "EM_15": [
    "List each i and evaluate the conditions in order. Only one branch can print on each iteration.",
    "Trace the running total in a table and record it after each branch. The print is outside the conditional but inside the loop.",
    "Trace i starting at zero. For each iteration, check the first condition before testing parity."
  ],
  "EM_16": [
    "Draw a grid labeled by row and column indices. Work out which cells satisfy the equality test.",
    "Compute row + col for a few cells, then test its parity. Notice what happens when you move down one row.",
    "List the column values for each row independently. Check the condition at the last column of each row."
  ]
};
function hint(q){return hints[q.topicId]?.[q.variant] || "Trace the code in execution order and check each part of your answer.";}
function make(topic,index){const q=topic.generators[index]();return {...q,topicId:topic.id,variant:index};}
function session(ids,count=2){return shuffle(topics.filter(t=>!ids||ids.includes(t.id)).flatMap(t=>shuffle(t.generators.map((_,i)=>i)).slice(0,count===1?1:count===2?(t.id==='EM_09'?3:2):t.generators.length).map(i=>make(t,i))));}
function normalize(str){return String(str??'').replace(/\r\n/g,'\n').split('\n').map(x=>x.trimEnd()).join('\n').replace(/^\n+|\n+$/g,'');}
function check(q,response){if(q.type==='multi')return Array.isArray(response)&&response.length===q.answer.length&&q.answer.every(x=>response.includes(x));if(q.type==='drop')return Array.isArray(response)&&response.length===q.answer.length&&q.answer.every((x,i)=>x===response[i]);if(q.type==='fill')return normalize(response)===normalize(q.answer);return response===q.answer;}
const api={topics,make,session,check,shuffle,hint};if(typeof module!=='undefined')module.exports=api;else root.ReviewBank=api;
})(typeof window!=='undefined'?window:globalThis);
