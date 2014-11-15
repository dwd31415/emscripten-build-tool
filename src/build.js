/*
The MIT License (MIT)

Copyright (c) 2014 Adrian Dawid

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

var fs = require('fs');
var parser = require('./parser.js');

var build = 0.1;

//Holds all relevant details about the project
var projectInfo;

function main()
{
    console.log("Emscripten Build Tool by Adrian Dawid. Build:" + build);
    var projectFileName;
    projectFileName = process.argv[2];
    if (!projectFileName) {
        console.log("You must specify a project build file. For more information please visit emscripten-build-tool.github.io");
    }
    else {
        console.log(projectFileName);
        fs.readFile(projectFileName, function (err, data) {
            if (err) {
                console.log("The specefied file could not be opened or does not exist!");
                return;
            }
            var lines = data.toString().split("\n");
            projectInfo = parser.parseFile(lines);
        });
        //console.log("Building " + projectInfo.name);
        
    }
}

main();