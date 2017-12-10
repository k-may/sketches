var fs = require('fs-extra');
var prompt = require('prompt');

var schema = {
  properties: {
    name: {},
    author: {
      default: require("os").userInfo().username
    }
  }
};


prompt.start();

prompt.get(schema, function (err, result) {

  if (err) {
    return onErr(err);
  }

  var name = result.name;

  fs.copy('app/scripts/ts/sketches/Template', 'app/scripts/ts/sketches/' + name);

  var config = fs.readFileSync('app/data/config.json');
  config = JSON.parse(config);

  var sketches = config.sketches;
  sketches[name] = {
    "View": name + "/sketch",
    "Date": Date.now(),
    "Author": result.author
  };

  fs.writeFile('app/data/config.json', JSON.stringify(config));

});
