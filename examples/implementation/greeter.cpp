#include "greeter.h"

void Greeter::greet(std::string name)
{
	std::cout << this->greeting << name;
}