@echo off

cd /d C:\iron-path\frontend
call npm run build

cd /d C:\iron-path

git add .

set /p msg=Commit message:

if "%msg%"=="" set msg=update

git commit -m "%msg%"
git push origin main

ssh root@91.92.33.168 "/var/www/deploy-iron-path.sh"

pause