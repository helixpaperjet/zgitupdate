const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const prefixPublicPages = `${__dirname}/public/pages`;
app.use(express.static("public"))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.sendFile(`${prefixPublicPages}/input-en.html`);
})
app.get("/data/test/:id", (req, res) => {
    var id = req.params.id;
    var data = fs.readFileSync(`${__dirname}/data/test/${id}`);
    console.log(`Queried: ${__dirname}/data/test/${id}\nStatus: 200 OK \n\n`);
    res.writeHead(200, {"Content-Type": "application/json"});
    res.write(data);
})
app.get("/about", (res) => {
    res.sendFile(`${prefixPublicPages}/about.html`);
})
app.post("/data/test/:id", (req, res) => {
    var target = req.params.id;
    console.log(`Identified file: ${target}`);
    console.log(req.body);
    console.log(JSON.stringify(req.body));
    fs.writeFileSync(`${__dirname}/data/test/${target}`, JSON.stringify(req.body));
    res.write("ok");
})
app.listen(port, () => {
    console.log(`Server listening on 127.0.0.1:${port.toString()}`);
})