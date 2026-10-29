@echo off
cd /d "%~dp0"
python -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt
mysql -u root -psaniya2006 -e "CREATE DATABASE IF NOT EXISTS ngodb;"
python manage.py migrate
cd frontend
call npm install
echo Setup complete
pause