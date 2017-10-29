//@flow


import Knight from './knight';

import {
	ISprite,
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
declare var Vector;

interface IGeneralControls {
	up:number;
	down:number;
	left:number;
	right:number;
	attack:number;
}

/* */

export default class Player extends Knight {

	gamepad:any;

	constructor(data:dtoBatchDataValidation,x:number,y:number,s:number,a:number,c:number,xx:number,yy:number,w:number,h:number,visuals:IVisuals){

		super(new StatsBuffer(data,x,y,s,a,c,xx,yy,w,h,visuals));

		this.gamepad =  this.visuals.app.input.gamepads;

	}

	/**/

	get isAttacking():boolean {	return this.pState =="attack"; }

	/* TODO: move to spicejS input as generic output for input */

	get inputControls():IGeneralControls{

		let input = this.visuals.app.input;
		let keyboard = input.keyController;
		//TODO: add gamepads to get in app.client in #TodoSpiceJS
		let gamepad = this.gamepad;

		return {
			up:Number(gamepad.up||keyboard.keyboardCheck('uparrow')||keyboard.keyboardCheck('w')),
			down:Number(gamepad.down||keyboard.keyboardCheck('downarrow')||keyboard.keyboardCheck('s')),
			left:Number(gamepad.left||keyboard.keyboardCheck('leftarrow')||keyboard.keyboardCheck('a')),
			right:Number(gamepad.right||keyboard.keyboardCheck('rightarrow')||keyboard.keyboardCheck('d')),
			attack:Number(gamepad.y||keyboard.keyboardCheck('space')||keyboard.keyboardCheck('e')||input.pressed)
		}

	}

	/* Uses generic controls - TODO: disable for touch*/

	controls(){

		let input:IGeneralControls = this.inputControls;

		let vel_x:number = this.agility/10 * (-input.left + input.right);

		if (vel_x)
			this.velocity.x = vel_x,this.pState = 'walk';

		this.dir = (vel_x>=0)?0.5:-0.5;

		if (input.attack){

			this.velocity.x /=10000;
			this.pState = 'attack';

			if (this.index<9){

				this.index+=0.05;

				if (vel_x)
					this.index+=0.01;

			} else {

				this.index = 0;

			}

		}

	}

	/**/

	collideWithEnemy(enemy:ISprite){

		this.velocity.x *=0.9;

		if (enemy.pState=="attack")
		if (enemy.getIndex()==8){


			if (enemy.getX()<=this.getX())
			this.velocity.x += this.dir*1;
			else
			this.velocity.x -= this.dir*1;

		}

	}

	//region unused

	/* UNUSED

	gamepadControls(){

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
	*/

	/* UNUSED

	keyboardControls(){

		if ((this.visuals.app.input.keyController.keyboardCheck('space'))||(this.visuals.app.input.pressed))
			this.pState = 'attack';

		if (this.visuals.app.input.keyController.keyboardCheck('a'))
			this.pState = 'walk',this.velocity.x=-this.agility/10;//,this.position.x+=this.dir;

		if (this.visuals.app.input.keyController.keyboardCheck('d'))
			this.pState = 'walk',this.velocity.x=this.agility/10;//,this.position.x+=this.dir;

	}

	*/

	//endregion unused

}

Player.offset = new Vector(0,0);
Player.position = new Vector(0,0);
