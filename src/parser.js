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
name: "",
directory: "",
outputDirectory: "html",
src: [],
srcSuffix: "c",
typeOfSrc: "C99",
arguments: ""
};
module, exports.project = project;

module.exports.parseFile = function parseFile(fileName,lines)
{
    var _project = Object.create(project);
    _project.directory = path.dirname(fileName) + "/";
    for (lineNr in lines) {
        if(lines[lineNr].substring(0,5) == "Name:")
        {
            _project.name = lines[lineNr].replace("Name:", "");
        }
        if (lines[lineNr].indexOf("IsC++:True") == 0) {
            _project.typeOfSrc = "C++11";
           _project.srcSuffix = "cpp";
        }
        if (lines[lineNr].substring(0,13) == "UseSrcFolder:")
        {
            _project.src.push(lines[lineNr].replace("UseSrcFolder:", ""));
        }
        if (lines[lineNr].substring(0, 17) == "UseIncludeFolder:") {
            _project.arguments += " -I" + _project.directory + "/" +lines[lineNr].replace("UseIncludeFolder:", "") + " ";
        }
        if (lines[lineNr].substring(0, 11) == "UseSrcFile:") {
            _project.src.push(lines[lineNr].replace("UseSrcFile:", ""));
        }
        if (lines[lineNr].substring(0, 13) == "OutputFolder:") {
            _project.outputDirectory = lines[lineNr].replace("OutputFolder:", "");
        }
        if (lines[lineNr].substring(0, 24) == "AdditionalCompilerFlags:") {
            _project.arguments = lines[lineNr].replace("AdditionalCompilerFlags:", " ");
            _project.arguments += " ";
        }
    }
    return _project;
}