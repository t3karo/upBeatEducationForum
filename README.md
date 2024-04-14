### If you are making new branch

- Create your branch by cloning the master
- Never push git to the master
- run the following command:
```
npm init -y
npm i express bcrypt pg nodemon cors express-fileupload
npm run devStart
```

- then go to package.json and make the chnages : 
```
"scripts": {
    "devStart": "nodemon index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  }
```
