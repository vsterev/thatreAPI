"# theatre-plays" 

The project is working on local MongoDB and cloud MongoDB, by default is set to use a local base.
As default port is configured  4000, so you can access it on address http://localhost:4000
To start the project please type:
1) "npm install" - to install all dependencies
2) "npm run start" - star the project

The project is using Express, MongoDb, Mongoose, Handelbars, jwt, cookies, bcrypt, nodemon.
For security purpose is made the black token list too, for all users that were logout.
All errors handlings are made in mongoose Schema.

If you want to use a cloud MongoDB please change the /config/config.js:
from -> const env = process.env.NODE_ENV || 'local' 
to -> const env = process.env.NODE_ENV || 'cloud';
In this case the adress and port will be http://localhost:3000, you should set also the DB_USER = 'vasko', and DB_PASS = 'vas2014eli';

The sorting - bonus part is also done.
