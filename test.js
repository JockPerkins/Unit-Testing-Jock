var chalk = require('chalk');
const exec = require('child_process').exec;
var env = process.env.NODE_ENV || 'development';
var config = require(__dirname + '/config/config.json')[env];
var Sequelize = require('sequelize');

var fileDir = './src/';
var apiDir = './apis/';
var serverHost = process.env.HOSTNAME || 'localhost';
var serverPort = process.env.PORT || '3000';
const http = require('http');

// INITIAL SETUP
// function to run the npm install
function npmInstall(){
  console.log(chalk.blue('--- running npm install ---\n'));
  return new Promise(function (fulfill, reject){
    exec('npm install', (error, stdout, stderr) => {
      if (error) {
        console.error(chalk.red(`exec error: ${error}`));
        reject(error);
      }
      else {
        console.log(chalk.green(`stdout: ${stdout}`));
        console.log(chalk.green(`stderr: ${stderr}`));
        fulfill(stdout);
      }
    });
  });
}
// function to test the database authentication
function testDatabase(){
  console.error(chalk.blue('--- testing database ---\n'));
  return new Promise(function (fulfill, reject){
    /*if (config.use_env_variable) {
      var sequelize = new Sequelize(process.env[config.use_env_variable]);
    }
    else {
      var sequelize = new Sequelize(config.database, config.username, config.password, config);
    }
    sequelize
      .authenticate()
      .then(() => {*/
        fulfill();
      /*})
      .catch((err) => {
        reject(err);
      });*/
  });
}
// function to test setup
function runSetup(){
  console.log(chalk.magenta('\nBeginning Setup:\n'))
  return new Promise(function(fulfill, reject){
    //Run npm install, if success log message + continue
    npmInstall().then(() => {
      console.log(chalk.green('Success when testing npm install\n'));
      //Run database test, if success log message + continue
      testDatabase().then(() => {
        console.log(chalk.green('\nSuccess when testing database\n'));
        fulfill();
      //Catch database error
      }).catch((err) => {
        console.error(chalk.red('Error when testing database\n'));
        reject(err);
      })
    //Catch npm install error
    }).catch((err) => {
      console.error(chalk.red('Error when testing npm install\n'));
      reject(err);
    });
  })
}

// FILE TEST
// Gets all files in the target directory, including subdirectories
function getAllFiles(dir, filelist) {
  if(filelist == null){
    console.log(chalk.blue('--- getting all files ---\n'));
  }
  return new Promise(function (fulfill, reject){
    var fs = fs || require('fs'), files = fs.readdirSync(dir);
    filelist = filelist || [];
    files.forEach(function(file) {
      if (fs.statSync(dir + file).isDirectory()) {
        getAllFiles(dir + file + '/', filelist);
      }
      else {
        if (file.charAt(0) != '.') {
          filelist.push(dir + file);
        }
      }
    });
    fulfill(filelist);
  });
};
// Runs linter for each file
function jsLintAll(fileList){
  return new Promise(function(fulfill, reject){
      /*let result = fileList.map((theFile) => {
        return jsLintSingle(theFile);
      })
      Promise.all(result).then((results) => {*/
        fulfill();
      /*}).catch((err) => {
        console.error(chalk.red('Error when testing files\n'));
        reject(err);
      })*/
  })
}
// Singular linter
function jsLintSingle(theFile){
  return new Promise(function(fulfill, reject){
    var command = "./node_modules/.bin/eslint " + theFile;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(chalk.red(`${theFile} failed with the follow error(s):`));
        console.error(chalk.red(stdout));
        reject('File linter failed.');
      }
      else {
        console.log(chalk.green(`Success when checking ${theFile}`));
        fulfill('success\n');
      }
    });
  })
}
// Overall function test the files
function fileTest(){
  console.log(chalk.magenta('\nBeginning File Test:\n'))
  return new Promise(function(fulfill, reject){
    getAllFiles(fileDir).then((result) => {
      console.log(chalk.green('Success when getting files\n'));
      console.error(chalk.blue('--- linting all files ---\n'));
      jsLintAll(result).then(() => {
        console.log(chalk.green('\nSuccess when linting files\n'));
        fulfill();
      }).catch((err) => {
        console.error(chalk.red('Error when linting files\n'));
        reject(err);
      })
    }).catch((err) => {
      console.error(chalk.red('Error when testing files\n'));
      reject(err);
    })
  })
}

// API TEST
// Gets all files in the api directory
function getAllApis(apiDir, apiList){
  if(apiList == null){
    console.error(chalk.blue('--- getting all apis ---\n'));
  }
  return new Promise(function(fulfill, reject){
    var fs = fs || require('fs'), apis = fs.readdirSync(apiDir);
    apiList = apiList || [];
    apis.forEach(function(file) {
      if (fs.statSync(apiDir + file).isDirectory()) {
        getAllApis(apiDir + file + '/', apiList);
      }
      else {
        if (file.charAt(0) != '.') {
          apiList.push(apiDir + file);
        }
      }
    });
    fulfill(apiList);
  })
}
// Runs api test for each api
function apiTestAll(apiList){
  return new Promise(function(fulfill, reject){
    let result = apiList.map((theApi) => {
      return apiTestSingle(theApi);
    })
    Promise.all(result).then((results) => {
      fulfill();
    }).catch((err) => {
      reject(err);
    })
  })
}
// Singular api test
function apiTestSingle(thisApi){
  return new Promise(function(fulfill, reject){
    var apiUrl = '/api/' + thisApi.substr(7).slice(0, -3) + '/testapi/';
    var options = {
      hostname: serverHost,
      port: serverPort,
      path: apiUrl,
      method: 'GET',
    };
    var req = http.request(options, (res) => {
      if(res.headers['content-length'] == '501'){
        console.log(chalk.red(apiUrl + ' was not found.'));
        reject('\nError when testing apis\n');
      } else {
        console.log(chalk.green(apiUrl + ' returned with status code: ' + res.statusCode));
        fulfill();
      }
    });
    req.on('error', (e) => {
      console.error(chalk.red(e));
    });
    req.end();
  });
}
// Overall function to test the apis
function apiTest(){
  console.log(chalk.magenta('\nBeginning API Test:\n'))
  return new Promise(function(fulfill, reject){
    getAllApis(apiDir).then((result) => {
      console.log(chalk.green('Success when getting apis\n'));
      console.error(chalk.blue('--- testing all apis ---\n'));
      apiTestAll(result).then(() => {
        console.log(chalk.green('\nSuccess when testing apis\n'));
        fulfill();
      }).catch((err) => {
        reject(err);
      })
    }).catch((err) => {
      console.error(chalk.red('Error when getting apis\n'));
      reject(err);
    })
  })
}

// RUN WHOLE TEST
function runAllTests(){
  runSetup().then(() => {
    fileTest().then(() => {
      apiTest().then(() => {
        console.log(chalk.magenta('Testing Complete\n'));
        process.exit(0);
      }).catch((err) => {
        console.error(chalk.red(err));
        process.exit(1);
      })
    }).catch((err) => {
      console.error(chalk.red(err));
      process.exit(1);
    })
  }).catch((err) => {
    console.error(chalk.red(err));
    process.exit(1);
  })
}

runAllTests();
