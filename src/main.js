
import SpiceJS from "ryanspice2016-spicejs";

import Loading from './game/loading';

const Application = SpiceJS.create();

Application.OnLoad = (self) => {

	self.main = Loading;

	self.Start(320, 180);

	window.Application = this;

};
