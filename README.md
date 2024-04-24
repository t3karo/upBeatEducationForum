### If you are making new branch

- Create your branch by cloning the master
- Never push git to the master
- run the following command:
```
npm init -y
npm i express bcrypt pg nodemon cors express-fileupload dotenv jsonwebtoken bcryptjs nodemailer
```

- then go to package.json and make the chnages : 
```
"scripts": {
    "devStart": "nodemon index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  }
```

- Update the .env file with the database details, just change the following depending upon the postgrest credentials you have in your pc.
```
PG_USER = 'postgres'
HOST = 'localhost'
DATABASE = 'upbeatedu'
PASSWORD = 'admin1234'
PORT = '5432'
DATABASE_URL = 'postgresql://postgres:admin1234@localhost:5432/upbeatedu'
```

- Then run the following command
```
npm run devStart
```