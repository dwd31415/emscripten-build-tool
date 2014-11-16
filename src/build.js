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
var exec = require('child_process').exec;
var endOfLine = require('os').EOL;
var project = require('./parser.js').project;
var parseFile = require('./parser.js').parseFile;

if (typeof String.prototype.endsWith !== 'function') {
    String.prototype.endsWith = function (suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
}

var build = 0.8;

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
         var data = fs.readFileSync(projectFileName,encoding="utf-8");
         if (!data)
         {
             console.log("The project build file is not existing or can not be opened. For more information please visit emscripten-build-tool.github.io");
             return;
         }
         var lines = data.toString().split(endOfLine);
         projectInfo = parseFile(projectFileName,lines);
         var listOfSrcFiles = [];
         for (index in projectInfo.src)
         {

             if (fs.lstatSync(projectInfo.directory + projectInfo.src[index]).isDirectory()) {
                 var files = fs.readdirSync(projectInfo.directory + projectInfo.src[index]);
                 for (fileNr in files) {
                     if (files[fileNr].endsWith(projectInfo.srcSuffix)) {
                         listOfSrcFiles.push(projectInfo.src[index] + "/" + files[fileNr]);
                     }
                 }
             }
             else {
                 listOfSrcFiles.push(projectInfo.src[index]);
             }
         }
         var command = "";
         if(projectInfo.typeOfSrc == "C++11")
         {
             command += "em++ ";
         }
         if (projectInfo.typeOfSrc == "C99") {
             command += "emcc ";
         }
         for(numberOfFile in listOfSrcFiles)
         {
             command += projectInfo.directory + listOfSrcFiles[numberOfFile] + " ";
         }
         if (!fs.existsSync(projectInfo.directory + projectInfo.outputDirectory)) {
             fs.mkdirSync(projectInfo.directory + projectInfo.outputDirectory);
         }
         command += projectInfo.arguments;
         command += " -o " + projectInfo.directory + projectInfo.outputDirectory + "/" + projectInfo.name + ( projectInfo.isLibrary ? ".bc" : ".html");
         console.log("\n");
         console.log("*************************************************");
         console.log("Building " + projectInfo.name);
         console.log("The " + (projectInfo.typeOfSrc == "C++11" ? "em++" : "emcc") + " compiler is active.");
         console.log("These source files will be built:");
         for (fileNr in listOfSrcFiles)
         {
             console.log(listOfSrcFiles[fileNr]);
         }
         console.log("*************************************************");
         exec(command, function (error, stdout, stderr) {
             console.log(stdout);
             console.log(stderr);
             if (error)
             {
                 console.log(error);
             }
             else
             {
                 if(process.argv[3] && !projectInfo.isLibrary)
                 {
                     if(process.argv[3].replace(" ","") == "-run")
                     {
                         console.log("*************************************************");
                         console.log("Running " + projectInfo.name);
                         var run = exec((process.platform === 'win32' ? "start " : ( process.platform === 'linux' ? "firefox " : "open ")) + projectInfo.directory + projectInfo.outputDirectory + "/" + projectInfo.name + ".html",
                             function (error, stdout, stderr) {
                                console.log(stdout);
                                console.log(stderr);
                                if (error)
                                   console.log(error);
                             });
                         console.log("*************************************************");
                     }
                     if (process.argv[3].replace(" ", "") == "-emrun") {
                         console.log("*************************************************");
                         console.log("Running " + projectInfo.name + " with emrun");
                         console.log("Emrun will block this termianl, you will have to force close it.");
                         var run = exec("emrun " + projectInfo.directory + projectInfo.outputDirectory + "/" + projectInfo.name + ".html",
                             function (error, stdout, stderr) {
                                 console.log(stdout);
                                 console.log(stderr);
                                 if (error)
                                     console.log(error);
                             });
                         console.log("*************************************************");
                     }
                 }
              }
         });
    }
}

main();
