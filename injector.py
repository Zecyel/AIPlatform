import os
import sys


def load_env_file(env_path):
    """
    读取 env_file 并返回一个字典，其中键是变量名，值是变量值。
    """
    env_vars = {}
    if not os.path.exists(env_path):
        print(f"Error: The env file '{env_path}' does not exist.")
        sys.exit(1)

    with open(env_path, 'r') as file:
        for line in file:
            line = line.strip()
            # 忽略空行和注释
            if not line or line.startswith('#'):
                continue
            if '=' not in line:
                print(f"Warning: Skipping invalid line: {line}")
                continue
            key, value = line.split('=', 1)
            env_vars[key] = value
    return env_vars

def inject_env(target_file, env_vars):
    """
    替换目标文件中的占位符为实际的环境变量值。
    """
    if not os.path.exists(target_file):
        print(f"Error: The target file '{target_file}' does not exist.")
        sys.exit(1)

    with open(target_file, 'r') as file:
        content = file.read()

    for key, value in env_vars.items():
        placeholder = f"${{{key}}}"  # 支持 ${VARIABLE} 格式
        content = content.replace(placeholder, value)
        # 也支持 $VARIABLE 格式
        content = content.replace(f"${key}", value)

    with open(target_file, 'w') as file:
        file.write(content)
    print(f"Successfully injected environment variables into '{target_file}'.")

def main():
    # 默认的 env_file 路径和目标文件路径
    env_file_path = '.env'
    target_file_path = os.path.join('server', 'utils', 'environment.ts')

    # 如果需要，可以通过命令行参数覆盖默认路径
    if len(sys.argv) > 1:
        env_file_path = sys.argv[1]
    if len(sys.argv) > 2:
        target_file_path = sys.argv[2]

    env_vars = load_env_file(env_file_path)
    inject_env(target_file_path, env_vars)

if __name__ == "__main__":
    main()