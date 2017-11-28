//@flow

import {
	State
	// $FlowFixMe
} from 'ryanspice2016-spicejs';

import {
	IStatsBuffer,
	ISprite,
	IVisuals,
	IApp
	// $FlowFixMe
} from '../../node_modules/ryanspice2016-spicejs/src/modules/core/interfaces/ITypes.js';

import type {
	dtoDrawData,
	dtoBatchDataValidation
} from './core/interfaces';

import {
	StatsBuffer
} from './utils';

import Game from './game';

import ParallaxBackground from './background';
import Spinner from './ui/spinner';

class BackgroundController {

	backgrounds:Array<ParallaxBackground> = [];
	images:Array<ISprite> = [];
	stats:dtoBatchDataValidation;

	visuals:IVisuals;
	app:IApp;

	constructor(stats:dtoBatchDataValidation, visuals:IVisuals){

		this.visuals = visuals;
		this.app = this.visuals.app;

		this.images = [
			this.app.client.loader.getImageReference('./parallax-forest-back-trees'),
			this.app.client.loader.getImageReference('./parallax-forest-lights'),
			this.app.client.loader.getImageReference('./parallax-forest-middle-trees'),
			this.app.client.loader.getImageReference('./parallax-forest-front-trees'),
		];


		this.stats = stats;
		for(let i = 3; i >= 0; i--){

			this.backgrounds.push(new ParallaxBackground(this.images[i],0,0,1.2,1,0,0,0,272,160,this.visuals,i));

		}

	}

	/* Update all parallax backgrounds */

	updateAll(){

		this.backgrounds.forEach(background => background.updateAll());

	}

}

/* Loading state */

class Loading extends State {

	constructor(){

		super(Loading);

	}

	static async init(){

		this.spinner =  new Spinner(this.visuals,1);

		this.app.client.loader.graphics = this.graphics;

		this.app.client.loader.asyncLoadImage('./Cursive1_MyEdit','c1').then(()=>
		this.app.client.loader.asyncLoadImage('./Untitled','ut').then(()=>
		this.app.client.loader.asyncLoadImage('./parallax-forest-back-trees','s1').then(()=>
		this.app.client.loader.asyncLoadImage('./parallax-forest-front-trees','s2').then(()=>
		this.app.client.loader.asyncLoadImage('./parallax-forest-lights','s1').then(()=>
		this.app.client.loader.asyncLoadImage('./parallax-forest-middle-trees','s1').then(()=>
		this.app.client.loader.asyncLoadImage('./knight_3_improved_slash_animation_2','s').then(()=>
		this.app.client.loader.asyncLoadImage('./knight_walk_animation','s').then(()=>
		this.app.client.loader.asyncLoadImage('./knight_3_block','s').then(()=>
		this.app.client.loader.asyncLoadImage('./knight_3_idle','s').then(()=>
		this.app.client.loader.asyncLoadImage('./Skeleton/Sprite Sheets/Skeleton_Walk','s').then(()=>
		this.app.client.loader.asyncLoadImage('./Skeleton/Sprite Sheets/Skeleton_Hit','s').then(()=>
		this.app.client.loader.asyncLoadImage('./Skeleton/Sprite Sheets/Skeleton_Attack','s').then(()=>
		this.app.client.loader.asyncLoadImage('./Skeleton/Sprite Sheets/skeleton_parts','s').then(()=>
		this.app.client.loader.asyncLoadImage('./Skeleton/Sprite Sheets/Skeleton_Dead','s').then(()=>
		this.app.client.loader.asyncLoadImage('./Skeleton/Sprite Sheets/Skeleton_Idle','s').then(()=>{

			this.bgItems = [];
			this.enemies = [];

			this.backgroundContoller = new BackgroundController(new StatsBuffer('',0,0,1.2,1,0,0,0,272,160),this.visuals);

			//let stats:IStatsBuffer = new StatsBuffer(0,0,1.2,1,0,0,0,272,160,this.visuals);

			//this.backgroundController = new BackgroundController(new StatsBuffer(null,0,0,1.2,1,0,0,0,272,160,this.visuals));
			/*
			this.backgrounds = [];
			this.backgrounds.push(new ParallaxBackground(this.bg[3],0,0,1.2,1,0,0,0,272,160,this.visuals,3));
			this.backgrounds.push(new ParallaxBackground(this.bg[2],0,0,1.2,1,0,0,0,272,160,this.visuals,2));
			this.backgrounds.push(new ParallaxBackground(this.bg[1],0,0,1.2,1,0,0,0,272,160,this.visuals,1));
			this.backgrounds.push(new ParallaxBackground(this.bg[0],0,0,1.2,1,0,0,0,272,160,this.visuals,0));
			*/
			//this.f2 = new ParallaxBackground(this.bg[0],0,100,1.2,1,0,-320/1.2,0,272,160,this.visuals);


		}))))))))))))))));

		//Set buffer index of the UI draw event TODO:

		this.visuals.bufferIndex = 0;


	}

	static update(){

		this.spinner.updateAll();
	};

	static draw(){

		this.backgroundContoller.updateAll();

		if (this.app.client.graphics.getErrors()===0) {

			let gamepad =  this.visuals.app.input.gamepads;

			if (gamepad){

				if ((gamepad.left)||(gamepad.right)||(gamepad.x)||(gamepad.a)||(gamepad.y)||this.app.input.pressed) {

					for(let i=8;i>=0;--i){
						this.spinner.sprites[i].delete = true;
					}
					for(let i=this.bgItems.length-1;i>=0;--i){
						this.bgItems[i].delete = true;
					}

					this.bgItems = [];

					this.app.client.update.state = new State(Game);
				}

			}

		}
			//this.visuals.rect_free(0,0,window.innerWidth,window.innerHeight,1,1,0,"#111111");

	};

}

export default new Loading();
