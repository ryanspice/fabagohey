//@flow

import Knight from './knight';

import {
	IVisuals
	// $FlowFixMe
} from '../../node_modules/ryanspice2016-spicejs/src/modules/core/interfaces/ITypes.js';

import type {
	dtoDrawData,
	dtoBatchDataValidation
} from './core/interfaces';

import {
	StatsBuffer
} from './utils';

export default class Player extends Knight {

	gamepad:any;

	constructor(data:dtoBatchDataValidation,x:number,y:number,s:number,a:number,c:number,xx:number,yy:number,w:number,h:number,visuals:IVisuals){

		super(new StatsBuffer(data,x,y,s,a,c,xx,yy,w,h,visuals));

		this.gamepad =  this.visuals.app.input.gamepads;

	}

	gamepadControls(){

		//TODO: add gamepads to get in app.client in #TodoSpiceJS
		let gamepad = this.gamepad;// = this.visuals.app.input.gamepads;

		if (!gamepad)
			return;

		if (gamepad.a)
			this.dir=this.dir/1000,this.diry=this.diry/10000,this.pState = 'block',this.index+=0.1;

		if ((gamepad.left)||(gamepad.right))
		if (gamepad.x)
			this.position.x+=this.dir, this.index+=0.1;

		if (gamepad.left)
			this.position.x+=this.dir,this.pState = 'walk', this.dir = -0.5;
		if (gamepad.right)
			this.position.x+=this.dir,this.pState = 'walk', this.dir = 0.5;


		if (gamepad.up)
			this.position.y+=this.diry,this.pState = 'walk', this.diry = -0.5;
		if (gamepad.down)
			this.position.y+=this.diry,this.pState = 'walk', this.diry = 0.5;

		if (gamepad.a)
			this.pState = 'block',this.index+=0.1;


		if (gamepad.y){

			this.dir = this.dir/10000, this.diry = this.diry/10000, this.pState = 'attack';

		}

	}

	keyboardControls(){

		if (this.visuals.app.input.keyController.keyboardCheck('space'))
			this.pState = 'attack';
		if (this.visuals.app.input.pressed)
			this.pState = 'attack';

		if (this.visuals.app.input.keyController.keyboardCheck('a'))
			this.pState = 'walk',this.velocity.x=-this.agility/10;//,this.position.x+=this.dir;

		if (this.visuals.app.input.keyController.keyboardCheck('d'))
			this.pState = 'walk',this.velocity.x=this.agility/10;//,this.position.x+=this.dir;

	}

	controls(){

		this.gamepadControls();
		this.keyboardControls();

	}

}

Player.offset = new Vector(0,0);
Player.position = new Vector(0,0);
