# Electron 通用模板应用

## 项目介绍
这是一个通用的 Electron 应用模板，可以作为新项目的起点。该模板提供了基本的 Electron 应用结构和示例代码，帮助开发者快速启动 Electron 项目。

### 当前版本
**V1.0.0**

## 功能特性
- ✅ 基本的 Electron 应用结构
- ✅ 主进程与渲染进程通信示例
- ✅ 预加载脚本配置
- ✅ 跨平台支持（Windows、macOS）
- ✅ 构建配置

## 安装和运行

### 安装依赖
```bash
npm install
```

### 运行开发版本
```bash
npm start
```

### 构建发布版本
```bash
npm run build
```
构建后的可执行文件将位于 `dist` 目录中。

## 项目结构
```
electron-template/
├── main.js          # 主进程文件
├── preload.js       # 预加载脚本
├── index.html       # 默认加载页面
├── package.json     # 项目配置
├── README.md        # 项目文档
└── dist/            # 构建输出目录
```

## 技术栈
- Electron ^40.1.0
- Node.js
- JavaScript
- HTML/CSS

## 使用说明
1. 克隆或下载此模板
2. 修改 `package.json` 文件中的应用名称、描述和构建配置
3. 修改 `main.js` 文件以适应您的应用需求
4. 修改 `index.html` 文件以创建您的应用界面
5. 使用 `preload.js` 文件向渲染进程暴露必要的 API

## API 示例
模板包含以下 API 示例：
- 获取应用版本
- 从渲染进程发送消息到主进程
- 从主进程接收消息

## 许可证
MIT License

© 2026 Your Name