var express = require("express");
var bodyParser = require("body-parser");
var exec = require('child_process').exec;

var app = express();

console.log("Starting server...");

try {
  var config = require("./config.json");
}
catch(e) {
  console.error("Invalid configuration file (config.json).");
  process.exit();
}

app.use(bodyParser.json());

app.post('/event', (req, res) => {
  console.log(req.body);
  if (!req.body || !req.body.object_kind || !req.body.repository || !req.body.repository.name) {
    return res.sendStatus(400);
  }

  console.log('Receive event ' + req.body.object_kind + ' for repository ' + req.body.repository.name);

  var specificConf = config.hooks.find(hook => (!hook.event || hook.event == req.body.object_kind) &&  (!hook.repository || hook.repository == req.body.repository.name));

  if (specificConf) {
    console.log('Executing ' + specificConf.script + '...');
    exec(specificConf.script, (err,stdout,stderr) => {
      console.log(specificConf.script + ' executed');
    });

    res.sendStatus(200);
  }
  else {
    console.log('No hook found for this event');
    res.sendStatus(404);
  }
});

app.listen(config.port);
