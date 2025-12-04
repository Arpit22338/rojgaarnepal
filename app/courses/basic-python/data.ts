export const COURSE_MODULES = [
  {
    id: "module-1",
    title: "Module 1: Python Basics & Setup",
    duration: "4 Hours",
    lessons: [
      {
        id: "l1-1",
        title: "Introduction to Python & Installation",
        content: `Python is a high-level, interpreted programming language known for its simplicity and readability.
        
        **Installation:**
        1. Go to python.org
        2. Download the latest version
        3. Run installer and check "Add Python to PATH"`,
        quiz: {
          question: "What must you check during installation on Windows?",
          options: ["Install for all users", "Add Python to PATH", "Download debug symbols", "Install documentation"],
          answer: 1
        }
      },
      {
        id: "l1-2",
        title: "Your First Python Program",
        content: `The classic "Hello, World!" program.
        
        \`\`\`python
        print("Hello, World!")
        \`\`\`
        
        The \`print()\` function outputs text to the console.`,
        quiz: {
          question: "Which function is used to output text?",
          options: ["echo()", "console.log()", "print()", "write()"],
          answer: 2
        }
      },
      {
        id: "l1-3",
        title: "Variables and Data Types",
        content: `Variables store data. Python is dynamically typed.
        
        **Common Types:**
        - \`str\`: Text ("Hello")
        - \`int\`: Integers (10)
        - \`float\`: Decimals (10.5)
        - \`bool\`: Boolean (True/False)`,
        quiz: {
          question: "Which type represents decimal numbers?",
          options: ["int", "decimal", "float", "double"],
          answer: 2
        }
      }
    ]
  },
  {
    id: "module-2",
    title: "Module 2: Control Flow & Logic",
    duration: "6 Hours",
    lessons: [
      {
        id: "l2-1",
        title: "If, Elif, Else Statements",
        content: `Control the flow of your program based on conditions.
        
        \`\`\`python
        age = 18
        if age >= 18:
            print("Adult")
        else:
            print("Minor")
        \`\`\``,
        quiz: {
          question: "Which keyword checks for an alternative condition?",
          options: ["else if", "elif", "elseif", "otherwise"],
          answer: 1
        }
      },
      {
        id: "l2-2",
        title: "Loops (For & While)",
        content: `Loops allow you to repeat code.
        
        **For Loop:**
        \`\`\`python
        for i in range(5):
            print(i)
        \`\`\`
        
        **While Loop:**
        \`\`\`python
        while x < 5:
            x += 1
        \`\`\``,
        quiz: {
          question: "Which function generates a sequence of numbers?",
          options: ["seq()", "list()", "range()", "generate()"],
          answer: 2
        }
      }
    ]
  },
  {
    id: "module-3",
    title: "Module 3: Data Structures",
    duration: "8 Hours",
    lessons: [
      {
        id: "l3-1",
        title: "Lists & Tuples",
        content: `**Lists** are mutable (changeable) sequences.
        \`my_list = [1, 2, 3]\`
        
        **Tuples** are immutable (unchangeable).
        \`my_tuple = (1, 2, 3)\``,
        quiz: {
          question: "Which data structure is immutable?",
          options: ["List", "Dictionary", "Set", "Tuple"],
          answer: 3
        }
      },
      {
        id: "l3-2",
        title: "Dictionaries & Sets",
        content: `**Dictionaries** store key-value pairs.
        \`user = {"name": "John", "age": 30}\`
        
        **Sets** store unique values.
        \`unique_nums = {1, 2, 3, 3} # Result: {1, 2, 3}\``,
        quiz: {
          question: "How do you access a value in a dictionary?",
          options: ["By index", "By key", "By value", "By order"],
          answer: 1
        }
      }
    ]
  },
  {
    id: "module-4",
    title: "Module 4: Functions & Modules",
    duration: "6 Hours",
    lessons: [
      {
        id: "l4-1",
        title: "Defining Functions",
        content: `Functions are reusable blocks of code.
        
        \`\`\`python
        def greet(name):
            return f"Hello, {name}"
        \`\`\``,
        quiz: {
          question: "Which keyword defines a function?",
          options: ["func", "function", "def", "define"],
          answer: 2
        }
      },
      {
        id: "l4-2",
        title: "Lambda Functions",
        content: `Small anonymous functions.
        
        \`add = lambda x, y: x + y\``,
        quiz: {
          question: "What is a lambda function?",
          options: ["A large function", "An anonymous function", "A loop", "A module"],
          answer: 1
        }
      }
    ]
  },
  {
    id: "module-5",
    title: "Module 5: Object Oriented Programming (OOP)",
    duration: "10 Hours",
    lessons: [
      {
        id: "l5-1",
        title: "Classes & Objects",
        content: `Python is an object-oriented language.
        
        \`\`\`python
        class Dog:
            def __init__(self, name):
                self.name = name
        \`\`\``,
        quiz: {
          question: "What is the constructor method in Python?",
          options: ["__construct__", "__init__", "__start__", "__setup__"],
          answer: 1
        }
      },
      {
        id: "l5-2",
        title: "Inheritance & Polymorphism",
        content: `Classes can inherit attributes and methods from other classes.`,
        quiz: {
          question: "Which concept allows a child class to use parent methods?",
          options: ["Encapsulation", "Inheritance", "Polymorphism", "Abstraction"],
          answer: 1
        }
      }
    ]
  },
  {
    id: "module-6",
    title: "Module 6: File Handling & Error Handling",
    duration: "4 Hours",
    lessons: [
      {
        id: "l6-1",
        title: "Reading & Writing Files",
        content: `Use \`open()\` to work with files.
        
        \`\`\`python
        with open("file.txt", "r") as f:
            content = f.read()
        \`\`\``,
        quiz: {
          question: "Which mode opens a file for writing?",
          options: ["'r'", "'w'", "'a'", "'x'"],
          answer: 1
        }
      },
      {
        id: "l6-2",
        title: "Try, Except, Finally",
        content: `Handle errors gracefully.
        
        \`\`\`python
        try:
            print(x)
        except:
            print("An error occurred")
        \`\`\``,
        quiz: {
          question: "Which block executes regardless of error?",
          options: ["try", "except", "else", "finally"],
          answer: 3
        }
      }
    ]
  },
  {
    id: "module-7",
    title: "Module 7: Final Project & Advanced Topics",
    duration: "6 Hours",
    lessons: [
      {
        id: "l7-1",
        title: "Building a Real Application",
        content: `Combine everything you learned to build a Task Manager CLI app.`,
        quiz: {
          question: "What is the best way to structure a large project?",
          options: ["One big file", "Multiple modules/packages", "Global variables", "No structure"],
          answer: 1
        }
      }
    ]
  }
];

export const FINAL_EXAM_DATA = [
  { id: 1, question: "What is the correct file extension for Python files?", options: [".pt", ".pyt", ".py", ".python"], answer: 2, relatedLessonId: "l1-1" },
  { id: 2, question: "Which operator is used for exponentiation in Python?", options: ["^", "**", "//", "exp()"], answer: 1, relatedLessonId: "l1-3" },
  { id: 3, question: "How do you create a function in Python?", options: ["function x():", "def x():", "create x():", "func x():"], answer: 1, relatedLessonId: "l4-1" },
  { id: 4, question: "Which collection is ordered, changeable, and allows duplicate members?", options: ["Set", "Dictionary", "Tuple", "List"], answer: 3, relatedLessonId: "l3-1" },
  { id: 5, question: "What is the output of: print(10 // 3)?", options: ["3.33", "3", "4", "3.0"], answer: 1, relatedLessonId: "l1-3" },
  { id: 6, question: "Which method adds an item to the end of a list?", options: ["push()", "add()", "append()", "insert()"], answer: 2, relatedLessonId: "l3-1" },
  { id: 7, question: "How do you start a comment in Python?", options: ["//", "/*", "#", "<!--"], answer: 2, relatedLessonId: "l1-2" },
  { id: 8, question: "Which function returns the length of a list?", options: ["count()", "size()", "length()", "len()"], answer: 3, relatedLessonId: "l3-1" },
  { id: 9, question: "What is the result of 'Hello'[1]?", options: ["H", "e", "l", "o"], answer: 1, relatedLessonId: "l1-3" },
  { id: 10, question: "Which keyword is used to import a module?", options: ["include", "import", "require", "using"], answer: 1, relatedLessonId: "l1-1" },
  { id: 11, question: "What does 'pip' stand for?", options: ["Python Install Package", "Pip Installs Packages", "Package Installer Python", "None of the above"], answer: 1, relatedLessonId: "l1-1" },
  { id: 12, question: "Which statement is used to stop a loop?", options: ["stop", "exit", "break", "return"], answer: 2, relatedLessonId: "l2-2" },
  { id: 13, question: "What is a correct syntax to output 'Hello World' in Python?", options: ["p('Hello World')", "echo 'Hello World'", "print('Hello World')", "Console.WriteLine('Hello World')"], answer: 2, relatedLessonId: "l1-2" },
  { id: 14, question: "How do you insert COMMENTS in Python code?", options: ["/* This is a comment */", "# This is a comment", "// This is a comment", "<!-- This is a comment -->"], answer: 1, relatedLessonId: "l1-2" },
  { id: 15, question: "Which one is NOT a legal variable name?", options: ["_myvar", "my_var", "Myvar", "my-var"], answer: 3, relatedLessonId: "l1-3" },
  { id: 16, question: "How do you create a variable with the numeric value 5?", options: ["x = 5", "x = int(5)", "Both are correct", "None are correct"], answer: 2, relatedLessonId: "l1-3" },
  { id: 17, question: "What is the correct file extension for Python files?", options: [".pyth", ".pt", ".py", ".pyt"], answer: 2, relatedLessonId: "l1-1" },
  { id: 18, question: "How do you create a dictionary?", options: ["{}", "[]", "()", "<>"], answer: 0, relatedLessonId: "l3-3" },
  { id: 19, question: "Which operator is used to multiply numbers?", options: ["%", "/", "#", "*"], answer: 3, relatedLessonId: "l1-3" },
  { id: 20, question: "Which operator can be used to compare two values?", options: ["<>", "==", "=", "><"], answer: 1, relatedLessonId: "l2-1" },
  { id: 21, question: "Which of these collections defines a LIST?", options: ["{'name': 'apple', 'color': 'green'}", "('apple', 'banana', 'cherry')", "{'apple', 'banana', 'cherry'}", "['apple', 'banana', 'cherry']"], answer: 3, relatedLessonId: "l3-1" },
  { id: 22, question: "Which of these collections defines a TUPLE?", options: ["{'name': 'apple', 'color': 'green'}", "('apple', 'banana', 'cherry')", "{'apple', 'banana', 'cherry'}", "['apple', 'banana', 'cherry']"], answer: 1, relatedLessonId: "l3-2" },
  { id: 23, question: "Which of these collections defines a SET?", options: ["{'name': 'apple', 'color': 'green'}", "('apple', 'banana', 'cherry')", "{'apple', 'banana', 'cherry'}", "['apple', 'banana', 'cherry']"], answer: 2, relatedLessonId: "l3-2" },
  { id: 24, question: "Which of these collections defines a DICTIONARY?", options: ["{'name': 'apple', 'color': 'green'}", "('apple', 'banana', 'cherry')", "{'apple', 'banana', 'cherry'}", "['apple', 'banana', 'cherry']"], answer: 0, relatedLessonId: "l3-3" },
  { id: 25, question: "Which collection does not allow duplicate members?", options: ["List", "Tuple", "Set", "All of the above"], answer: 2, relatedLessonId: "l3-2" },
  { id: 26, question: "How do you start a while loop?", options: ["while x > y:", "while (x > y)", "x > y while {", "while x > y {"], answer: 0, relatedLessonId: "l2-2" },
  { id: 27, question: "How do you start a for loop?", options: ["for x in y:", "for each x in y:", "for x > y:", "for x in y {"], answer: 0, relatedLessonId: "l2-2" },
  { id: 28, question: "Which statement is used to stop a loop?", options: ["stop", "return", "break", "exit"], answer: 2, relatedLessonId: "l2-2" },
  { id: 29, question: "Which function is used to read a string from standard input?", options: ["cin", "scanf", "input()", "get()"], answer: 2, relatedLessonId: "l1-2" },
  { id: 30, question: "What is the output of print(2 ** 3)?", options: ["6", "8", "9", "5"], answer: 1, relatedLessonId: "l1-3" }
];
