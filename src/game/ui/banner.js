//@flow

import {
	// $FlowFixMe
} from 'ryanspice2016-spicejs';

/* TODO: fix imports from spicejs */

declare var Sprite;

import {
	ISprite,
	IVisuals,
	IApp
	// $FlowFixMe
} from '../../../node_modules/ryanspice2016-spicejs/src/modules/core/interfaces/ITypes.js';

/* Generic Spinner class for loading spinner graphic */

let characters:Object = {};


export default class Banner {


	/**/

	constructor(visuals:IVisuals, speed:number = 1){


		this.characters = _CHARMAP_;

		this.characterList=(string,xx,yy,s=1)=>{

			let arr = [];

			for (var i = string.length-1; i>=0;i--){

				if (string[i]==" ")
					continue;

				let x = (this.characters.indexOf(string[i]));

				let y = 0;
				let l = new Letter(this.font,xx+9*i*s,yy,s,1,0,0,0,9,9,this.visuals);
				l.priority = 27;
				l.characterNum = x;
				arr.push(l);

			}

			return arr;
		};

		this.updateCharacterList=(list,string, xx,yy)=>{

			for (var i = list.length-1;i>=0;i--){
					list[i].characterNum = String(this.characters.indexOf('0'));
			}
			for (var ii = 0;ii<string.length;ii++){

				let x = (this.characters.indexOf(string[ii]));

				list[ii].character = string[ii];
				list[ii].characterNum = String(x);
				//for (var i = list.length-1; i>=0;i--){
				//}
			}

		}

		for (let i = 10;i>=0;i--){
			let t = new Sprite(this.line,0,0+i,1,0.5,0,0,0,320,1,this.visuals);
			t.priority = 8;
			t.type = '_image_part';
		}

		this.score = '000000';
		this.multiplier = 'xxx';

		let best = '012345';
		let yourbest = (Number(this.score)||Number('001234'));
		if (yourbest<10000)
			yourbest = '0' + yourbest;
		if (Number(yourbest)<100000)
			yourbest= '0' + yourbest;


		this.UI_ScoreNumbers = this.characterList(String(this.score),0,5,0.5);
		this.UI_Multiplier = this.characterList((this.multiplier),0,10,0.5);
		this.UI_Time = this.characterList('60',320/2-(8*2),5);

		this.UI_Best = this.characterList('Best '+best,378-108	,5,0.5);
		this.UI_Your = this.characterList('You '+yourbest,378-103.5	,10,0.5);

	}

	/**/

	update(item:ISprite){


	}

	/**/

	updateAll(){


	}

}
