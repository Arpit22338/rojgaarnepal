export const COURSE_MODULES = [
  {
    id: "module-1",
    title: "Module 1: Getting Started in the Browser",
    duration: "1 Hour",
    lessons: [
      {
        id: "l1-1",
        title: "What is Python and What Can You Build With It?",
        content: `### What is Python?
Python is a high-level programming language that is easy to read, easy to write, and extremely powerful. It is used by beginners and professionals around the world.

### What can you build?
*   Web applications and APIs
*   Automation scripts and tools
*   Data science and machine learning projects
*   Desktop and command-line tools
*   Bots, scripts, and small utilities
*   Games and experiments

### Design Philosophy
Python’s design philosophy focuses on readability and simplicity. Code often looks like readable English.

\`\`\`python
print("Hello, world!")
\`\`\`

### Why Python?
Python is used by many big companies like Google, Instagram, Netflix, Spotify, and many more. It is also very popular in research, AI, and automation. That means learning Python can open doors to jobs, freelancing, or building your own projects.

### Course Overview
In this course, you will learn Python step by step. We will start in a browser-based playground (no installation required). You will:
1.  Learn basic concepts like variables, data types, operators, and control flow.
2.  Practice using a playground with small, focused challenges.
3.  Build mini programs and a small project.
4.  At the end, learn how to install Python on your own computer and continue coding offline.`,
        quiz: {
          question: "Python is mainly known for being:",
          options: [
            "Very complex and unreadable",
            "Easy to read and beginner-friendly",
            "Only for building games",
            "Only for hackers"
          ],
          answer: 1
        },
        challenge: {
          description: "Goal: Print a simple introduction message.\n\nInstruction: Write a Python program that prints exactly:\nI am learning Python!\n\n(No extra spaces, no extra text.)",
          initialCode: "# Write your code below\n",
          expectedOutput: "I am learning Python!"
        }
      },
      {
        id: "l1-2",
        title: "The print() Function and Basic Output",
        content: `### The print() Function
The \`print()\` function is one of the first and most important things you’ll use in Python. It sends text or values to the output area so you can see what your program is doing.

### Examples
\`\`\`python
print("Hello")
print("Welcome to Python")
\`\`\`

**Output:**
\`\`\`text
Hello
Welcome to Python
\`\`\`

You can print numbers as well:
\`\`\`python
print(10)
print(3.14)
\`\`\`

You can print multiple values at once:
\`\`\`python
print("The sum of 2 and 3 is", 2 + 3)
\`\`\`
**Output:** \`The sum of 2 and 3 is 5\`

### Strings
Python uses quotes (\`" "\` or \`' '\`) to represent text (called strings). Anything inside quotes is treated as text, not as code.

If you forget the quotes around text, you will get an error:
\`\`\`python
print(Hello) # Error! Python thinks Hello is a variable.
\`\`\`
`,
        quiz: {
          question: "Which of the following is a correct use of print() to show the word Python?",
          options: [
            "print(Python)",
            "print(\"Python\")",
            "print('Python)",
            "print(Python\")"
          ],
          answer: 1
        },
        challenge: {
          description: "Goal: Practice printing multiple lines.\n\nTask: Print exactly the following 3 lines:\nPython is fun\nI am learning step by step\n print() shows output\n\n(Notice there is a space before the word print() on the third line.)",
          initialCode: "# Print the 3 lines below\n",
          expectedOutput: "Python is fun\nI am learning step by step\n print() shows output"
        }
      },
      {
        id: "l1-3",
        title: "Variables and Basic Data Types",
        content: `### Variables
A variable is a name that stores a value. It’s like a labeled box that can hold data.

\`\`\`python
x = 10
y = 5
message = "Hello"
\`\`\`

Here:
*   \`x\` is a variable holding the integer value 10.
*   \`y\` holds 5.
*   \`message\` holds the string "Hello".

You can use variables in expressions:
\`\`\`python
total = x + y
print(total) # Output: 15
\`\`\`

### Basic Data Types
*   **int:** whole numbers (e.g., 10, -3, 0)
*   **float:** decimal numbers (e.g., 3.14, -0.5)
*   **str:** strings of text (e.g., "name", "Hello")
*   **bool:** True or False values

\`\`\`python
age = 17          # int
height = 5.8      # float
name = "Arjun"    # string
is_student = True # boolean
\`\`\`

You can check the type with \`type()\`:
\`\`\`python
print(type(age))      # <class 'int'>
\`\`\`
`,
        quiz: {
          question: "Which of the following is a valid variable name in Python?",
          options: [
            "1name",
            "my-name",
            "my_name",
            "my name"
          ],
          answer: 2
        },
        challenge: {
          description: "Goal: Create and print variables.\n\nTask:\n1. Create a variable `name` with value 'Sam'.\n2. Create a variable `age` with value 17.\n3. Print: 'My name is Sam and I am 17 years old.'",
          initialCode: "name = \"Sam\"\nage = 17\n# Print the message using these variables\n",
          expectedOutput: "My name is Sam and I am 17 years old."
        }
      },
      {
        id: "l1-4",
        title: "User Input with input()",
        content: `### User Input
So far we have printed fixed messages and values. Now we want the user to enter something. In Python, we use \`input()\` to let the user type into the program.

\`\`\`python
name = input("Enter your name: ")
print("Hello,", name)
\`\`\`

**Output (if user types Sita):**
\`\`\`text
Enter your name: Sita
Hello, Sita
\`\`\`

### Converting Input
By default, \`input()\` returns a string. If you want a number, you must convert it:

\`\`\`python
age = input("Enter your age: ")
age = int(age)  # convert string to int
print("Next year you will be", age + 1)
\`\`\`

Be careful: if the user types something that is not a number, \`int()\` will cause an error.
`,
        quiz: {
          question: "What does the input() function do?",
          options: [
            "Prints output",
            "Stops the program",
            "Reads text from the user",
            "Converts text to integer"
          ],
          answer: 2
        },
        challenge: {
          description: "Goal: Greet a user and calculate their age next year.\n\nTask:\n1. Set name = 'Ravi'\n2. Set age = 19\n3. Print: 'Hello Ravi, next year you will be 20'",
          initialCode: "# Simulate input by setting variables directly\nname = \"Ravi\"\nage = 19\n\n# Calculate next year's age and print\n",
          expectedOutput: "Hello Ravi, next year you will be 20"
        }
      },
      {
        id: "l1-5",
        title: "Overview of Operators in Python",
        content: `### Operators
Operators are symbols that perform operations on values and variables.

### Categories
*   **Arithmetic operators:** +, -, *, /, //, %, **
*   **Comparison operators:** ==, !=, <, >, <=, >=
*   **Logical operators:** and, or, not
*   **Assignment operators:** =, +=, -=, *=, etc.
*   **Membership operators:** in, not in
*   **Identity operators:** is, is not

### Examples
**Arithmetic:**
\`\`\`python
a = 10
b = 3
print(a + b)  # 13
\`\`\`

**Comparison:**
\`\`\`python
print(a > b)   # True
print(a == 10) # True
\`\`\`

**Logical:**
\`\`\`python
x = True
y = False
print(x and y) # False
\`\`\`
`,
        quiz: {
          question: "Which of these is a comparison operator?",
          options: [
            "+",
            "==",
            "and",
            "="
          ],
          answer: 1
        },
        challenge: {
          description: "Goal: Preview different operator results.\n\nTask:\nSet a = 8 and b = 3.\nPrint:\n1. a + b\n2. a - b\n3. a * b\n4. a > b\n5. a == b",
          initialCode: "a = 8\nb = 3\n# Print the 5 results below\n",
          expectedOutput: "11\n5\n24\nTrue\nFalse"
        }
      }
    ]
  },
  {
    id: "module-2",
    title: "Module 2: Numbers, Strings & Operators",
    duration: "1.5 Hours",
    lessons: [
      {
        id: "l2-1",
        title: "Arithmetic Operators",
        content: `### Arithmetic Operators
Arithmetic operators let you perform math operations:

• \`+\` addition
• \`-\` subtraction
• \`*\` multiplication
• \`/\` division (float division)
• \`//\` floor division (integer result)
• \`%\` modulus (remainder)
• \`**\` exponent (power)

### Examples
\`\`\`python
a = 10
b = 3

print(a + b)   # 13
print(a / b)   # 3.3333...
print(a // b)  # 3
print(a % b)   # 1
print(a ** b)  # 1000
\`\`\`

### Use Cases
• \`/\` is useful when you care about decimals.
• \`//\` is useful when you only want the integer part.
• \`%\` is useful for checking divisibility (e.g., even/odd).
`,
        quiz: {
          question: "What is the result of 17 % 5?",
          options: [
            "2",
            "3",
            "5",
            "7"
          ],
          answer: 1
        },
        challenge: {
          description: "Goal: Practice arithmetic.\n\nTask:\nCreate x = 15 and y = 4.\nPrint:\n1. The sum of x and y\n2. The difference x - y\n3. The product x * y\n4. The floor division x // y\n5. The modulus x % y",
          initialCode: "x = 15\ny = 4\n# Print results\n",
          expectedOutput: "19\n11\n60\n3\n3"
        }
      },
      {
        id: "l2-2",
        title: "Comparison Operators",
        content: `### Comparison Operators
Comparison operators compare two values and return a boolean (\`True\` or \`False\`):

• \`==\` equal to
• \`!=\` not equal to
• \`<\` less than
• \`>\` greater than
• \`<=\` less than or equal to
• \`>=\` greater than or equal to

### Examples
\`\`\`python
a = 10
b = 7

print(a == b)  # False
print(a != b)  # True
print(a > b)   # True
\`\`\`

We use comparison operators in conditions (if statements, loops, etc.).
`,
        quiz: {
          question: "If a = 5 and b = 7, what is a >= b?",
          options: [
            "True",
            "False"
          ],
          answer: 1
        },
        challenge: {
          description: "Goal: Compare two numbers.\n\nTask:\nSet a = 10 and b = 5.\nPrint:\n1. \"a is greater than b: \" followed by the result of a > b\n2. \"a is equal to b: \" followed by the result of a == b",
          initialCode: "a = 10\nb = 5\nprint(\"a is greater than b:\", a > b)\nprint(\"a is equal to b:\", a == b)",
          expectedOutput: "a is greater than b: True\na is equal to b: False"
        }
      },
      {
        id: "l2-3",
        title: "Logical Operators",
        content: `### Logical Operators
Logical operators combine boolean values:

• \`and\` – True if both conditions are True
• \`or\` – True if at least one condition is True
• \`not\` – reverses True/False

### Examples
\`\`\`python
is_student = True
has_id = False

print(is_student and has_id) # False
print(is_student or has_id)  # True
print(not is_student)        # False
\`\`\`

### With Comparisons
\`\`\`python
age = 20
grade = "A"

print(age >= 18 and grade == "A")  # True
\`\`\`
`,
        quiz: {
          question: "If x = True and y = False, what is x and y?",
          options: [
            "True",
            "False"
          ],
          answer: 1
        },
        challenge: {
          description: "Goal: Check eligibility.\n\nTask:\nSet age = 20 and has_id = \"yes\".\nUse logical operators:\nIf age >= 18 and has_id == \"yes\", print \"Eligible for discount\".\nOtherwise, print \"Not eligible\".",
          initialCode: "age = 20\nhas_id = \"yes\"\n\nif age >= 18 and has_id == \"yes\":\n    print(\"Eligible for discount\")\nelse:\n    print(\"Not eligible\")",
          expectedOutput: "Eligible for discount"
        }
      },
      {
        id: "l2-4",
        title: "Assignment Operators",
        content: `### Assignment Operators
Basic assignment uses \`=\`.

Compound assignment operators update a variable based on its current value:
• \`x += 1\` → \`x = x + 1\`
• \`x -= 2\` → \`x = x - 2\`
• \`x *= 3\` → \`x = x * 3\`
• \`x /= 4\` → \`x = x / 4\`

### Example
\`\`\`python
x = 5
x += 2  # x = 7
x *= 3  # x = 21
\`\`\`
`,
        quiz: {
          question: "If x = 10 and then we do x += 5, what is x now?",
          options: [
            "5",
            "10",
            "15",
            "20"
          ],
          answer: 2
        },
        challenge: {
          description: "Goal: Update a score.\n\nTask:\n1. Start with score = 0.\n2. Add 10 points (using +=).\n3. Multiply the score by 2 (using *=).\n4. Subtract 5 points (using -=).\n5. Print the final score.",
          initialCode: "score = 0\n# Perform operations\n\nprint(score)",
          expectedOutput: "15"
        }
      },
      {
        id: "l2-5",
        title: "Membership and Identity Operators",
        content: `### Membership Operators
• \`in\` – True if a value exists in a sequence
• \`not in\` – True if a value does not exist in a sequence

\`\`\`python
name = "Python"
print("P" in name)      # True
\`\`\`

### Identity Operators
• \`is\` – True if two variables refer to the same object in memory
• \`is not\` – True if they do not refer to the same object

\`\`\`python
a = [1, 2, 3]
b = a
print(a is b)  # True
\`\`\`
`,
        quiz: {
          question: "What does \"a\" in \"cat\" return?",
          options: [
            "True",
            "False"
          ],
          answer: 0
        },
        challenge: {
          description: "Goal: Check membership.\n\nTask:\nCreate a list fruits = [\"apple\", \"banana\", \"orange\"].\nSet fruit_name = \"apple\".\nIf fruit_name is in the list, print \"We have that fruit\".\nOtherwise, print \"Not available\".",
          initialCode: "fruits = [\"apple\", \"banana\", \"orange\"]\nfruit_name = \"apple\"\n\nif fruit_name in fruits:\n    print(\"We have that fruit\")\nelse:\n    print(\"Not available\")",
          expectedOutput: "We have that fruit"
        }
      }
    ]
  },
  {
    id: "module-3",
    title: "Module 3: Control Flow",
    duration: "1.5 Hours",
    lessons: [
      {
        id: "l3-1",
        title: "if / elif / else",
        content: `### Control Flow
Control flow lets your program make decisions. The \`if\` statement executes code only when a condition is True.

\`\`\`python
age = 18
if age >= 18:
    print("Adult")
else:
    print("Minor")
\`\`\`

### elif
\`elif\` allows multiple conditions:

\`\`\`python
score = 85
if score >= 90:
    print("A")
elif score >= 80:
    print("B")
else:
    print("Needs Improvement")
\`\`\`

**Indentation** (spaces at the start of lines) is very important in Python.
`,
        quiz: {
          question: "What happens if the first if condition is True?",
          options: [
            "Python still checks all other elif conditions",
            "Python skips other elif/else blocks",
            "Python raises an error",
            "Nothing happens"
          ],
          answer: 1
        },
        challenge: {
          description: "Goal: Grade classifier.\n\nTask:\nSet score = 85.\nPrint:\n\"A\" if score >= 90\n\"B\" if score >= 80\n\"C\" if score >= 70\n\"D\" if score >= 60\n\"F\" otherwise",
          initialCode: "score = 85\n# Write if/elif/else logic here\n",
          expectedOutput: "B"
        }
      },
      {
        id: "l3-2",
        title: "while Loops",
        content: `### while Loops
A \`while\` loop repeats a block of code while a condition is True.

\`\`\`python
count = 1
while count <= 5:
    print("Count:", count)
    count += 1
\`\`\`

**Output:**
\`\`\`
Count: 1
Count: 2
...
\`\`\`

Be careful: if the condition never becomes False, you get an infinite loop.
`,
        quiz: {
          question: "What is a risk with while loops?",
          options: [
            "They cannot repeat",
            "They always run only once",
            "They can run forever if condition never changes",
            "They cannot use variables"
          ],
          answer: 2
        },
        challenge: {
          description: "Goal: Simple countdown.\n\nTask:\nSet n = 5.\nUse a while loop to print numbers from n down to 1.\nFinally print \"Blast off!\".",
          initialCode: "n = 5\nwhile n >= 1:\n    print(n)\n    n -= 1\nprint(\"Blast off!\")",
          expectedOutput: "5\n4\n3\n2\n1\nBlast off!"
        }
      },
      {
        id: "l3-3",
        title: "for Loops",
        content: `### for Loops
A \`for\` loop iterates over sequences (like lists, strings, ranges).

### Using range()
\`\`\`python
for i in range(5):
    print(i)
\`\`\`
Output: 0, 1, 2, 3, 4

### Over a List
\`\`\`python
fruits = ["apple", "banana", "mango"]
for fruit in fruits:
    print(fruit)
\`\`\`
`,
        quiz: {
          question: "What does range(3) generate?",
          options: [
            "0, 1, 2",
            "1, 2, 3",
            "0, 1, 2, 3",
            "3, 2, 1"
          ],
          answer: 0
        },
        challenge: {
          description: "Goal: Print a multiplication table.\n\nTask:\nSet n = 3.\nUse a for loop to print the multiplication table for n from 1 to 10.\nFormat: \"3 x 1 = 3\"",
          initialCode: "n = 3\nfor i in range(1, 11):\n    print(f\"{n} x {i} = {n*i}\")",
          expectedOutput: "3 x 1 = 3\n3 x 2 = 6\n3 x 3 = 9\n3 x 4 = 12\n3 x 5 = 15\n3 x 6 = 18\n3 x 7 = 21\n3 x 8 = 24\n3 x 9 = 27\n3 x 10 = 30"
        }
      }
    ]
  },
  {
    id: "module-4",
    title: "Module 4: Collections",
    duration: "1 Hour",
    lessons: [
      {
        id: "l4-1",
        title: "Lists",
        content: `### Lists
A list is an ordered, changeable collection of items.

\`\`\`python
numbers = [10, 20, 30]
fruits = ["apple", "banana", "orange"]
\`\`\`

### Accessing Items
\`\`\`python
print(fruits[0]) # "apple"
\`\`\`

### Modifying Lists
\`\`\`python
fruits[1] = "mango"
fruits.append("grape")
fruits.remove("apple")
\`\`\`
`,
        quiz: {
          question: "What is the index of the first element in a Python list?",
          options: [
            "-1",
            "0",
            "1",
            "2"
          ],
          answer: 1
        },
        challenge: {
          description: "Goal: Manage a simple to-do list.\n\nTask:\n1. Create an empty list tasks = [].\n2. Append \"Task 1\", \"Task 2\", and \"Task 3\".\n3. Print \"Your tasks:\" followed by each task on a new line.",
          initialCode: "tasks = []\ntasks.append(\"Task 1\")\ntasks.append(\"Task 2\")\ntasks.append(\"Task 3\")\n\nprint(\"Your tasks:\")\nfor task in tasks:\n    print(task)",
          expectedOutput: "Your tasks:\nTask 1\nTask 2\nTask 3"
        }
      },
      {
        id: "l4-2",
        title: "Tuples, Sets, and Dictionaries",
        content: `### Tuples
Like lists, but immutable (cannot be changed).
\`\`\`python
colors = ("red", "green", "blue")
\`\`\`

### Sets
Unordered collection of unique elements.
\`\`\`python
numbers = {1, 2, 2, 3}
print(numbers) # {1, 2, 3}
\`\`\`

### Dictionaries
Key-value pairs.
\`\`\`python
student = {
    "name": "Arjun",
    "age": 20,
    "grade": "A"
}
print(student["name"]) # "Arjun"
\`\`\`

You can add values:
\`\`\`python
student["city"] = "Kathmandu"
\`\`\`
`,
        quiz: {
          question: "Which structure stores key-value pairs?",
          options: [
            "list",
            "tuple",
            "dictionary",
            "set"
          ],
          answer: 2
        },
        challenge: {
          description: "Goal: Store and display student info.\n\nTask:\nCreate a dictionary student with:\nname: \"Arjun\"\nage: 20\ncourse: \"Python\"\n\nPrint: \"Arjun is 20 years old and studying Python.\"",
          initialCode: "student = {\"name\": \"Arjun\", \"age\": 20, \"course\": \"Python\"}\nprint(f\"{student['name']} is {student['age']} years old and studying {student['course']}.\")",
          expectedOutput: "Arjun is 20 years old and studying Python."
        }
      }
    ]
  },
  {
    id: "module-5",
    title: "Module 5: Functions",
    duration: "1 Hour",
    lessons: [
      {
        id: "l5-1",
        title: "Defining and Calling Functions",
        content: `### Functions
Functions are reusable blocks of code.

\`\`\`python
def greet():
    print("Hello!")

greet()
\`\`\`

### Parameters
Functions can take parameters:
\`\`\`python
def greet(name):
    print("Hello", name)

greet("Ravi")
\`\`\`
`,
        quiz: {
          question: "What keyword is used to define a function in Python?",
          options: [
            "func",
            "def",
            "function",
            "lambda"
          ],
          answer: 1
        },
        challenge: {
          description: "Goal: Write a greet function.\n\nTask:\n1. Define a function greet(name) that prints: \"Hello <name>, welcome to Python.\"\n2. Call greet(\"Ravi\").",
          initialCode: "def greet(name):\n    print(f\"Hello {name}, welcome to Python.\")\n\ngreet(\"Ravi\")",
          expectedOutput: "Hello Ravi, welcome to Python."
        }
      },
      {
        id: "l5-2",
        title: "Return Values and Simple Calculators",
        content: `### Return Values
Functions can return values using \`return\`.

\`\`\`python
def add(a, b):
    return a + b

result = add(3, 5)
print(result)  # 8
\`\`\`
`,
        quiz: {
          question: "What does a function return if there is no return statement?",
          options: [
            "0",
            "True",
            "None",
            "\"\""
          ],
          answer: 2
        },
        challenge: {
          description: "Goal: Build a simple calculator with functions.\n\nTask:\nDefine functions add(a,b), subtract(a,b), multiply(a,b), divide(a,b).\nSet a=10, b=2.\nPrint results of all four operations.",
          initialCode: "def add(a, b): return a + b\ndef subtract(a, b): return a - b\ndef multiply(a, b): return a * b\ndef divide(a, b): return a / b\n\na = 10\nb = 2\nprint(add(a, b))\nprint(subtract(a, b))\nprint(multiply(a, b))\nprint(divide(a, b))",
          expectedOutput: "12\n8\n20\n5.0"
        }
      }
    ]
  },
  {
    id: "module-6",
    title: "Module 6: Intro to OOP & Final Steps",
    duration: "1 Hour",
    lessons: [
      {
        id: "l6-1",
        title: "Basic Classes and Objects",
        content: `### Classes and Objects
Classes are blueprints for objects.

\`\`\`python
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def introduce(self):
        print(f"My name is {self.name} and I am {self.age} years old.")

p = Person("Ravi", 21)
p.introduce()
\`\`\`
`,
        quiz: {
          question: "What is the name of the special method that runs when an object is created?",
          options: [
            "start",
            "init",
            "create",
            "main"
          ],
          answer: 1
        },
        challenge: {
          description: "Goal: Create a simple class.\n\nTask:\n1. Define a Student class with attributes: name, course.\n2. Add a method info() that prints \"<name> is studying <course>.\"\n3. Create an object with name=\"Sita\", course=\"Math\".\n4. Call info().",
          initialCode: "class Student:\n    def __init__(self, name, course):\n        self.name = name\n        self.course = course\n    def info(self):\n        print(f\"{self.name} is studying {self.course}.\")\n\ns = Student(\"Sita\", \"Math\")\ns.info()",
          expectedOutput: "Sita is studying Math."
        }
      },
      {
        id: "l6-2",
        title: "Installing Python Locally and Next Steps",
        content: `### Moving to Local Development
Up to now, you have used a browser-based playground. Now, it is time to install Python on your own computer.

### Steps
1.  Go to [python.org](https://python.org).
2.  Download the installer for your OS.
3.  Run the installer and **check "Add Python to PATH"**.
4.  Open a terminal and type \`python --version\`.

### Running Code
You can now create \`.py\` files on your computer and run them using:
\`\`\`bash
python my_script.py
\`\`\`
`,
        quiz: {
          question: "What website is the official source for downloading Python?",
          options: [
            "python.com",
            "python.org",
            "pythons.net",
            "py.com"
          ],
          answer: 1
        },
        challenge: {
          description: "Goal: Confirmation.\n\nTask: This step requires no code. If you have understood the installation steps, print \"Installed\".",
          initialCode: "print(\"Installed\")",
          expectedOutput: "Installed"
        }
      }
    ]
  }
];

export const FINAL_EXAM_DATA = [
  {
    id: "q1",
    question: "What is the correct file extension for Python files?",
    options: [".pyt", ".pt", ".py", ".python"],
    answer: 2,
    relatedLessonId: "l6-2"
  },
  {
    id: "q2",
    question: "Which function is used to output text to the screen?",
    options: ["echo()", "print()", "write()", "log()"],
    answer: 1,
    relatedLessonId: "l1-2"
  },
  {
    id: "q3",
    question: "How do you create a variable with the numeric value 5?",
    options: ["x = 5", "int x = 5", "x : 5", "var x = 5"],
    answer: 0,
    relatedLessonId: "l1-3"
  },
  {
    id: "q4",
    question: "Which operator is used for exponentiation (power)?",
    options: ["^", "**", "//", "exp"],
    answer: 1,
    relatedLessonId: "l2-1"
  },
  {
    id: "q5",
    question: "What is the result of 10 // 3?",
    options: ["3.33", "3", "1", "3.0"],
    answer: 1,
    relatedLessonId: "l2-1"
  },
  {
    id: "q6",
    question: "Which of these is a valid list?",
    options: ["(1, 2, 3)", "{1, 2, 3}", "[1, 2, 3]", "<1, 2, 3>"],
    answer: 2,
    relatedLessonId: "l4-1"
  },
  {
    id: "q7",
    question: "How do you start a while loop?",
    options: ["while x > 5:", "while (x > 5)", "loop while x > 5", "while x > 5 then"],
    answer: 0,
    relatedLessonId: "l3-2"
  },
  {
    id: "q8",
    question: "Which keyword is used to define a function?",
    options: ["function", "def", "fun", "define"],
    answer: 1,
    relatedLessonId: "l5-1"
  },
  {
    id: "q9",
    question: "What is the output of print(type(3.14))?",
    options: ["<class 'int'>", "<class 'float'>", "<class 'double'>", "<class 'number'>"],
    answer: 1,
    relatedLessonId: "l1-3"
  },
  {
    id: "q10",
    question: "Which method adds an item to the end of a list?",
    options: ["add()", "insert()", "push()", "append()"],
    answer: 3,
    relatedLessonId: "l4-1"
  }
];
