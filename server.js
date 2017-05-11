var express = require("express");
var bodyParser = require("body-parser");
var exec = require('child_process').exec;

var app = express();

function deep_value (obj, path) {
  for (var i = 0, path = path.split('.'), len = path.length; i < len; i++) {
    if (obj[path[i]] === undefined) return;
    obj = obj[path[i]];
  };
  return obj;
}

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
  if (!req.body || !req.body.object_kind || !req.body.repository || !req.body.repository.name) {
    return res.sendStatus(400);
  }

  console.log('Receive event ' + req.body.object_kind + ' for repository ' + req.body.repository.name);

  var specificConf = config.hooks.find(hook =>
    (!hook.token || hook.token == req.headers['x-gitlab-token'])
    && (!hook.event || hook.event == req.body.object_kind)
    && (!hook.repository || hook.repository == req.body.repository.name)
  );

  if (specificConf && specificConf.script) {
    var cmd = specificConf.script.replace(/\${([^}]+)}/g, (match, path) => (deep_value(req.body, path) || ''));
    console.log('Executing ' + cmd + ' ...');
    exec(cmd, (err, stdout, stderr) => {
      console.log(cmd + ' executed');
    });

    res.sendStatus(200);
  }
  else {
    console.log('No hook found for this event');
    res.sendStatus(404);
  }
});

app.listen(config.port);
