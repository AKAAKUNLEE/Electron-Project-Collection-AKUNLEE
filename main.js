const { app, BrowserWindow, session } = require('electron');
const path = require('path');

// 保持对主窗口的全局引用
let mainWindow;

function createWindow() {
  // 配置会话，确保登录状态持久化
  const ses = session.defaultSession;
  
  // 允许所有跨域请求，确保 doubao.com 正常运行
  ses.webRequest.onBeforeSendHeaders((details, callback) => {
    callback({ cancel: false, requestHeaders: details.requestHeaders });
  });
  
  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 1000,
    minHeight: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      // 上下文隔离
      contextIsolation: true,
      // 启用远程模块（如果需要）
      enableRemoteModule: false,
      // 启用web安全
      webSecurity: true,
      // 允许执行脚本
      javascript: true,
      // 允许cookie，确保登录状态持久化
      cookies: true,
      // 允许本地存储
      localStorage: true
    }
  });
  
  // 确保右键菜单功能正常
  // 不添加任何阻止默认行为的代码，让网站的默认右键菜单正常显示

  // 加载 doubao.com 网站
  mainWindow.loadURL('https://doubao.com/');

  // 当窗口关闭时触发
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
  
  // 监听页面加载完成
  mainWindow.webContents.on('did-finish-load', () => {
    console.log('页面加载完成');
    // 可以在这里添加一些额外的操作
  });
  
  // 监听页面导航完成
  mainWindow.webContents.on('did-navigate', (event, url) => {
    console.log('导航到:', url);
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
