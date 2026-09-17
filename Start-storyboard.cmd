@echo off
cd /d "%~dp0"
start "" "http://127.0.0.1:4173/local/"
"C:\Users\Fair-04\AppData\Local\Programs\Python\Python312\python.exe" -m http.server 4173 --bind 127.0.0.1
pause
