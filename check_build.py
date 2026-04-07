import subprocess
import sys

def run_build():
    try:
        result = subprocess.run(['npx', 'ng', 'build'], capture_output=True, text=True, check=False)
        print("STDOUT:")
        print(result.stdout)
        print("STDERR:")
        print(result.stderr)
        if result.returncode != 0:
            print(f"Build failed with exit code {result.returncode}")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    run_build()
