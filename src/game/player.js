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

	controls(){

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

		if (this.visuals.app.input.keyController.keyboardCheck('space'))
			this.pState = 'attack';
		if (this.visuals.app.input.pressed)
			this.pState = 'attack';

		if (this.visuals.app.input.keyController.keyboardCheck('a'))
			this.pState = 'walk',this.dir=-0.5,this.position.x+=this.dir;

		if (this.visuals.app.input.keyController.keyboardCheck('d'))
			this.pState = 'walk',this.dir=0.5,this.position.x+=this.dir;


	}

	update(){
		let t = new Date().getTime();
		let z;


		this.controls();
		this.bounds();

		if (this.x<20)
			this.x+=1,this.pState = 'walk';
		if (this.x<=20)
			this.x+=1,this.pState = 'idle';


		this.off = {y:-2};

		if (this.pState != 'attack'){

			this.yy = 0;
			this.h = 42;
			this.xx=0;
			this.w = (167/4);

			//		this.pState = 'idle';
		}


		switch(this.pState){

			case 'walk':

				this.img = this.sprWalk;
				z = (336/8);
				this.xx =z*Math.round(this.index);


				if (this.index<7)
					this.index+=0.1;
					else
					this.index = -0.5;

			break;

			case 'block':

				this.img = this.sprBlock;
				z = (294/7);
				this.xx =z*Math.round(this.index);

				if (this.index<5.4)
					this.index+=0.1;
					else
					this.index = 6;

			break;

			case 'idle':

				this.img = this.sprIdle;
				z = (168/4);
				this.xx =z*Math.round(this.index);
				this.index = 1+Math.sin(t/360)*1;
				/*
				if (this.index<3.4)
					this.index+=0.05;
					else
					this.index = -0.5;
				*/
			break;

			case 'attack':

				this.h = 80;
				this.w = (800/10);
				this.img = this.sprAttack;
				z = (800/10);
				this.xx =-20 + z*Math.round(this.index);

				this.off = {y:3};

				if (this.visuals.app.input.pressed)
				if (this.index<3)
				this.index +=0.1;

				//if (!this.visuals.app.input.pressed)
				if (this.index<3)
				this.index +=0.1;
				else {

					if (this.visuals.app.input.pressed)
					if (this.index<7)
					this.index +=0.1;
					else
					this.pState = 'idle';

				}

					//if (this.visuals.app.input.pressed)
					if (this.index>3)
					if (this.index<7)
					this.index +=0.1;
					else
					this.pState = 'idle';

				//4+Math.sin(t/(360-this.agility))*4;
				/*
				if (this.index<3.4)
					this.index+=0.05;
					else
					this.index = -0.5;
				*/
			break;

		}

	}

}

Player.offset = new Vector(0,0);
Player.position = new Vector(0,0);
