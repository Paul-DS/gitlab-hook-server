var express = require("express");
var app = express();

console.log("Starting server...");

try {
  var config = require("./config.json");
}
catch(e) {
  console.error("Invalid configuration file (config.json).");
  process.exit();
}


app.get('event', (req, res) => {
  var specificConf = config.hooks.find(hook => (!hook.event || hook.event == req.object_kind) &&  (!hook.repository || hook.repository == req.repository.name));

  if (specificConf) {
    exec(specificConf.script, (err,stdout,stderr) => {
      console.log(specificConf.script + ' executed');
    });
  }
});

app.listen(config.port);
