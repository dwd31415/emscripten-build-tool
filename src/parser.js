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

var project = {
    name: "",
    directory: "",
    outputDirectory: "",
    src: [],
    srcSuffix: ".c",
    typeOfSrc: "C99",
    arguments: ""
};

function parseFile(lines)
{
    var _project = Object.create(project);
    for (lineNr in lines) {
        var line = lines[lineNr];
        if(line.substring(0,5) == "Name:")
        {
            _project.name = line.replace("Name:", "");
        }
        if (line.substring(0, 10) == "SrcSuffix:") {
            _project.srcSuffix = line.replace("SrcSuffix:", "");
        }
        if (line.substring(0,13) == "UseSrcFolder:")
        {
            _project.src.push(line.replace("UseSrcFolder:", ""));
        }
        if (line.substring(0, 13) == "OutputFolder:") {
            _project.outputDirectory = line.replace("OutputFolder:", "");
        }
        console.log('line');
    }
}