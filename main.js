const { app, BrowserWindow } = require('electron');
const path = require('path');

// 保持对主窗口的全局引用
let mainWindow;

function createWindow() {
  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      // 上下文隔离
      contextIsolation: true,
      // 启用远程模块（如果需要）
      enableRemoteModule: false
    }
  });

  // 加载本地的 index.html 文件
  mainWindow.loadFile('index.html');

  // 当窗口关闭时触发
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
  
  // 监听页面加载完成
  mainWindow.webContents.on('did-finish-load', () => {
    console.log('页面加载完成');
    // 可以在这里添加一些额外的操作
  });
}

// 当Electron完成初始化后创建窗口
app.on('ready', createWindow);

// 当所有窗口关闭时退出应用
app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 在macOS上点击dock图标时重新创建窗口
app.on('activate', function() {
  if (mainWindow === null) {
    createWindow();
  }
});

// 处理来自渲染进程的消息
const { ipcMain } = require('electron');

// 示例：处理获取应用版本的请求
ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

// 示例：处理来自渲染进程的消息
ipcMain.on('message', (event, message) => {
  console.log('收到来自渲染进程的消息:', message);
  // 可以在这里添加处理逻辑
  event.sender.send('response', `已收到消息: ${message}`);
});
