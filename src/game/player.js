//@flow

declare var Vector;

import Knight from './knight';

import {
	ISprite,
	IVisuals
	// $FlowFixMe
} from '../../node_modules/ryanspice2016-spicejs/src/modules/core/interfaces/ITypes.js';

import type {
	dtoBatchDataValidation
} from './core/interfaces';

import {
	StatsBuffer
} from './utils';

interface IGeneralControls {
	up:number;
	down:number;
	left:number;
	right:number;
	attack:number;
}

/* */

export default class Player extends Knight {

	static offset:any;

	gamepad:any;

	health:any = 4;



	/**/

	constructor(data:dtoBatchDataValidation,x:number,y:number,s:number,a:number,c:number,xx:number,yy:number,w:number,h:number,visuals:IVisuals){

		super(new StatsBuffer(data,x,y,s,a,c,xx,yy,w,h,visuals));

		this.gamepad =  this.visuals.app.input.gamepads;

	}

	/**/

	get isAttacking():boolean {	return this.pState === "attack"; }

	/* TODO: move to spicejS input as generic output for input */

	get inputControls():IGeneralControls{

		let input = this.visuals.app.input;
		let keyboard = input.keyController;

		//TODO: add gamepads to get in app.client in #TodoSpiceJS
		this.gamepad =  this.visuals.app.input.gamepads;
		let gamepad = this.gamepad;

		return {
			'up':Number(gamepad.up||keyboard.keyboardCheck('uparrow')||keyboard.keyboardCheck('w')),
			'down':Number(gamepad.down||keyboard.keyboardCheck('downarrow')||keyboard.keyboardCheck('s')),
			'left':Number(input.dist.x<0||gamepad.left||keyboard.keyboardCheck('leftarrow')||keyboard.keyboardCheck('a')),
			'right':Number(input.dist.x>0||gamepad.right||keyboard.keyboardCheck('rightarrow')||keyboard.keyboardCheck('d')),
			'attack':Number(gamepad.y||keyboard.keyboardCheck('space')||keyboard.keyboardCheck('e')||(input.pressed&&input.dist.x<0.75&&input.dist.x>-0.75))
		}

	}

	/* Uses generic controls - TODO: disable for touch*/

	controls(){

		this.velocity.x *=0.9;
		this.velocity.y *=0.9;
		let input:IGeneralControls = this.inputControls;

		let vel_x:number = this.agility/10 * (-input.left + input.right);
		let vel_y:number = this.agility/10 * (-input.up + input.down);

		if (vel_x){
			this.velocity.x = vel_x,this.pState = 'walk';}

		if (vel_y){
			this.velocity.y = vel_y,this.pState = 'walk';
			}

		this.dir = (vel_x>=0)?0.5:-0.5;

		if (this.pState!=='block'){

			if (this.pState!=='attack'){

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
		}

	}

	/* Handle collision with enemy */

	collideWithEnemy(enemy:ISprite){


		if (enemy.pState==="attack"){

			if (Number(enemy.getIndex())===8){

				if (enemy.getX()<=this.getX()){
					this.velocity.x += this.dir*1;
				}else{
					this.velocity.x -= this.dir*1;
				}

				this.pState = 'block';
				this.index = 5;

			}

		}

	}

}

Player.offset = new Vector(0,0);
Player.position = new Vector(0,0);
