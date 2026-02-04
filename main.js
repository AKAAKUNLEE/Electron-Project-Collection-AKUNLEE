const { app, BrowserWindow, session } = require('electron');
const path = require('path');
const fs = require('fs');

// 保持对主窗口的全局引用
let mainWindow;

// 配置会话持久化
function setupSession() {
  // 获取默认会话
  const defaultSession = session.defaultSession;
  
  // 配置cookie策略
  defaultSession.cookies.set({
    url: 'https://fanqienovel.com',
    name: 'session_persist',
    value: 'true',
    httpOnly: true,
    secure: true,
    sameSite: 'strict'
  }).catch(err => {
    console.log('设置cookie失败:', err);
  });
  
  // 监听cookie变化
  defaultSession.cookies.on('changed', (event, cookie, cause, removed) => {
    console.log('Cookie变化:', cookie.name, 'removed:', removed);
  });
  
  // 验证会话存储路径
  console.log('会话存储路径:', defaultSession.getPath('sessionData'));
}

function createWindow() {
  // 设置会话
  setupSession();
  
  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      // 启用会话以保存登录状态
      session: true,
      // 允许跨域请求
      webSecurity: false,
      // 启用远程模块（如果需要）
      enableRemoteModule: false,
      // 上下文隔离
      contextIsolation: true
    }
  });

  // 加载指定的网页
  mainWindow.loadURL('https://fanqienovel.com/main/writer/chapter-manage/7600396831519935512&%E7%81%B5%E6%B0%94%E5%90%8E%E9%99%A2%EF%BC%9A%E5%A4%A7%E4%BD%AC%E4%BB%AC%E9%83%BD%E6%83%B3%E5%BD%93%E6%88%91%E7%A7%9F%E5%AE%A2?type=1');

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

// 保存会话数据
app.on('will-quit', function() {
  // 会话数据会自动保存，无需手动处理
  console.log('应用即将退出，会话数据已保存');
});
