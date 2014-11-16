#include"greeter.h"

int main()
{
	auto greeter = new Greeter();
	greeter->greet("World");
	greeter->greet("User");
	delete greeter;
	return 0;
}