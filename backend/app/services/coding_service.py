import os
import shutil
import subprocess
import tempfile
import time


LANGUAGE_INFO = {
    "python": {
        "name": "Python 3",
        "executable": "python"
    },
    "java": {
        "name": "Java",
        "executable": "javac"
    },
    "c": {
        "name": "C",
        "executable": "gcc"
    },
    "cpp": {
        "name": "C++",
        "executable": "g++"
    },
    "javascript": {
        "name": "JavaScript",
        "executable": "node"
    },
    "typescript": {
        "name": "TypeScript",
        "executable": "tsc"
    },
    "csharp": {
        "name": "C#",
        "executable": "dotnet"
    },
    "go": {
        "name": "Go",
        "executable": "go"
    }
}


def command_available(command):
    return shutil.which(command) is not None


def execute_process(command, input_data, timeout=5, cwd=None):
    start_time = time.time()

    try:
        process = subprocess.run(
            command,
            input=input_data,
            capture_output=True,
            text=True,
            timeout=timeout,
            cwd=cwd,
            shell=False
        )

        execution_time = time.time() - start_time

        stdout = process.stdout.strip()
        stderr = process.stderr.strip()

        return {
            "returncode": process.returncode,
            "stdout": stdout,
            "stderr": stderr,
            "execution_time": round(execution_time, 4),
            "timed_out": False
        }

    except subprocess.TimeoutExpired:
        execution_time = time.time() - start_time

        return {
            "returncode": -1,
            "stdout": "",
            "stderr": "Execution timed out",
            "execution_time": round(execution_time, 4),
            "timed_out": True
        }

    except Exception as error:
        execution_time = time.time() - start_time

        return {
            "returncode": -1,
            "stdout": "",
            "stderr": str(error),
            "execution_time": round(execution_time, 4),
            "timed_out": False
        }


def normalize_output(output):
    return output.strip().replace("\r\n", "\n")


def run_test_cases(
    run_function,
    test_cases,
    working_directory
):
    results = []
    passed = 0

    for index, test_case in enumerate(test_cases, start=1):
        result = run_function(
            test_case["input"],
            working_directory
        )

        actual_output = normalize_output(
            result["stdout"]
        )

        expected_output = normalize_output(
            test_case["expected_output"]
        )

        if result["timed_out"]:
            results.append({
                "test_case": index,
                "input": test_case["input"],
                "expected_output": expected_output,
                "actual_output": "",
                "passed": False,
                "execution_time": result["execution_time"],
                "error": "Execution timed out"
            })

            continue

        if result["returncode"] != 0:
            results.append({
                "test_case": index,
                "input": test_case["input"],
                "expected_output": expected_output,
                "actual_output": actual_output,
                "passed": False,
                "execution_time": result["execution_time"],
                "error": result["stderr"] or "Runtime error"
            })

            continue

        is_passed = actual_output == expected_output

        if is_passed:
            passed += 1

        results.append({
            "test_case": index,
            "input": test_case["input"],
            "expected_output": expected_output,
            "actual_output": actual_output,
            "passed": is_passed,
            "execution_time": result["execution_time"],
            "error": ""
        })

    return passed, results


def execute_python(code, test_cases, directory):
    if not command_available("python"):
        return {
            "available": False,
            "message": "Python is not available on the server."
        }

    file_path = os.path.join(
        directory,
        "main.py"
    )

    with open(
        file_path,
        "w",
        encoding="utf-8"
    ) as file:
        file.write(code)

    def run(input_data, cwd):
        return execute_process(
            ["python", file_path],
            input_data,
            cwd=cwd
        )

    return run_test_cases(
        run,
        test_cases,
        directory
    )


def execute_java(code, test_cases, directory):
    if not command_available("javac"):
        return {
            "available": False,
            "message": "Java compiler (javac) is not installed."
        }

    file_path = os.path.join(
        directory,
        "Main.java"
    )

    with open(
        file_path,
        "w",
        encoding="utf-8"
    ) as file:
        file.write(code)

    compile_result = execute_process(
        ["javac", file_path],
        "",
        timeout=10,
        cwd=directory
    )

    if compile_result["returncode"] != 0:
        return {
            "available": True,
            "compile_error": compile_result["stderr"],
            "compile_time": compile_result["execution_time"]
        }

    def run(input_data, cwd):
        return execute_process(
            ["java", "-cp", directory, "Main"],
            input_data,
            cwd=cwd
        )

    return run_test_cases(
        run,
        test_cases,
        directory
    )


def execute_c(code, test_cases, directory):
    if not command_available("gcc"):
        return {
            "available": False,
            "message": "GCC is not installed."
        }

    source_path = os.path.join(
        directory,
        "main.c"
    )

    executable_path = os.path.join(
        directory,
        "main.exe"
    )

    with open(
        source_path,
        "w",
        encoding="utf-8"
    ) as file:
        file.write(code)

    compile_result = execute_process(
        [
            "gcc",
            source_path,
            "-O2",
            "-o",
            executable_path
        ],
        "",
        timeout=10,
        cwd=directory
    )

    if compile_result["returncode"] != 0:
        return {
            "available": True,
            "compile_error": compile_result["stderr"],
            "compile_time": compile_result["execution_time"]
        }

    def run(input_data, cwd):
        return execute_process(
            [executable_path],
            input_data,
            cwd=cwd
        )

    return run_test_cases(
        run,
        test_cases,
        directory
    )


def execute_cpp(code, test_cases, directory):
    if not command_available("g++"):
        return {
            "available": False,
            "message": "G++ is not installed."
        }

    source_path = os.path.join(
        directory,
        "main.cpp"
    )

    executable_path = os.path.join(
        directory,
        "main.exe"
    )

    with open(
        source_path,
        "w",
        encoding="utf-8"
    ) as file:
        file.write(code)

    compile_result = execute_process(
        [
            "g++",
            source_path,
            "-O2",
            "-std=c++17",
            "-o",
            executable_path
        ],
        "",
        timeout=10,
        cwd=directory
    )

    if compile_result["returncode"] != 0:
        return {
            "available": True,
            "compile_error": compile_result["stderr"],
            "compile_time": compile_result["execution_time"]
        }

    def run(input_data, cwd):
        return execute_process(
            [executable_path],
            input_data,
            cwd=cwd
        )

    return run_test_cases(
        run,
        test_cases,
        directory
    )


def execute_javascript(code, test_cases, directory):
    if not command_available("node"):
        return {
            "available": False,
            "message": "Node.js is not installed."
        }

    file_path = os.path.join(
        directory,
        "main.js"
    )

    with open(
        file_path,
        "w",
        encoding="utf-8"
    ) as file:
        file.write(code)

    def run(input_data, cwd):
        return execute_process(
            ["node", file_path],
            input_data,
            cwd=cwd
        )

    return run_test_cases(
        run,
        test_cases,
        directory
    )


def execute_typescript(code, test_cases, directory):
    if not command_available("tsc"):
        return {
            "available": False,
            "message": "TypeScript compiler (tsc) is not installed."
        }

    source_path = os.path.join(
        directory,
        "main.ts"
    )

    output_directory = os.path.join(
        directory,
        "compiled"
    )

    os.makedirs(
        output_directory,
        exist_ok=True
    )

    with open(
        source_path,
        "w",
        encoding="utf-8"
    ) as file:
        file.write(code)

    compile_result = execute_process(
        [
            "tsc",
            source_path,
            "--target",
            "ES2020",
            "--module",
            "commonjs",
            "--outDir",
            output_directory
        ],
        "",
        timeout=10,
        cwd=directory
    )

    if compile_result["returncode"] != 0:
        return {
            "available": True,
            "compile_error": compile_result["stderr"] or compile_result["stdout"],
            "compile_time": compile_result["execution_time"]
        }

    output_file = os.path.join(
        output_directory,
        "main.js"
    )

    def run(input_data, cwd):
        return execute_process(
            ["node", output_file],
            input_data,
            cwd=cwd
        )

    return run_test_cases(
        run,
        test_cases,
        directory
    )


def execute_csharp(code, test_cases, directory):
    csc_path = shutil.which("csc")

    if csc_path:
        source_path = os.path.join(
            directory,
            "Program.cs"
        )

        executable_path = os.path.join(
            directory,
            "Program.exe"
        )

        with open(
            source_path,
            "w",
            encoding="utf-8"
        ) as file:
            file.write(code)

        compile_result = execute_process(
            [
                csc_path,
                "/nologo",
                f"/out:{executable_path}",
                source_path
            ],
            "",
            timeout=10,
            cwd=directory
        )

        if compile_result["returncode"] != 0:
            return {
                "available": True,
                "compile_error": compile_result["stderr"],
                "compile_time": compile_result["execution_time"]
            }

        def run(input_data, cwd):
            return execute_process(
                [executable_path],
                input_data,
                cwd=cwd
            )

        return run_test_cases(
            run,
            test_cases,
            directory
        )

    dotnet_path = shutil.which("dotnet")

    if not dotnet_path:
        return {
            "available": False,
            "message": "C# requires csc or the .NET SDK."
        }

    project_directory = os.path.join(
        directory,
        "CSharpProject"
    )

    os.makedirs(
        project_directory,
        exist_ok=True
    )

    project_file = os.path.join(
        project_directory,
        "CSharpProject.csproj"
    )

    source_file = os.path.join(
        project_directory,
        "Program.cs"
    )

    project_content = """<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net10.0</TargetFramework>
    <ImplicitUsings>enable</ImplicitUsings>
    <Nullable>disable</Nullable>
  </PropertyGroup>
</Project>
"""

    with open(
        project_file,
        "w",
        encoding="utf-8"
    ) as file:
        file.write(project_content)

    with open(
        source_file,
        "w",
        encoding="utf-8"
    ) as file:
        file.write(code)

    compile_result = execute_process(
        [
            dotnet_path,
            "build",
            project_file,
            "--nologo",
            "-v",
            "q"
        ],
        "",
        timeout=30,
        cwd=project_directory
    )

    if compile_result["returncode"] != 0:
        return {
            "available": True,
            "compile_error": compile_result["stderr"] or compile_result["stdout"],
            "compile_time": compile_result["execution_time"]
        }

    dll_path = os.path.join(
        project_directory,
        "bin",
        "Debug",
        "net10.0",
        "CSharpProject.dll"
    )

    def run(input_data, cwd):
        return execute_process(
            [dotnet_path, dll_path],
            input_data,
            cwd=cwd
        )

    return run_test_cases(
        run,
        test_cases,
        project_directory
    )


def execute_go(code, test_cases, directory):
    if not command_available("go"):
        return {
            "available": False,
            "message": "Go is not installed."
        }

    file_path = os.path.join(
        directory,
        "main.go"
    )

    with open(
        file_path,
        "w",
        encoding="utf-8"
    ) as file:
        file.write(code)

    def run(input_data, cwd):
        return execute_process(
            ["go", "run", file_path],
            input_data,
            timeout=8,
            cwd=cwd
        )

    return run_test_cases(
        run,
        test_cases,
        directory
    )


def execute_code(code, language, test_cases):
    language = language.lower().strip()

    if language not in LANGUAGE_INFO:
        return {
            "success": False,
            "score": 0,
            "passed_test_cases": 0,
            "total_test_cases": len(test_cases),
            "execution_time": 0,
            "results": [],
            "message": f"Unsupported language: {language}"
        }

    if not code.strip():
        return {
            "success": False,
            "score": 0,
            "passed_test_cases": 0,
            "total_test_cases": len(test_cases),
            "execution_time": 0,
            "results": [],
            "message": "Code cannot be empty."
        }

    directory = tempfile.mkdtemp(
        prefix="aihire_coding_"
    )

    try:
        if language == "python":
            result = execute_python(
                code,
                test_cases,
                directory
            )

        elif language == "java":
            result = execute_java(
                code,
                test_cases,
                directory
            )

        elif language == "c":
            result = execute_c(
                code,
                test_cases,
                directory
            )

        elif language == "cpp":
            result = execute_cpp(
                code,
                test_cases,
                directory
            )

        elif language == "javascript":
            result = execute_javascript(
                code,
                test_cases,
                directory
            )

        elif language == "typescript":
            result = execute_typescript(
                code,
                test_cases,
                directory
            )

        elif language == "csharp":
            result = execute_csharp(
                code,
                test_cases,
                directory
            )

        elif language == "go":
            result = execute_go(
                code,
                test_cases,
                directory
            )

        else:
            result = {
                "available": False,
                "message": "Language is not configured."
            }

        if isinstance(result, dict):
            if result.get("available") is False:
                return {
                    "success": False,
                    "score": 0,
                    "passed_test_cases": 0,
                    "total_test_cases": len(test_cases),
                    "execution_time": 0,
                    "results": [],
                    "message": result["message"]
                }

            if "compile_error" in result:
                return {
                    "success": False,
                    "score": 0,
                    "passed_test_cases": 0,
                    "total_test_cases": len(test_cases),
                    "execution_time": result.get(
                        "compile_time",
                        0
                    ),
                    "results": [
                        {
                            "test_case": 0,
                            "input": "",
                            "expected_output": "",
                            "actual_output": "",
                            "passed": False,
                            "execution_time": result.get(
                                "compile_time",
                                0
                            ),
                            "error": result["compile_error"]
                        }
                    ],
                    "message": "Compilation failed."
                }

        passed, results = result

        total = len(test_cases)

        score = (
            passed / total * 100
            if total > 0
            else 0
        )

        total_execution_time = sum(
            item["execution_time"]
            for item in results
        )

        return {
            "success": passed == total and total > 0,
            "score": round(score, 2),
            "passed_test_cases": passed,
            "total_test_cases": total,
            "execution_time": round(
                total_execution_time,
                4
            ),
            "results": results,
            "message": f"{passed}/{total} test cases passed"
        }

    finally:
        shutil.rmtree(
            directory,
            ignore_errors=True
        )


def execute_python_code(code, test_cases):
    return execute_code(
        code,
        "python",
        test_cases
    )