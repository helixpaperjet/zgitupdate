const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const app = express();
const confRead = fs.readFileSync(`${__dirname}/server_config.json`).toString();console.log(confRead);
const config = JSON.parse(confRead);
const prefixPublicPages = `${config.publicRoot}/pages`;
const port = config.port;
app.use(express.static("public"))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.sendFile(`${prefixPublicPages}/input-en.html`);
})
app.get("/data/test/:id", (req, res) => {
    var id = req.params.id;
    var data = fs.readFileSync(`${config.dataRoot}/${id}.json`);
    console.log(`GET: 200 OK => Successfully read "${__dirname}/data/test/${id}.json"`);
    res.writeHead(200, {"Content-Type": "application/json"});
    res.write(data);
    console.log(`GET: 200 OK => Successfully sent result data`)
})
app.get("/about", (res) => {
    res.sendFile(`${prefixPublicPages}/about.html`);
})
app.post("/data/test/:id", (req, res) => {
    var target = req.params.id;
    console.log(`POST: 200 OK => Identified file: ${target}.json`);
    fs.writeFileSync(`${__dirname}/data/test/${target}.json`, JSON.stringify(req.body));
    console.log(`POST: 200 OK => ${target}.json successfully overwritten`);
    res.send("ok");
})
app.get("/key/:id", (req, res) => {
    let keyOwner = req.params.id;
    console.log(`GET_KEY: 200 OK => keyOwner = ${keyOwner}`);
    let keyDataBuffer = fs.readFileSync(`${config.keyMasterFile}`);
    console.log(`GET_KEY: 200 OK => keyDataFile successfully read`);
    let keyData = JSON.parse(keyDataBuffer);
    console.log(`GET_KEY: 200 OK => keyData successfully read`);
    let key = keyData[`${keyOwner}`];
    console.log(`GET_KEY: 200 OK => key (${keyOwner}) = ${key}`);
    res.send(key);
    console.log(`GET_KEY: 200 OK => Key ${key} successfully sent`);
})
app.listen(port, () => {
    console.log(`Server listening on 127.0.0.1:${port.toString()}`);
})