//@flow

import debug from '../config';

/* TODO: implement class features to SpiceJS */

declare var Vector;

import type {
	dtoDrawData,
	dtoBatchDataValidation
} from './core/interfaces';

/* Imports from SpiceJS */

import {
	State
	// $FlowFixMe
} from 'ryanspice2016-spicejs';

/*
import {
	IVector,
	IState,
	IVisuals,
	IStatsBuffer
	// $FlowFixMe
} from '../../node_modules/ryanspice2016-spicejs/src/modules/core/interfaces/ITypes.js';
*/

/*
	handles all physics for moving characterlike objects
*/

export default class NewState extends State {

	/** Construct and assign privates
	* @param [Object] obj - Pass an object with update, draw, init.
	* @method */

	constructor(obj:any, app:Object|void) {

		super(obj,app);

	}

	/** This method is overridden to draw the state.
	* @method
	* @override	*/

	update():void {}

	/** This method is overridden to draw the state.
	* @method
	* @override	*/

	draw():void {}

	/** Method is overridden to name the state.
	* @method
	* @override	*/

	name():void {}

	/** This method is overridden to initialize the state.
	* @method
	* @override	*/

	init():void {}
}
