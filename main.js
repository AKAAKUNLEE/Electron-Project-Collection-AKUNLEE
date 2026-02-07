const { app, BrowserWindow, session, Menu, dialog } = require('electron');
const path = require('path');
const url = require('url');

// 保持对主窗口的全局引用
let mainWindow;
let tabs = [];

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
      localStorage: true,
      // 启用开发者工具
      devTools: true
    }
  });
  
  // 加载 doubao.com 网站
  mainWindow.loadURL('https://doubao.com/');

  // 当窗口关闭时触发
  mainWindow.on('closed', function() {
    mainWindow = null;
    tabs = [];
  });
  
  // 监听页面加载完成
  mainWindow.webContents.on('did-finish-load', () => {
    console.log('页面加载完成');
  });
  
  // 监听页面导航完成
  mainWindow.webContents.on('did-navigate', (event, url) => {
    console.log('导航到:', url);
  });
  
  // 监听新窗口创建
  mainWindow.webContents.setWindowOpenHandler((details) => {
    // 在新标签页中打开链接
    createTab(details.url);
    return { action: 'deny' }; // 阻止默认的新窗口创建
  });
  
  // 创建应用菜单
  createMenu();
  
  // 添加第一个标签页
  tabs.push({
    id: 1,
    webContents: mainWindow.webContents,
    url: 'https://doubao.com/',
    title: 'Doubao'
  });
}

// 创建新标签页
function createTab(urlToLoad = 'https://doubao.com/') {
  if (!mainWindow) {
    createWindow();
    return;
  }
  
  // 创建新的浏览器窗口作为标签页
  const tabWindow = new BrowserWindow({
    width: mainWindow.getBounds().width,
    height: mainWindow.getBounds().height - 50, // 留出标签栏空间
    parent: mainWindow,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true,
      javascript: true,
      cookies: true,
      localStorage: true,
      devTools: true
    }
  });
  
  // 加载URL
  tabWindow.loadURL(urlToLoad);
  
  // 添加到标签页列表
  const tabId = tabs.length + 1;
  tabs.push({
    id: tabId,
    webContents: tabWindow.webContents,
    url: urlToLoad,
    title: 'New Tab'
  });
  
  // 监听标签页标题变化
  tabWindow.webContents.on('page-title-updated', (event, title) => {
    const tab = tabs.find(t => t.webContents === tabWindow.webContents);
    if (tab) {
      tab.title = title;
    }
  });
  
  // 监听标签页导航
  tabWindow.webContents.on('did-navigate', (event, url) => {
    const tab = tabs.find(t => t.webContents === tabWindow.webContents);
    if (tab) {
      tab.url = url;
    }
  });
  
  // 显示新标签页
  tabWindow.show();
  
  console.log(`Created new tab with ID: ${tabId} loading: ${urlToLoad}`);
}

// 创建应用菜单
function createMenu() {
  const template = [
    {
      label: '文件',
      submenu: [
        {
          label: '新建标签页',
          accelerator: 'Ctrl+T',
          click: () => createTab()
        },
        {
          label: '关闭标签页',
          accelerator: 'Ctrl+W',
          click: () => {
            // 实现关闭当前标签页的逻辑
            console.log('Close tab');
          }
        },
        { type: 'separator' },
        {
          label: '退出',
          accelerator: 'Ctrl+Q',
          click: () => app.quit()
        }
      ]
    },
    {
      label: '编辑',
      submenu: [
        { label: '撤销', accelerator: 'Ctrl+Z', role: 'undo' },
        { label: '重做', accelerator: 'Ctrl+Y', role: 'redo' },
        { type: 'separator' },
        { label: '剪切', accelerator: 'Ctrl+X', role: 'cut' },
        { label: '复制', accelerator: 'Ctrl+C', role: 'copy' },
        { label: '粘贴', accelerator: 'Ctrl+V', role: 'paste' },
        { label: '全选', accelerator: 'Ctrl+A', role: 'selectAll' }
      ]
    },
    {
      label: '查看',
      submenu: [
        {
          label: '刷新',
          accelerator: 'F5',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.reload();
            }
          }
        },
        {
          label: '强制刷新',
          accelerator: 'Ctrl+F5',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.reloadIgnoringCache();
            }
          }
        },
        { type: 'separator' },
        {
          label: '开发者工具',
          accelerator: 'F12',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.toggleDevTools();
            }
          }
        }
      ]
    },
    {
      label: '导航',
      submenu: [
        {
          label: '后退',
          accelerator: 'Alt+Left',
          click: () => {
            if (mainWindow && mainWindow.webContents.canGoBack()) {
              mainWindow.webContents.goBack();
            }
          }
        },
        {
          label: '前进',
          accelerator: 'Alt+Right',
          click: () => {
            if (mainWindow && mainWindow.webContents.canGoForward()) {
              mainWindow.webContents.goForward();
            }
          }
        }
      ]
    }
  ];
  
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
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
  event.sender.send('response', `已收到消息: ${message}`);
});

// 处理创建新标签页的请求
ipcMain.on('create-tab', (event, url) => {
  createTab(url);
});
