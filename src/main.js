
import SpiceJS from "ryanspice2016-spicejs";

import "./radix.js";

import Loading from './game/loading';

const Application = SpiceJS.create();

Application.OnLoad = (self) => {

	self.main = Loading;

	self.options.flags.seamless = true;
	self.options.override.SelectStart = true;
	self.options.override.ContextMenu = true;

	self.Start(320, 180);


	window.Application = this;

};
