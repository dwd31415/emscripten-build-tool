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
        lines[lineNr] = lines[lineNr].replace("\r", "");
        lines[lineNr] = lines[lineNr].replace("\n", "");
        if (!lines[lineNr].indexOf("#") == 0) {
            if (lines[lineNr].substring(0, 5) == "Name:") {
                _project.name = lines[lineNr].replace("Name:", "");
            }
            else if (lines[lineNr] == "IsC++:True") {
                _project.typeOfSrc = "C++11";
                _project.srcSuffix = "cpp";
            }
            else if (lines[lineNr].substring(0, 13) == "UseSrcFolder:") {
                _project.src.push(lines[lineNr].replace("UseSrcFolder:", ""));
            }
            else if (lines[lineNr].substring(0, 17) == "UseIncludeFolder:") {
                _project.arguments += " -I" + _project.directory + "/" + lines[lineNr].replace("UseIncludeFolder:", "") + " ";
            }
            else if (lines[lineNr].substring(0, 11) == "UseSrcFile:") {
                _project.src.push(lines[lineNr].replace("UseSrcFile:", ""));
            }
            else if (lines[lineNr].indexOf("UseLocalLibrary:") == 0) {
                _project.src.push(lines[lineNr].replace("UseLocalLibrary:", ""));
            }
            else if (lines[lineNr].substring(0, 13) == "OutputFolder:") {
                _project.outputDirectory = lines[lineNr].replace("OutputFolder:", "");
            }
            else if (lines[lineNr] == "IsLibrary:True") {
                _project.isLibrary = true;
            }
            else if (lines[lineNr].substring(0, 24) == "AdditionalCompilerFlags:") {
                _project.arguments = lines[lineNr].replace("AdditionalCompilerFlags:", " ");
                _project.arguments += " ";
            }
            else {
                var lineNumber = +1 + +lineNr;
                console.log("Unsupported command: (Line " + lineNumber + ") " + lines[lineNr]);
                process.exit(1);
            }
        }
    }
    return _project;
}
