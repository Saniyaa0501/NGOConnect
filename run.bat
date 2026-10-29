@echo off
cd /d "%~dp0"
start "Backend" cmd /k "venv\Scripts\activate && python manage.py runserver localhost:8000"
start "Frontend" cmd /k "cd frontend && npm start"