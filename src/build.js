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

var build = 0.92;

//Holds all relevant details about the project
var projectInfo;

function main()
{
    console.log("                              _       _                   _           _ _     _       _              _\n"+
"  ___ _ __ ___  ___  ___ _ __(_)_ __ | |_ ___ _ __       | |__  _   _(_| | __| |     | |_ ___   ___ | |\n"+
" / _ | '_ ` _ \\/ __|/ __| '__| | '_ \\| __/ _ | '_ \\ _____| '_ \\| | | | | |/ _` |_____| __/ _ \\ / _ \\| |\n"+
"|  __| | | | | \\__ | (__| |  | | |_) | ||  __| | | |_____| |_) | |_| | | | (_| |_____| || (_) | (_) | |\n"+
" \\___|_| |_| |_|___/\\___|_|  |_| .__/ \\__\\___|_| |_|     |_.__/ \\__,_|_|_|\\__,_|      \\__\\___/ \\___/|_|\n"+
"                               |_|      ");
    console.log("Emscripten Build Tool by Adrian Dawid. Build:" + build);
    var projectFileName;
    projectFileName = process.argv[2];
    if (!projectFileName) {
        console.log("You must specify a project build file. For more information please visit emscripten-build-tool.github.io");
    }
    else {
         var data = fs.readFileSync(projectFileName,encoding="utf-8");
         //The file could not be loaded
         if (!data)
         {
             console.log("The project build file is not existing or can not be opened. For more information please visit emscripten-build-tool.github.io");
             return;
         }
         var lines = data.toString().split(endOfLine);
         //Calls the parser(parser.js), it returns a object of the type project(parser.js)
         projectInfo = parseFile(projectFileName,lines);
         var listOfSrcFiles = [];
         for (index in projectInfo.src)
         {
             //Is the path from the source list a directory?
             if (fs.lstatSync(projectInfo.directory + projectInfo.src[index]).isDirectory()) {
                 //Getting a list of all files in the directory
                 var files = fs.readdirSync(projectInfo.directory + projectInfo.src[index]);
                 for (fileNr in files) {
                     //Is the file a valid source file?
                     if (files[fileNr].endsWith(projectInfo.srcSuffix)) {
                         //Added the file with its complete path to the "to compile" list
                         listOfSrcFiles.push(projectInfo.src[index] + "/" + files[fileNr]);
                     }
                 }
             }
             else {
                 //If the path is not a directory it is a .c/.cpp file or a library and can be added to the "to compile" list directly
                 listOfSrcFiles.push(projectInfo.src[index]);
             }
         }
         //This variable shall store the command, that will eventually compile the project
         var command = "";
         if(projectInfo.typeOfSrc == "C++11")
         {
             command += "em++ ";
         }
         if (projectInfo.typeOfSrc == "C99") {
             command += "emcc ";
         }
         //Adding the "to compile" list to the command
         for(numberOfFile in listOfSrcFiles)
         {
             command += projectInfo.directory + listOfSrcFiles[numberOfFile] + " ";
         }
         //Does the output folder already exist?
         if (!fs.existsSync(projectInfo.directory + projectInfo.outputDirectory)) {
             fs.mkdirSync(projectInfo.directory + projectInfo.outputDirectory);
         }
         //Add user specific compiler flags to the command (This also adds the "-I"s for include paths to the command)
         command += projectInfo.arguments;
         //Adding information about the output file to the compiler.                                                           "If it is a library, the suffix is .bc"
         command += " -o " + projectInfo.directory + projectInfo.outputDirectory + "/" + projectInfo.name + ( projectInfo.isLibrary ? ".bc" : ".html");
         console.log("\\n");
         console.log("*************************************************");
         console.log("Building " + projectInfo.name);
         console.log("The " + (projectInfo.typeOfSrc == "C++11" ? "em++" : "emcc") + " compiler is active.");
         console.log("These source files will be built:");
         for (fileNr in listOfSrcFiles)
         {
             console.log(listOfSrcFiles[fileNr]);
         }
         console.log("*************************************************");
         //Eventually executing the command
         exec(command, function (error, stdout, stderr) {
             //Printing out the compiler output
             console.log(stdout);
             //Printing out the compiler error report
             console.log(stderr);
             if (error)
             {
                 //Printing out why the command failed
                 console.log(error);
             }
             else
             {
                 //Shall the generated .html if be run using the local browser(firefox on linux)?
                 if(process.argv[3] && !projectInfo.isLibrary)
                 {
                     if(process.argv[3].replace(" ","") == "-run")
                     {
                         console.log("*************************************************");
                         console.log("Running " + projectInfo.name);
                         //Starting the browser
                         var run = exec((process.platform === 'win32' ? "start " : ( process.platform === 'linux' ? "firefox " : "open ")) + projectInfo.directory + projectInfo.outputDirectory + "/" + projectInfo.name + ".html",
                             function (error, stdout, stderr) {
                                console.log(stdout);
                                console.log(stderr);
                                if (error)
                                   console.log(error);
                             });
                         console.log("*************************************************");
                     }
                     //Shall the generated .html if be run using emrun?
                     if (process.argv[3].replace(" ", "") == "-emrun") {
                         console.log("*************************************************");
                         console.log("Running " + projectInfo.name + " with emrun");
                         console.log("Emrun will block this termianl, you will have to force close it.");
                         //Starting emrun
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
