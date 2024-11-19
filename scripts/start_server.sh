#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

sudo chmod -R 777 /home/ubuntu/curateit-logging-backend
cd ~
cd /home/ubuntu/curateit-logging-backend
pm2 kill
pm2 start npm -- start
exit 0