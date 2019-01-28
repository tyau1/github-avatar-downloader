var request = require('request');
var token = require('/secrets');
var args = process.argv.splice(2);

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
    var options = {
        url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
        headers: {
            'User-Agent': 'request',
            'Authorization': 'token' + token.GITHUB_TOKEN
        }
    }
    request(options, function (error, response, body) {
        if (response.statusCode > 200) {
          error = response.statusCode;
        }
        var data = JSON.parse(body);
        cb(error, data);
      })
}

function downloadImageByURL(url, filePath) {
    var fs = require('fs');
    request.get(url)
        .on('error', function (error) {
            throw error;
        })
        .on('response', function (response) {
            console.log("Status", response.statusCode);
        })
        .pipe(fs.createWriteStream(filePath));
}

getRepoContributors(args[0], args[1], function (error, contributors) {
    if (error) {
        console.log('ERROR: ', error);
        return;
    }
    contributors.forEach(function (contributor) {
        downloadImageByURL(contributor.avatar_url, "./download/" + contributor.login + ".jpg");
    })
})