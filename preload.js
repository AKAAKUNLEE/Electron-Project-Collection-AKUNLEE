const { contextBridge, ipcRenderer } = require('electron');

// 向渲染进程暴露API
contextBridge.exposeInMainWorld('electronAPI', {
  // 获取应用版本
  getAppVersion: () => ipcRenderer.invoke('get-app-version')
});

// 页面加载完成后执行
window.addEventListener('DOMContentLoaded', () => {
  console.log('页面加载完成');
});
