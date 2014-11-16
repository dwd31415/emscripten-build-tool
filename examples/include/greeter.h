#pragma once

#include <iostream>
#include <string>

class Greeter{
public:
	void greet(std::string name);
private:
	const std::string greeting = "Hello, ";
};