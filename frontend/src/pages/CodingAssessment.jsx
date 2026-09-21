import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CodingAssessment.css";

const languages = [
  { id: "python", name: "Python 3", icon: "🐍" },
  { id: "java", name: "Java", icon: "☕" },
  { id: "c", name: "C", icon: "C" },
  { id: "cpp", name: "C++", icon: "C++" },
  { id: "javascript", name: "JavaScript", icon: "JS" },
  { id: "typescript", name: "TypeScript", icon: "TS" },
  { id: "csharp", name: "C#", icon: "C#" },
  { id: "go", name: "Go", icon: "Go" }
];

const questionBank = [
  {
    id: 1,
    title: "Find the Maximum Element",
    skill: "Arrays",
    difficulty: "Easy",
    description:
      "Given an array of integers, find and print the maximum element in the array.",
    inputFormat:
      "The first line contains N. The second line contains N space-separated integers.",
    outputFormat: "Print the maximum element.",
    examples: [
      { input: "5\n10 25 7 42 18", output: "42" },
      { input: "4\n-5 -2 -10 -1", output: "-1" }
    ],
    starterCode: {
      python:
        'n = int(input())\narr = list(map(int, input().split()))\n\nprint(max(arr))',
      java:
        "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int max = Integer.MIN_VALUE;\n        for (int i = 0; i < n; i++) {\n            max = Math.max(max, sc.nextInt());\n        }\n        System.out.println(max);\n    }\n}",
      c:
        "#include <stdio.h>\n\nint main() {\n    int n, x, max;\n    scanf(\"%d\", &n);\n    scanf(\"%d\", &max);\n    for (int i = 1; i < n; i++) {\n        scanf(\"%d\", &x);\n        if (x > max) max = x;\n    }\n    printf(\"%d\", max);\n    return 0;\n}",
      cpp:
        "#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> arr(n);\n    for (int &x : arr) cin >> x;\n    cout << *max_element(arr.begin(), arr.end());\n    return 0;\n}",
      javascript:
        "const fs = require('fs');\nconst input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/).map(Number);\nconst n = input[0];\nconst arr = input.slice(1, n + 1);\nconsole.log(Math.max(...arr));",
      typescript:
        "import * as fs from 'fs';\nconst input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/).map(Number);\nconst n = input[0];\nconst arr = input.slice(1, n + 1);\nconsole.log(Math.max(...arr));",
      csharp:
        "using System;\n\nclass Program {\n    static void Main() {\n        string[] input = Console.In.ReadToEnd().Split();\n        int n = int.Parse(input[0]);\n        int max = int.MinValue;\n        for (int i = 1; i <= n; i++) {\n            max = Math.Max(max, int.Parse(input[i]));\n        }\n        Console.WriteLine(max);\n    }\n}",
      go:
        "package main\n\nimport \"fmt\"\n\nfunc main() {\n    var n int\n    fmt.Scan(&n)\n    var x, max int\n    fmt.Scan(&max)\n    for i := 1; i < n; i++ {\n        fmt.Scan(&x)\n        if x > max {\n            max = x\n        }\n    }\n    fmt.Println(max)\n}"
    },
    testCases: [
      { input: "5\n10 25 7 42 18", expected_output: "42" },
      { input: "4\n-5 -2 -10 -1", expected_output: "-1" },
      { input: "6\n12 4 55 23 8 31", expected_output: "55" }
    ]
  },
  {
    id: 2,
    title: "Palindrome Number",
    skill: "Strings",
    difficulty: "Easy",
    description:
      "Given a string, determine whether it is a palindrome. Print true if it is a palindrome, otherwise print false.",
    inputFormat: "The input contains a single string.",
    outputFormat: "Print true or false.",
    examples: [
      { input: "madam", output: "true" },
      { input: "hello", output: "false" }
    ],
    starterCode: {
      python:
        's = input().strip()\n\nprint("true" if s == s[::-1] else "false")',
      java:
        "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.nextLine().trim();\n        String rev = new StringBuilder(s).reverse().toString();\n        System.out.println(s.equals(rev) ? \"true\" : \"false\");\n    }\n}",
      c:
        "#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char s[1000];\n    scanf(\"%999s\", s);\n    int n = strlen(s);\n    int valid = 1;\n    for (int i = 0; i < n / 2; i++) {\n        if (s[i] != s[n - 1 - i]) valid = 0;\n    }\n    printf(valid ? \"true\" : \"false\");\n    return 0;\n}",
      cpp:
        "#include <iostream>\n#include <string>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n    string r = s;\n    reverse(r.begin(), r.end());\n    cout << (s == r ? \"true\" : \"false\");\n    return 0;\n}",
      javascript:
        "const fs = require('fs');\nconst s = fs.readFileSync(0, 'utf8').trim();\nconst r = s.split('').reverse().join('');\nconsole.log(s === r ? 'true' : 'false');",
      typescript:
        "import * as fs from 'fs';\nconst s = fs.readFileSync(0, 'utf8').trim();\nconst r = s.split('').reverse().join('');\nconsole.log(s === r ? 'true' : 'false');",
      csharp:
        "using System;\nusing System.Linq;\n\nclass Program {\n    static void Main() {\n        string s = Console.ReadLine().Trim();\n        string r = new string(s.Reverse().ToArray());\n        Console.WriteLine(s == r ? \"true\" : \"false\");\n    }\n}",
      go:
        "package main\n\nimport (\n    \"fmt\"\n    \"bufio\"\n    \"os\"\n)\n\nfunc main() {\n    in := bufio.NewReader(os.Stdin)\n    var s string\n    fmt.Fscan(in, &s)\n    r := []rune(s)\n    for i, j := 0, len(r)-1; i < j; i, j = i+1, j-1 {\n        r[i], r[j] = r[j], r[i]\n    }\n    original := []rune(s)\n    equal := string(original) == string(r)\n    if equal { fmt.Println(\"true\") } else { fmt.Println(\"false\") }\n}"
    },
    testCases: [
      { input: "madam", expected_output: "true" },
      { input: "hello", expected_output: "false" },
      { input: "level", expected_output: "true" }
    ]
  },
  {
    id: 3,
    title: "Two Sum",
    skill: "Arrays",
    difficulty: "Medium",
    description:
      "Given an array of integers and a target value, find the indices of two different elements whose sum equals the target.",
    inputFormat:
      "The first line contains N. The second line contains N space-separated integers. The third line contains the target.",
    outputFormat:
      "Print the two indices separated by a space. Use zero-based indexing.",
    examples: [
      {
        input: "5\n2 7 11 15 3\n9",
        output: "0 1"
      },
      {
        input: "4\n3 2 4 8\n6",
        output: "1 2"
      }
    ],
    starterCode: {
      python:
        'n = int(input())\narr = list(map(int, input().split()))\ntarget = int(input())\n\nfor i in range(n):\n    for j in range(i + 1, n):\n        if arr[i] + arr[j] == target:\n            print(i, j)\n            break',
      java:
        "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] arr = new int[n];\n        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();\n        int target = sc.nextInt();\n        for (int i = 0; i < n; i++) {\n            for (int j = i + 1; j < n; j++) {\n                if (arr[i] + arr[j] == target) {\n                    System.out.println(i + \" \" + j);\n                    return;\n                }\n            }\n        }\n    }\n}",
      c:
        "#include <stdio.h>\n\nint main() {\n    int n, target;\n    scanf(\"%d\", &n);\n    int arr[n];\n    for (int i = 0; i < n; i++) scanf(\"%d\", &arr[i]);\n    scanf(\"%d\", &target);\n    for (int i = 0; i < n; i++) {\n        for (int j = i + 1; j < n; j++) {\n            if (arr[i] + arr[j] == target) {\n                printf(\"%d %d\", i, j);\n                return 0;\n            }\n        }\n    }\n    return 0;\n}",
      cpp:
        "#include <iostream>\nusing namespace std;\n\nint main() {\n    int n, target;\n    cin >> n;\n    int arr[n];\n    for (int i = 0; i < n; i++) cin >> arr[i];\n    cin >> target;\n    for (int i = 0; i < n; i++) {\n        for (int j = i + 1; j < n; j++) {\n            if (arr[i] + arr[j] == target) {\n                cout << i << \" \" << j;\n                return 0;\n            }\n        }\n    }\n    return 0;\n}",
      javascript:
        "const fs = require('fs');\nconst input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/).map(Number);\nconst n = input[0];\nconst arr = input.slice(1, n + 1);\nconst target = input[n + 1];\n\nfor (let i = 0; i < n; i++) {\n  for (let j = i + 1; j < n; j++) {\n    if (arr[i] + arr[j] === target) {\n      console.log(i, j);\n      process.exit(0);\n    }\n  }\n}",
      typescript:
        "import * as fs from 'fs';\nconst input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/).map(Number);\nconst n = input[0];\nconst arr = input.slice(1, n + 1);\nconst target = input[n + 1];\n\nfor (let i = 0; i < n; i++) {\n  for (let j = i + 1; j < n; j++) {\n    if (arr[i] + arr[j] === target) {\n      console.log(i, j);\n      process.exit(0);\n    }\n  }\n}",
      csharp:
        "using System;\n\nclass Program {\n    static void Main() {\n        string[] input = Console.In.ReadToEnd().Split();\n        int n = int.Parse(input[0]);\n        int[] arr = new int[n];\n        for (int i = 0; i < n; i++) arr[i] = int.Parse(input[i + 1]);\n        int target = int.Parse(input[n + 1]);\n        for (int i = 0; i < n; i++) {\n            for (int j = i + 1; j < n; j++) {\n                if (arr[i] + arr[j] == target) {\n                    Console.WriteLine(i + \" \" + j);\n                    return;\n                }\n            }\n        }\n    }\n}",
      go:
        "package main\n\nimport \"fmt\"\n\nfunc main() {\n    var n, target int\n    fmt.Scan(&n)\n    arr := make([]int, n)\n    for i := 0; i < n; i++ { fmt.Scan(&arr[i]) }\n    fmt.Scan(&target)\n    for i := 0; i < n; i++ {\n        for j := i + 1; j < n; j++ {\n            if arr[i] + arr[j] == target {\n                fmt.Println(i, j)\n                return\n            }\n        }\n    }\n}"
    },
    testCases: [
      {
        input: "5\n2 7 11 15 3\n9",
        expected_output: "0 1"
      },
      {
        input: "4\n3 2 4 8\n6",
        expected_output: "1 2"
      },
      {
        input: "6\n1 5 8 12 3 7\n10",
        expected_output: "1 4"
      }
    ]
  },
  {
    id: 4,
    title: "First Non-Repeating Character",
    skill: "Strings",
    difficulty: "Medium",
    description:
      "Given a string, find the index of the first character that appears only once. Print -1 if every character repeats.",
    inputFormat: "The input contains a single lowercase string.",
    outputFormat:
      "Print the zero-based index of the first non-repeating character.",
    examples: [
      { input: "leetcode", output: "0" },
      { input: "aabb", output: "-1" }
    ],
    starterCode: {
      python:
        's = input().strip()\n\n# Write your solution here',
      java:
        "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.nextLine().trim();\n\n        // Write your solution here\n    }\n}",
      c:
        "#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char s[1000];\n    scanf(\"%999s\", s);\n\n    /* Write your solution here */\n    return 0;\n}",
      cpp:
        "#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n\n    // Write your solution here\n    return 0;\n}",
      javascript:
        "const fs = require('fs');\nconst s = fs.readFileSync(0, 'utf8').trim();\n\n// Write your solution here",
      typescript:
        "import * as fs from 'fs';\nconst s = fs.readFileSync(0, 'utf8').trim();\n\n// Write your solution here",
      csharp:
        "using System;\n\nclass Program {\n    static void Main() {\n        string s = Console.ReadLine().Trim();\n\n        // Write your solution here\n    }\n}",
      go:
        "package main\n\nimport \"fmt\"\n\nfunc main() {\n    var s string\n    fmt.Scan(&s)\n\n    // Write your solution here\n}"
    },
    testCases: [
      { input: "leetcode", expected_output: "0" },
      { input: "aabb", expected_output: "-1" },
      { input: "swiss", expected_output: "1" }
    ]
  },
  {
    id: 5,
    title: "Longest Consecutive Sequence",
    skill: "Arrays",
    difficulty: "Hard",
    description:
      "Given an unsorted array of integers, find the length of the longest sequence of consecutive integers.",
    inputFormat:
      "The first line contains N. The second line contains N space-separated integers.",
    outputFormat:
      "Print the length of the longest consecutive sequence.",
    examples: [
      { input: "6\n100 4 200 1 3 2", output: "4" },
      { input: "5\n10 5 12 3 55", output: "1" }
    ],
    starterCode: {
      python:
        'n = int(input())\narr = list(map(int, input().split()))\n\n# Write your solution here',
      java:
        "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] arr = new int[n];\n        for (int i = 0; i < n; i++) arr[i] = sc.nextInt();\n\n        // Write your solution here\n    }\n}",
      c:
        "#include <stdio.h>\n\nint main() {\n    int n;\n    scanf(\"%d\", &n);\n    int arr[n];\n    for (int i = 0; i < n; i++) scanf(\"%d\", &arr[i]);\n\n    /* Write your solution here */\n    return 0;\n}",
      cpp:
        "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> arr(n);\n    for (int &x : arr) cin >> x;\n\n    // Write your solution here\n    return 0;\n}",
      javascript:
        "const fs = require('fs');\nconst input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/).map(Number);\nconst n = input[0];\nconst arr = input.slice(1, n + 1);\n\n// Write your solution here",
      typescript:
        "import * as fs from 'fs';\nconst input = fs.readFileSync(0, 'utf8').trim().split(/\\s+/).map(Number);\nconst n = input[0];\nconst arr = input.slice(1, n + 1);\n\n// Write your solution here",
      csharp:
        "using System;\n\nclass Program {\n    static void Main() {\n        string[] input = Console.In.ReadToEnd().Split();\n        int n = int.Parse(input[0]);\n        int[] arr = new int[n];\n        for (int i = 0; i < n; i++) arr[i] = int.Parse(input[i + 1]);\n\n        // Write your solution here\n    }\n}",
      go:
        "package main\n\nimport \"fmt\"\n\nfunc main() {\n    var n int\n    fmt.Scan(&n)\n    arr := make([]int, n)\n    for i := range arr { fmt.Scan(&arr[i]) }\n\n    // Write your solution here\n}"
    },
    testCases: [
      {
        input: "6\n100 4 200 1 3 2",
        expected_output: "4"
      },
      {
        input: "7\n9 1 4 7 3 2 6",
        expected_output: "4"
      },
      {
        input: "5\n10 5 12 3 55",
        expected_output: "1"
      }
    ]
  },
  {
    id: 6,
    title: "Valid Parentheses",
    skill: "Stack",
    difficulty: "Hard",
    description:
      "Given a string containing brackets (), {}, and [], determine whether the brackets are properly balanced and nested.",
    inputFormat: "The input contains a string containing brackets.",
    outputFormat:
      "Print true if the brackets are valid, otherwise print false.",
    examples: [
      { input: "{[()]}", output: "true" },
      { input: "{[(])}", output: "false" }
    ],
    starterCode: {
      python:
        's = input().strip()\n\n# Write your solution here',
      java:
        "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.nextLine().trim();\n\n        // Write your solution here\n    }\n}",
      c:
        "#include <stdio.h>\n\nint main() {\n    char s[1000];\n    scanf(\"%999s\", s);\n\n    /* Write your solution here */\n    return 0;\n}",
      cpp:
        "#include <iostream>\n#include <string>\n#include <stack>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n\n    // Write your solution here\n    return 0;\n}",
      javascript:
        "const fs = require('fs');\nconst s = fs.readFileSync(0, 'utf8').trim();\n\n// Write your solution here",
      typescript:
        "import * as fs from 'fs';\nconst s = fs.readFileSync(0, 'utf8').trim();\n\n// Write your solution here",
      csharp:
        "using System;\nusing System.Collections.Generic;\n\nclass Program {\n    static void Main() {\n        string s = Console.ReadLine().Trim();\n\n        // Write your solution here\n    }\n}",
      go:
        "package main\n\nimport \"fmt\"\n\nfunc main() {\n    var s string\n    fmt.Scan(&s)\n\n    // Write your solution here\n}"
    },
    testCases: [
      { input: "{[()]}", expected_output: "true" },
      { input: "{[(])}", expected_output: "false" },
      { input: "((()))", expected_output: "true" }
    ]
  }
];

const difficultyOrder = ["Easy", "Medium", "Hard"];

function getNextQuestion(currentQuestion, score, usedIds) {
  let targetDifficulty = currentQuestion.difficulty;

  if (score >= 80) {
    const index = difficultyOrder.indexOf(currentQuestion.difficulty);
    if (index < difficultyOrder.length - 1) {
      targetDifficulty = difficultyOrder[index + 1];
    }
  } else if (score < 50) {
    const index = difficultyOrder.indexOf(currentQuestion.difficulty);
    if (index > 0) {
      targetDifficulty = difficultyOrder[index - 1];
    }
  }

  const sameSkill = questionBank.find(
    (question) =>
      !usedIds.includes(question.id) &&
      question.skill === currentQuestion.skill &&
      question.difficulty === targetDifficulty
  );

  if (sameSkill) return sameSkill;

  const sameDifficulty = questionBank.find(
    (question) =>
      !usedIds.includes(question.id) &&
      question.difficulty === targetDifficulty
  );

  if (sameDifficulty) return sameDifficulty;

  return questionBank.find(
    (question) => !usedIds.includes(question.id)
  );
}

function CodingAssessment() {
  const navigate = useNavigate();

  const initialQuestion = questionBank.find(
    (question) => question.difficulty === "Medium"
  );

  const EXAM_DURATION = 120 * 60;

  const [currentQuestion, setCurrentQuestion] = useState(initialQuestion);
  const [currentIndex, setCurrentIndex] = useState(1);

  const [selectedLanguage, setSelectedLanguage] = useState("python");

  const [code, setCode] = useState(
    initialQuestion.starterCode.python
  );

  const [customInput, setCustomInput] = useState(
    initialQuestion.examples[0].input
  );

  const [activeTab, setActiveTab] = useState("problem");

  const [result, setResult] = useState(null);

  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [usedIds, setUsedIds] = useState([
    initialQuestion.id
  ]);

  const [scores, setScores] = useState([]);

  const [assessmentStarted, setAssessmentStarted] =
    useState(false);

  const [assessmentComplete, setAssessmentComplete] =
    useState(false);

  const [isFullscreen, setIsFullscreen] = useState(false);

  const [isPaused, setIsPaused] = useState(true);

  const [examDisabled, setExamDisabled] = useState(false);

  const [pauseReason, setPauseReason] = useState("");

  const [violationCount, setViolationCount] = useState(0);

  const [tabSwitches, setTabSwitches] = useState(0);

  const [fullscreenExits, setFullscreenExits] =
    useState(0);

  const [copyEvents, setCopyEvents] = useState(0);

  const [pasteEvents, setPasteEvents] = useState(0);

  const [remainingSeconds, setRemainingSeconds] =
    useState(EXAM_DURATION);

  const [lockSeconds, setLockSeconds] = useState(0);

  const [showViolation, setShowViolation] = useState(false);

  const violationProcessing = useRef(false);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);

    const minutes = Math.floor(
      (seconds % 3600) / 60
    );

    const secs = seconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(
      minutes
    ).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const formatLockTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);

    const secs = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      secs
    ).padStart(2, "0")}`;
  };

  const registerViolation = (reason) => {
    if (
      !assessmentStarted ||
      assessmentComplete ||
      examDisabled ||
      violationProcessing.current
    ) {
      return;
    }

    violationProcessing.current = true;

    const nextViolation = violationCount + 1;

    setViolationCount(nextViolation);
    setPauseReason(reason);
    setIsPaused(true);
    setShowViolation(true);

    if (reason === "tab") {
      setTabSwitches((previous) => previous + 1);
    }

    if (reason === "fullscreen") {
      setFullscreenExits((previous) => previous + 1);
    }

    if (nextViolation >= 3) {
      setExamDisabled(true);
      setLockSeconds(0);
      setShowViolation(false);

      violationProcessing.current = false;

      return;
    }

    const penalty =
      nextViolation === 1 ? 5 * 60 : 10 * 60;

    setLockSeconds(penalty);

    setTimeout(() => {
      violationProcessing.current = false;
    }, 1000);
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      const fullscreenActive =
        Boolean(document.fullscreenElement);

      setIsFullscreen(fullscreenActive);

      if (
        assessmentStarted &&
        !assessmentComplete &&
        !fullscreenActive &&
        !isPaused &&
        !examDisabled
      ) {
        registerViolation("fullscreen");
      }
    };

    const handleVisibilityChange = () => {
      if (
        document.hidden &&
        assessmentStarted &&
        !assessmentComplete &&
        !isPaused &&
        !examDisabled
      ) {
        registerViolation("tab");
      }
    };

    const handleCopy = () => {
      if (assessmentStarted && !assessmentComplete) {
        setCopyEvents((previous) => previous + 1);
      }
    };

    const handlePaste = () => {
      if (assessmentStarted && !assessmentComplete) {
        setPasteEvents((previous) => previous + 1);
      }
    };

    document.addEventListener(
      "fullscreenchange",
      handleFullscreenChange
    );

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    document.addEventListener("copy", handleCopy);

    document.addEventListener("paste", handlePaste);

    return () => {
      document.removeEventListener(
        "fullscreenchange",
        handleFullscreenChange
      );

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );

      document.removeEventListener("copy", handleCopy);

      document.removeEventListener("paste", handlePaste);
    };
  }, [
    assessmentStarted,
    assessmentComplete,
    isPaused,
    examDisabled,
    violationCount
  ]);

  useEffect(() => {
    if (
      !assessmentStarted ||
      assessmentComplete ||
      isPaused ||
      examDisabled
    ) {
      return;
    }

    const timer = setInterval(() => {
      setRemainingSeconds((previous) => {
        if (previous <= 1) {
          clearInterval(timer);

          setAssessmentComplete(true);
          setIsPaused(true);

          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [
    assessmentStarted,
    assessmentComplete,
    isPaused,
    examDisabled
  ]);

  useEffect(() => {
    if (!isPaused || lockSeconds <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setLockSeconds((previous) => {
        if (previous <= 1) {
          clearInterval(timer);
          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, lockSeconds]);

  const enterFullscreen = async () => {
    try {
      await document.documentElement.requestFullscreen();

      setIsFullscreen(true);

      setAssessmentStarted(true);

      setIsPaused(false);

      setPauseReason("");

      setShowViolation(false);

      setViolationProcessing(false);
    } catch (error) {
      setResult({
        type: "error",
        message:
          "Fullscreen permission was denied. Please allow fullscreen access."
      });
    }
  };

  const resumeAssessment = async () => {
    if (examDisabled) {
      return;
    }

    if (lockSeconds > 0) {
      return;
    }

    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }

      setIsFullscreen(true);

      setIsPaused(false);

      setPauseReason("");

      setShowViolation(false);
    } catch (error) {
      setResult({
        type: "error",
        message:
          "Please return to fullscreen mode to resume the assessment."
      });
    }
  };

  const changeLanguage = (language) => {
    setSelectedLanguage(language);

    const starter =
      currentQuestion.starterCode[language] ||
      currentQuestion.starterCode.python;

    setCode(starter);

    setResult(null);
  };

  const runCode = async () => {
    if (
      isPaused ||
      examDisabled ||
      remainingSeconds <= 0
    ) {
      return;
    }

    if (!code.trim()) {
      setResult({
        type: "error",
        message:
          "Please write your code before running."
      });

      return;
    }

    setIsRunning(true);

    setResult(null);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/coding/submit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            code,
            language: selectedLanguage,
            test_cases: [
              {
                input: customInput,
                expected_output:
                  currentQuestion.examples[0].output
              }
            ]
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to execute code"
        );
      }

      setResult({
        type: "run",
        score: data.score,
        passed: data.passed_test_cases,
        total: data.total_test_cases,
        executionTime: data.execution_time,
        message: data.message
      });
    } catch (error) {
      setResult({
        type: "error",
        message: error.message
      });
    } finally {
      setIsRunning(false);
    }
  };

  const submitCode = async () => {
    if (
      isPaused ||
      examDisabled ||
      remainingSeconds <= 0
    ) {
      return;
    }

    if (!code.trim()) {
      setResult({
        type: "error",
        message:
          "Please write your code before submitting."
      });

      return;
    }

    setIsSubmitting(true);

    setResult(null);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/coding/submit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            code,
            language: selectedLanguage,
            test_cases: currentQuestion.testCases
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Submission failed"
        );
      }

      const questionScore = Number(data.score);

      const updatedScores = [
        ...scores,
        {
          questionId: currentQuestion.id,
          title: currentQuestion.title,
          skill: currentQuestion.skill,
          difficulty: currentQuestion.difficulty,
          language: selectedLanguage,
          score: questionScore,
          passed: data.passed_test_cases,
          total: data.total_test_cases,
          executionTime: data.execution_time
        }
      ];

      setScores(updatedScores);

      setResult({
        type: "submit",
        score: questionScore,
        passed: data.passed_test_cases,
        total: data.total_test_cases,
        executionTime: data.execution_time,
        message: data.message
      });

      if (currentIndex >= 3) {
        setAssessmentComplete(true);

        setIsPaused(true);

        return;
      }

      const nextQuestion = getNextQuestion(
        currentQuestion,
        questionScore,
        usedIds
      );

      if (nextQuestion) {
        setTimeout(() => {
          setCurrentQuestion(nextQuestion);

          setCurrentIndex(
            (previous) => previous + 1
          );

          setUsedIds((previous) => [
            ...previous,
            nextQuestion.id
          ]);

          setCode(
            nextQuestion.starterCode[
              selectedLanguage
            ] ||
              nextQuestion.starterCode.python
          );

          setCustomInput(
            nextQuestion.examples[0].input
          );

          setActiveTab("problem");

          setResult(null);
        }, 1200);
      }
    } catch (error) {
      setResult({
        type: "error",
        message: error.message
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const finalScore =
    scores.length > 0
      ? Math.round(
          scores.reduce(
            (sum, item) => sum + item.score,
            0
          ) / scores.length
        )
      : 0;

  if (examDisabled) {
    return (
      <div className="coding-page security-page">
        <div className="security-card disabled-card">
          <div className="security-icon danger">
            !
          </div>

          <div className="aihire-brand">
            AIHire
          </div>

          <h1>Assessment Disabled</h1>

          <p>
            The coding assessment has been disabled
            because the maximum number of security
            violations was reached.
          </p>

          <div className="disabled-reason">
            <strong>Security policy triggered</strong>

            <span>
              Three fullscreen or tab-switch violations
              were detected.
            </span>
          </div>

          <div className="security-stats">
            <div>
              <span>Violations</span>
              <strong>{violationCount}/3</strong>
            </div>

            <div>
              <span>Tab Switches</span>
              <strong>{tabSwitches}</strong>
            </div>

            <div>
              <span>Fullscreen Exits</span>
              <strong>{fullscreenExits}</strong>
            </div>
          </div>

          <button
            className="continue-button"
            onClick={() => navigate("/dashboard")}
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!assessmentStarted) {
    return (
      <div className="coding-page security-page">
        <div className="security-card">
          <div className="aihire-brand">
            AIHire
          </div>

          <div className="security-icon">
            ⛶
          </div>

          <h1>AI Coding Assessment</h1>

          <p>
            Your coding assessment is ready to begin.
            Full-screen mode is required during the
            assessment.
          </p>

          <div className="exam-info-grid">
            <div>
              <strong>120</strong>
              <span>Minutes</span>
            </div>

            <div>
              <strong>3</strong>
              <span>Questions</span>
            </div>

            <div>
              <strong>8</strong>
              <span>Languages</span>
            </div>
          </div>

          <div className="security-rules">
            <h3>Assessment Rules</h3>

            <div>
              <span>✓</span>
              <p>
                Keep the assessment in full-screen mode.
              </p>
            </div>

            <div>
              <span>✓</span>
              <p>
                Switching tabs pauses the assessment.
              </p>
            </div>

            <div>
              <span>✓</span>
              <p>
                First violation causes a 5-minute
                lockout.
              </p>
            </div>

            <div>
              <span>✓</span>
              <p>
                Second violation causes a 10-minute
                lockout.
              </p>
            </div>

            <div>
              <span>✓</span>
              <p>
                Third violation disables the assessment.
              </p>
            </div>
          </div>

          <button
            className="fullscreen-start-button"
            onClick={enterFullscreen}
          >
            Enter Full Screen & Start Assessment →
          </button>
        </div>
      </div>
    );
  }

  if (assessmentComplete) {
    return (
      <div className="coding-page">
        <div className="coding-complete">
          <div className="complete-icon">
            ✓
          </div>

          <h1>
            Coding Assessment Completed
          </h1>

          <p className="complete-description">
            Your coding performance has been
            successfully evaluated.
          </p>

          <div className="final-score-card">
            <span>
              Overall Coding Score
            </span>

            <strong>
              {finalScore}%
            </strong>
          </div>

          <div className="coding-summary">
            {scores.map((item, index) => (
              <div
                className="summary-row"
                key={item.questionId}
              >
                <div>
                  <strong>
                    Question {index + 1}
                  </strong>

                  <span>
                    {item.title}
                  </span>
                </div>

                <div className="summary-meta">
                  <span>
                    {item.language}
                  </span>

                  <span>
                    {item.difficulty}
                  </span>

                  <b>
                    {item.score}%
                  </b>
                </div>
              </div>
            ))}
          </div>

          <div className="evidence-box">
            <h3>
              Assessment Evidence
            </h3>

            <p>
              Questions completed:
              <strong>
                {" "}
                {scores.length}
              </strong>
            </p>

            <p>
              Test cases passed:
              <strong>
                {" "}
                {scores.reduce(
                  (sum, item) =>
                    sum + item.passed,
                  0
                )}
              </strong>
            </p>

            <p>
              Skills assessed:
              <strong>
                {" "}
                {[
                  ...new Set(
                    scores.map(
                      (item) => item.skill
                    )
                  )
                ].join(", ")}
              </strong>
            </p>

            <p>
              Tab switches:
              <strong>
                {" "}
                {tabSwitches}
              </strong>
            </p>

            <p>
              Fullscreen exits:
              <strong>
                {" "}
                {fullscreenExits}
              </strong>
            </p>

            <p>
              Copy events:
              <strong>
                {" "}
                {copyEvents}
              </strong>
            </p>

            <p>
              Paste events:
              <strong>
                {" "}
                {pasteEvents}
              </strong>
            </p>

            <p>
              Time remaining:
              <strong>
                {" "}
                {formatTime(
                  remainingSeconds
                )}
              </strong>
            </p>
          </div>

          <button
            className="continue-button"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            Continue to Dashboard →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="coding-page">
      <header className="coding-header">
        <div className="brand-section">
          <div className="coding-logo">
            AIHire
          </div>

          <span>
            AI-Powered Coding Assessment
          </span>
        </div>

        <div className="header-center">
          <div className="proctored-badge">
            <span>●</span>
            Proctored
          </div>
        </div>

        <div className="header-right">
          <div className="timer-box">
            <span>TIME LEFT</span>

            <strong
              className={
                remainingSeconds <= 600
                  ? "timer-danger"
                  : ""
              }
            >
              {formatTime(
                remainingSeconds
              )}
            </strong>
          </div>

          <div className="question-counter">
            <span>QUESTION</span>

            <strong>
              {currentIndex} / 3
            </strong>
          </div>
        </div>
      </header>

      <main className="coding-container">
        <div className="assessment-heading">
          <div>
            <p className="section-label">
              CODING ROUND
            </p>

            <h1>
              {currentQuestion.title}
            </h1>

            <div className="skill-info">
              <span>
                Skill:{" "}
                {currentQuestion.skill}
              </span>

              <span>•</span>

              <span>
                Adaptive Assessment
              </span>
            </div>
          </div>

          <div className="difficulty-badge">
            {currentQuestion.difficulty}
          </div>
        </div>

        <div className="coding-layout">
          <section className="problem-panel">
            <div className="tabs">
              <button
                className={
                  activeTab === "problem"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setActiveTab("problem")
                }
              >
                Problem
              </button>

              <button
                className={
                  activeTab === "examples"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setActiveTab("examples")
                }
              >
                Examples
              </button>
            </div>

            {activeTab === "problem" && (
              <div className="problem-content">
                <h2>
                  Problem Statement
                </h2>

                <p>
                  {
                    currentQuestion.description
                  }
                </p>

                <h3>
                  Input Format
                </h3>

                <p>
                  {
                    currentQuestion.inputFormat
                  }
                </p>

                <h3>
                  Output Format
                </h3>

                <p>
                  {
                    currentQuestion.outputFormat
                  }
                </p>

                <div className="adaptive-note">
                  <span>⚡</span>

                  <div>
                    <strong>
                      Adaptive Difficulty
                    </strong>

                    <p>
                      Your performance
                      determines the
                      difficulty of the
                      next question.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "examples" && (
              <div className="examples-content">
                {currentQuestion.examples.map(
                  (example, index) => (
                    <div
                      className="example-card"
                      key={index}
                    >
                      <h3>
                        Example {index + 1}
                      </h3>

                      <span>
                        INPUT
                      </span>

                      <pre>
                        {example.input}
                      </pre>

                      <span>
                        OUTPUT
                      </span>

                      <pre>
                        {example.output}
                      </pre>
                    </div>
                  )
                )}
              </div>
            )}
          </section>

          <section className="editor-panel">
            <div className="editor-header">
              <div className="language-selector">
                <span>
                  Language
                </span>

                <select
                  value={
                    selectedLanguage
                  }
                  onChange={(event) =>
                    changeLanguage(
                      event.target.value
                    )
                  }
                >
                  {languages.map(
                    (language) => (
                      <option
                        value={
                          language.id
                        }
                        key={
                          language.id
                        }
                      >
                        {language.name}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="editor-tools">
                <span className="editor-live">
                  ● LIVE
                </span>

                <button
                  className="fullscreen-button"
                  onClick={
                    enterFullscreen
                  }
                >
                  ⛶ Full Screen
                </button>
              </div>
            </div>

            <textarea
              className="code-editor"
              value={code}
              onChange={(event) =>
                setCode(
                  event.target.value
                )
              }
              spellCheck="false"
              disabled={
                isPaused ||
                examDisabled
              }
            />

            <div className="custom-input-section">
              <label>
                Custom Input
              </label>

              <textarea
                value={customInput}
                onChange={(event) =>
                  setCustomInput(
                    event.target.value
                  )
                }
                disabled={
                  isPaused ||
                  examDisabled
                }
                spellCheck="false"
              />
            </div>

            <div className="editor-actions">
              <button
                className="run-button"
                onClick={runCode}
                disabled={
                  isRunning ||
                  isSubmitting ||
                  isPaused ||
                  examDisabled
                }
              >
                {isRunning
                  ? "Running..."
                  : "▶ Run Code"}
              </button>

              <button
                className="submit-button"
                onClick={submitCode}
                disabled={
                  isRunning ||
                  isSubmitting ||
                  isPaused ||
                  examDisabled
                }
              >
                {isSubmitting
                  ? "Evaluating..."
                  : "Submit Code →"}
              </button>
            </div>
          </section>
        </div>

        {result && (
          <section
            className={`result-panel ${result.type}`}
          >
            <div className="result-icon">
              {result.type === "error"
                ? "!"
                : "✓"}
            </div>

            <div className="result-main">
              <div className="result-heading">
                <div>
                  <h3>
                    {result.type ===
                    "submit"
                      ? "Submission Evaluated"
                      : result.type ===
                        "run"
                      ? "Code Executed"
                      : "Assessment Message"}
                  </h3>

                  <p>
                    {result.message}
                  </p>
                </div>

                {result.score !==
                  undefined && (
                  <strong>
                    {result.score}%
                  </strong>
                )}
              </div>

              {result.score !==
                undefined && (
                <div className="result-stats">
                  <div>
                    <span>
                      Passed
                    </span>

                    <b>
                      {result.passed}/
                      {result.total}
                    </b>
                  </div>

                  <div>
                    <span>
                      Execution
                    </span>

                    <b>
                      {
                        result.executionTime
                      }
                      s
                    </b>
                  </div>

                  <div>
                    <span>
                      Language
                    </span>

                    <b>
                      {
                        languages.find(
                          (language) =>
                            language.id ===
                            selectedLanguage
                        )?.name
                      }
                    </b>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        <div className="assessment-footer">
          <div>
            <span>
              QUESTIONS
            </span>

            <strong>
              3
            </strong>
          </div>

          <div>
            <span>
              COMPLETED
            </span>

            <strong>
              {scores.length}
            </strong>
          </div>

          <div>
            <span>
              VIOLATIONS
            </span>

            <strong>
              {violationCount}/3
            </strong>
          </div>

          <div>
            <span>
              FULLSCREEN
            </span>

            <strong>
              {isFullscreen
                ? "ON"
                : "OFF"}
            </strong>
          </div>
        </div>
      </main>

      {showViolation &&
        isPaused &&
        !examDisabled && (
          <div className="pause-overlay">
            <div className="pause-modal">
              <div className="pause-modal-icon">
                ⏸
              </div>

              <h2>
                Assessment Paused
              </h2>

              <p>
                {pauseReason ===
                "tab"
                  ? "You switched away from the assessment."
                  : "You exited fullscreen mode."}
              </p>

              <div className="violation-number">
                Security violation{" "}
                {violationCount} of 3
              </div>

              <div className="lockout-card">
                <span>
                  Resume available in
                </span>

                <strong>
                  {formatLockTime(
                    lockSeconds
                  )}
                </strong>
              </div>

              <p className="pause-small">
                Your 120-minute assessment
                timer is paused during this
                security lockout.
              </p>

              <button
                className="resume-button"
                disabled={
                  lockSeconds > 0
                }
                onClick={
                  resumeAssessment
                }
              >
                {lockSeconds > 0
                  ? `Wait ${formatLockTime(
                      lockSeconds
                    )}`
                  : "Return to Full Screen & Resume →"}
              </button>
            </div>
          </div>
        )}
    </div>
  );
}

export default CodingAssessment;