@echo off

rem 设置脚本执行的当前目录为脚本所在目录
cd /d "%~dp0"

echo ================================
echo 一键解决 Electron 安装问题脚本
echo ================================
echo.

rem 步骤 1：全局安装 nrm
echo 步骤 1：全局安装 nrm
npm install nrm -g --unsafe-perm
echo.

rem 步骤 2：用 nrm 切换到淘宝镜像
echo 步骤 2：用 nrm 切换到淘宝镜像
echo 查看所有可用源：
nrm ls
echo.
echo 切换到淘宝源：
nrm use taobao
echo.
echo 验证是否切换成功：
nrm current
echo.

rem 步骤 3：设置 Electron 镜像环境变量
echo 步骤 3：设置 Electron 镜像环境变量
set ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/
echo 已设置 ELECTRON_MIRROR=%ELECTRON_MIRROR%
echo.

rem 步骤 4：禁用 SSL 验证
echo 步骤 4：禁用 SSL 验证
npm config set strict-ssl false
echo 已禁用 SSL 验证
echo.

rem 步骤 5：重新安装依赖
echo 步骤 5：重新安装依赖
npm install
echo.

rem 步骤 6：执行构建命令
echo 步骤 6：执行构建命令
npm run build
echo.

echo ================================
echo 脚本执行完成！
echo ================================
echo.
echo 请检查构建结果，构建产物应该在 doubao-desktop-1.0.1 目录中
echo.
pause