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

/* Loading state */

class Loading extends State {

	/**/

	constructor(){

		super(Loading);

	}

	/**/

	static async init():Promise<void> {

		this.spinner =  new Spinner(this.visuals,1);

		//TODO: fix inside SpiceJS
		this.app.client.loader.graphics = this.graphics;

		//TODO: chain functions
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

			//Background Controller for parallaxing background
			this.backgroundContoller = new BackgroundController(new StatsBuffer('',0,0,1.2,1,0,0,0,272,160),this.visuals);

		}))))))))))))))));

		//Set buffer index of the UI draw event TODO: ?
		this.visuals.bufferIndex = 0;

	}

	/**/

	static update(){

		this.spinner.updateAll();

		this.backgroundContoller.updateAll();

		if (this.app.client.graphics.getErrors()===0) {

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

	/**/

	static draw(){

		//this.visuals.rect_free(0,0,window.innerWidth,window.innerHeight,1,1,0,"#111111");

	};

}

export default new Loading();
