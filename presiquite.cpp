#include <iostream>
#include <fstream>
#include <string>
#include <vector>

// 函数声明
bool processFile(const std::string& filePath);

int main() {
    std::string filePath = "node_modules/@nuxt/ui-pro/modules/pro/index.ts";

    if (processFile(filePath)) {
        std::cout << "文件处理成功。" << std::endl;
    } else {
        std::cerr << "文件处理失败。" << std::endl;
        return 1;
    }

    return 0;
}

bool processFile(const std::string& filePath) {
    std::ifstream inputFile(filePath);
    if (!inputFile.is_open()) {
        std::cerr << "无法打开文件进行读取: " << filePath << std::endl;
        return false;
    }

    std::vector<std::string> lines;
    std::string line;
    bool modified = false;

    // 逐行读取文件
    while (std::getline(inputFile, line)) {
        if (line.find("validateLicense") != std::string::npos) {
            // 检查该行是否已被注释，以避免重复添加 "//"
            if (line.find("//") != 0) {
                line = "//" + line;
                modified = true;
            }
        }
        lines.push_back(line);
    }

    inputFile.close();

    if (!modified) {
        std::cout << "文件中没有需要修改的行。" << std::endl;
        return true; // 虽然没有修改，但程序本身是成功的
    }

    // 将修改后的内容写回原文件
    std::ofstream outputFile(filePath);
    if (!outputFile.is_open()) {
        std::cerr << "无法打开文件进行写入: " << filePath << std::endl;
        return false;
    }

    for (const auto& modifiedLine : lines) {
        outputFile << modifiedLine << '\n';
    }

    outputFile.close();
    return true;
}