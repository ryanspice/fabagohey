//@flow

import {
	State
	// $FlowFixMe
} from 'ryanspice2016-spicejs';

import {
	StatsBuffer
} from './utils';

import {
	BackgroundController
} from './background';

import Spinner from './ui/spinner';

import Game from './game';

declare var require:any;

/* Loading state */

class Loading extends State {

	/* Pass self into Sprite for secure inheritence ( SS ) */

	constructor(){

		super(Loading);

	}

	/* Initalize objects and load sprites */

	static async init():Promise<void> {

		//Set buffer index of the UI draw event TODO: ?
		this.visuals.bufferIndex = 0;

		this.asyncDoneLoading = false;

		this.spinner =  new Spinner(this.visuals,1);

		//TODO: fix inside SpiceJS (newstate)
		this.app.client.loader.graphics = await this.graphics;

		//Load spritelist from data folder TODO: add to SpiceJS as API - look into dynamic? nawh
		this.spriteDataList = await require.ensure(['../require/data'],async ()=>{

			//Retrieve reference
			this.spriteDataList = await require('../require/data').default.spriteDataList;

			//Load sprites
			for(let i = 0; i<=this.spriteDataList.length-1;i++){
				await this.app.client.loader.asyncLoadImage(this.spriteDataList[i],String("spr"+i));
			}

		},'maps');

		//Build BackgroundController
		this.BackgroundManager  = new BackgroundController(new StatsBuffer('',0,0,1,1,0,0,0,272,160),this.visuals);


		this.asyncDoneLoading = true;

		this.app.Loading = this;
	}

	/* Update objects */

	static update(){

		//TODO: fix bug with inital green
		this.spinner.colour = this.asyncDoneLoading?"#33FF33":"#EE3333";

		this.spinner.updateAll();

		if (this.app.client.graphics.getErrors()===0) {

			//TODO; no if? but sprite initalization error otherwise
			if (this.backgroundContoller){
				this.backgroundContoller.updateAll();
			}

			let gamepad =  this.visuals.app.input.gamepads;

			if (gamepad){

				if ((gamepad.left)||(gamepad.right)||(gamepad.x)||(gamepad.a)||(gamepad.y)||this.app.input.pressed) {

					for(let i=8;i>=0;--i){
						this.spinner.sprites[i].delete = true;
					}

					this.app.client.update.state = new State(Game);
				}

			}

		}

	};

	/* UI Overlay*/

	static draw(){

				document.title = 'Demo - ' + this.app.fps;
		//this.visuals.rect_free(0,0,window.innerWidth,window.innerHeight,1,1,0,"#111111");

	};

}

export default new Loading();
