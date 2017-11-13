//@flow

import {
	State
	// $FlowFixMe
} from 'ryanspice2016-spicejs';

import {
	IState
	// $FlowFixMe
} from '../../node_modules/ryanspice2016-spicejs/src/modules/core/interfaces/ITypes.js';

/* TODO: export properly from spicejs */

declare var Vector;
declare var Circle;

import Game from './game';

import ParallaxBackground from './background';

const Loading:IState = {

	init: async function(){

		this.x =0;
		let a = 12;
		let r= 1.6;
		let d = 3;
		let b = this.x/1080;

		this.list = [];

		for(var i=8;i>=0;--i){

			var obj = new Circle((-7+this.app.client.width/2+Math.cos((b+i)*7)*a),this.app.client.height/1.5+Math.sin((b+i)*7)*a,r,"#33FF33",1,this.visuals);
			obj.priority = 5;
			this.list.push(obj);

		}

		this.app.client.loader.graphics = this.graphics;
		let loader2 = this.app.client.loader;

		loader2.asyncLoadImage('./Cursive1_MyEdit','c1').then(()=>
		loader2.asyncLoadImage('./Untitled','ut').then(()=>
		loader2.asyncLoadImage('./parallax-forest-back-trees','s1').then(()=>
		loader2.asyncLoadImage('./parallax-forest-front-trees','s2').then(()=>
		loader2.asyncLoadImage('./parallax-forest-lights','s1').then(()=>
		loader2.asyncLoadImage('./parallax-forest-middle-trees','s1').then(()=>
		loader2.asyncLoadImage('./knight_3_improved_slash_animation_2','s').then(()=>
		loader2.asyncLoadImage('./knight_walk_animation','s').then(()=>
		loader2.asyncLoadImage('./knight_3_block','s').then(()=>
		loader2.asyncLoadImage('./knight_3_idle','s').then(()=>
		loader2.asyncLoadImage('./Skeleton/Sprite Sheets/Skeleton_Walk','s').then(()=>
		loader2.asyncLoadImage('./Skeleton/Sprite Sheets/Skeleton_Hit','s').then(()=>
		loader2.asyncLoadImage('./Skeleton/Sprite Sheets/Skeleton_Attack','s').then(()=>
		loader2.asyncLoadImage('./Skeleton/Sprite Sheets/skeleton_parts','s').then(()=>
		loader2.asyncLoadImage('./Skeleton/Sprite Sheets/Skeleton_Dead','s').then(()=>
		loader2.asyncLoadImage('./Skeleton/Sprite Sheets/Skeleton_Idle','s').then(()=>{

			let loader = this.app.client.loader;
			let s = 1.125 + 0.2;
			let xx = 0;
			let xxx = 0;
			this.bg = [];
			this.bgItems = [];
			this.enemies = [];

			this.bg = [
				loader.getImageReference('./parallax-forest-back-trees'),
				loader.getImageReference('./parallax-forest-lights'),
				loader.getImageReference('./parallax-forest-middle-trees'),
				loader.getImageReference('./parallax-forest-front-trees'),
			];


			for(let i = 3; i>=0;i--) {
				let item;
				//(this.bgItems.push(item = this.visuals.createMapObject('Tile',this.bg[i],-this.bg[i].width*s,-30,s,1,xx,0,0,xxx+272,160,-3+i)));
				//(this.bgItems.push(item = this.visuals.createMapObject('Tile',this.bg[i],0,-30,s,1,xx,0,0,xxx+272,160,-3+i)));
				//(this.bgItems.push(item = this.visuals.createMapObject('Tile',this.bg[i],this.bg[i].width*s,-30,s,1,xx,0,0,xxx+272,160,-3+i)));
			}

			this.backgrounds = [];
			this.backgrounds.push(new ParallaxBackground(this.bg[3],0,0,1.2,1,0,0,0,272,160,this.visuals,3));
			this.backgrounds.push(new ParallaxBackground(this.bg[2],0,0,1.2,1,0,0,0,272,160,this.visuals,2));
			this.backgrounds.push(new ParallaxBackground(this.bg[1],0,0,1.2,1,0,0,0,272,160,this.visuals,1));
			this.backgrounds.push(new ParallaxBackground(this.bg[0],0,0,1.2,1,0,0,0,272,160,this.visuals,0));
			//this.f2 = new ParallaxBackground(this.bg[0],0,100,1.2,1,0,-320/1.2,0,272,160,this.visuals);


		}))))))))))))))));


		this.drawBorders = ()=>{

			if (this.app.client.graphics.getErrors()!==0)
				this.visuals.rect_free(0,0,window.innerWidth,window.innerHeight,1,1,0,"#000000");
				else
				this.visuals.rect(0,0,-600/this.app.scale,400,"#000000"),
			this.visuals.rect(this.app.client.setWidth,0,600/this.app.scale,400,"#000000");
			this.visuals.rect(0,-50,this.app.client.setWidth,50,"#000000");
			this.visuals.rect(0,this.app.client.setHeight,this.app.client.setWidth,50,"#000000");
		}

		this.visuals.bufferIndex = 0;

	}

	,draw(){

		this.backgrounds.forEach(sprite => sprite.updateAll());

		this.drawBorders();

		if (this.app.client.graphics.getErrors()===0) {

			let gamepad =  this.visuals.app.input.gamepads;

			if (gamepad){

				if ((gamepad.left)||(gamepad.right)||(gamepad.x)||(gamepad.a)||(gamepad.y)||this.app.input.pressed) {

					for(let i=8;i>=0;--i){
						this.list[i].delete = true;
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
	}
	,update:function(){

		let a = 12;
		let c = 3;
		let d = 6;
		let b = this.x/1080;

		this.x+=3;
		let colour = "#EE3333";
		if (this.app.client.graphics.getErrors()!==0)
			colour = "#EE3333";
		else
			colour = "#33FF33";

		for (var i = 0; i < this.list.length;i++){
			let item = this.list[i];
			item.a = 0.5-Math.sin(((b+i)*(1*7))+360*(-Math.sin(this.x/1080)*0.1))*0.5;
			item.position = new Vector((-7+this.app.client.setWidth/2+Math.cos((b+i)*7)*a),this.app.client.setHeight/1.5+Math.sin((b+i)*7)*a);
			item.col = colour;
		}

	}

}

export default new State(Loading);
