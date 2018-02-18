# Youtube Chat
By using Node.js, the web-app that allows users to store their YouTube live chat and filter them by author.

## Prerequisites
### Run MongoDB on AWS Ubuntu
1. `sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 2930ADAE8CAF5059EE73BB4B58712A2291FA4AD5`
2. `echo "deb [ arch=amd64,arm64 ] http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/testing multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.6.list`
3. `sudo apt-get update`
4. `sudo apt-get install -y mongodb-org`
5. `sudo service mongod start`

## Usage
1. npm install
2. npm start
