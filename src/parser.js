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

var path = require("path");

//Protoype used for passing the project information back to build.js
var project= {
name: "UnnamedProject",
directory: ".",
outputDirectory: "html",
src: [],
srcSuffix: "c",
typeOfSrc: "C99",
arguments: "",
isLibrary: false
};
module, exports.project = project;

module.exports.parseFile = function parseFile(fileName,lines)
{
    var _project = Object.create(project);
    _project.directory = path.dirname(fileName) + "/";
    for (lineNr in lines) {
        //Make sure there aren't any line breaks in the current line
        lines[lineNr] = lines[lineNr].replace("\r", "");
        lines[lineNr] = lines[lineNr].replace("\n", "");
        //Is this line not a comment?
        if (!lines[lineNr].indexOf("#") == 0) {
            //Does this line define the project name?
            if (lines[lineNr].substring(0, 5) == "Name:") {
                _project.name = lines[lineNr].replace("Name:", "");
            }
            //Or does it define the type of code?
            else if (lines[lineNr] == "IsC++:True") {
                _project.typeOfSrc = "C++11";
                _project.srcSuffix = "cpp";
            }
            //Or does it add a new source folder?
            else if (lines[lineNr].substring(0, 13) == "UseSrcFolder:") {
                _project.src.push(lines[lineNr].replace("UseSrcFolder:", ""));
            }
            //Or does it add a new include path?
            else if (lines[lineNr].substring(0, 17) == "UseIncludeFolder:") {
                _project.arguments += " -I" + _project.directory + "/" + lines[lineNr].replace("UseIncludeFolder:", "") + " ";
            }
            //Or does it add a new source file?
            else if (lines[lineNr].substring(0, 11) == "UseSrcFile:") {
                _project.src.push(lines[lineNr].replace("UseSrcFile:", ""));
            }
            //Or does it add a new library?
            else if (lines[lineNr].indexOf("UseLocalLibrary:") == 0) {
                _project.src.push(lines[lineNr].replace("UseLocalLibrary:", ""));
            }
            //Or does it specify the output folder?
            else if (lines[lineNr].substring(0, 13) == "OutputFolder:") {
                _project.outputDirectory = lines[lineNr].replace("OutputFolder:", "");
            }
            //Or does it specify if this is a library or not?
            else if (lines[lineNr] == "IsLibrary:True") {
                _project.isLibrary = true;
            }
            //Or does it add compiler flags?
            else if (lines[lineNr].substring(0, 24) == "AdditionalCompilerFlags:") {
                _project.arguments = lines[lineNr].replace("AdditionalCompilerFlags:", " ");
                _project.arguments += " ";
            }
            //Or is it no supported command at all?
            else {
                //Calculate the line number for the error message.(The many pluses are required because of js strange way of dealing with variable types!)
                var lineNumber = +1 + +lineNr;
                console.log("Unsupported command: (Line " + lineNumber + ") " + lines[lineNr]);
                //Skip all futher steps and stop the build process.
                process.exit(1);
            }
        }
    }
    return _project;
}
