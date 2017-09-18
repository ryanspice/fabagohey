
import {
	State
} from 'ryanspice2016-spicejs';

import Game from './game';

export default new State({

	init:function(){
		this.x =0;
		let a = 12;
		let r= 1.6;
		let d = 6;
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

		}))))))))))))))));


		this.visuals.bufferIndex = 1;

	},draw:function(){

		if (this.app.client.graphics.getErrors()!==0)
			this.visuals.rect_free(0,0,window.innerWidth,window.innerHeight,1,1,0,"#111111")
				else{
					this.visuals.rect_free(0,0,window.innerWidth,window.innerHeight,1,1,0,"#000000")

			let gamepad =  this.visuals.app.input.gamepads;
			if (gamepad)
			if ((gamepad.left)||(gamepad.right)||(gamepad.x)||(gamepad.a)||(gamepad.y)||this.app.input.pressed) {

					this.app.client.update.state = new State(Game);

					for(var i=8;i>=0;--i){
						this.list[i].delete = true;
					}

				}

			}
			//this.visuals.rect_free(0,0,window.innerWidth,window.innerHeight,1,1,0,"#111111");

	},update:function(){

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

});
