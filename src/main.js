
import SpiceJS from "ryanspice2016-spicejs";

//adds radix support to Arrays
import "./radix.js";

//starting state
import Loading from './game/loading';

//creating the application
const Application = SpiceJS.create();

Application.OnLoad = (self) => {

	self.main = Loading;

	self.options.flags.seamless = true;
	self.options.override.SelectStart = true;
	self.options.override.ContextMenu = true;

	self.Start(320, 180);

	window.Application = this;

};
