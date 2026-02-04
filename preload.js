const { contextBridge, ipcRenderer } = require('electron');

// 向渲染进程暴露API
contextBridge.exposeInMainWorld('electronAPI', {
  // 示例：发送消息到主进程
  sendMessage: (message) => ipcRenderer.send('message', message),
  // 示例：接收来自主进程的消息
  onResponse: (callback) => ipcRenderer.on('response', (event, ...args) => callback(...args))
});

// 页面加载完成后执行
window.addEventListener('DOMContentLoaded', () => {
  console.log('页面加载完成');
  // 可以在这里添加一些页面初始化操作
});
