@echo off
chcp 65001 >nul
title Project6 1080P 本地录制入口
echo.
echo ==============================================
echo   Project6 1080P 本地录制入口
echo ==============================================
echo.
where py >nul 2>nul
if %errorlevel%==0 (
  start "" http://127.0.0.1:28444/presentations/harness-engineering/full-video.html?v=42
  py "%~dp0project6-recording-localhost.py"
  goto :eof
)
where python >nul 2>nul
if %errorlevel%==0 (
  start "" http://127.0.0.1:28444/presentations/harness-engineering/full-video.html?v=42
  python "%~dp0project6-recording-localhost.py"
  goto :eof
)
echo [ERROR] 没找到 Python。请先安装 Python 3，然后重新双击这个文件。
pause
