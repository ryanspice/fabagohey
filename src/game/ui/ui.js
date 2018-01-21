//@flow

declare var require;

import utils from '../utils';
import Time from '../time';
import Letter from "../letter";
import {_SCORE_} from "../game";

let _CHARMAP_= require.ensure(['../../require/maps'],()=>{
   _CHARMAP_ = require('../../require/maps').default;
},'maps');

export default class UI {

	characters:Array<string>;
	font:HTMLImageElement;

	time:any;
	score:any  = '000000';
	multiplier:string = 'xxx';

	visuals:any; //

	UI_ScoreNumbers:any;
	UI_Multiplier:any;
	UI_Time:any;
	UI_Best:any;
	UI_Your:any;

	constructor(font:any, visuals:any) {

		this.time = new Time();
		this.font = font;
		this.visuals = visuals;

		this.characters = _CHARMAP_;
		let best = '012345';
		let yourbest = (Number(this.score)||Number('001234'));
		if (yourbest<10000){
			yourbest = '0' + yourbest;
		}
		if (Number(yourbest)<100000){
			yourbest= '0' + yourbest;
		}

		this.UI_ScoreNumbers = this.characterList(String(this.score),0,20,0.5);
		this.UI_Multiplier = this.characterList((this.multiplier),0,25,0.5);
		this.UI_Time = this.characterList('60',320/2-(8*2),20);

		this.UI_Best = this.characterList('Best '+best,378-108	,25,0.5);
		this.UI_Your = this.characterList('You '+yourbest,378-103.25	,10,0.5);

	}

	/**/

	characterList(str:string, xx:number, yy:number, s:number = 1){

		let arr = [];
		let i = str.length-1;
		for (i; i>=0;i--){

			if (str[i]===" "){

				continue;
			}

			let x = (this.characters.indexOf(str[i]));

			let y = 0;
			let l = new Letter(this.font,xx+9*i*s,yy,s,1,0,0,0,9,9,this.visuals);

			l.priority = 9;
			l.characterNum = x;

			arr.push(l);

		}

		return arr;

	}

	/**/

	updateCharacterList(list:any, str:string, xx:number, yy:number){

		let i = list.length-1
		let ii = 0;

		for (i;i>=0;i--){
				list[i].characterNum = String(this.characters.indexOf('0'));
		}

		for (ii;ii<str.length;ii++){

			let x = (this.characters.indexOf(str[ii]));

			list[ii].character = str[ii];
			list[ii].characterNum = String(x);
				//for (var i = list.length-1; i>=0;i--){
			//}
		}

	}

	/**/

	update(){

		this.updateCharacterList(this.UI_ScoreNumbers,utils.reverseString(this.score),0,15);
		this.updateCharacterList(this.UI_Time,utils.reverseString(this.getTime()),0,15);

		this.score = _SCORE_ || '0';
		this.score = String(this.score);

		document.title = 'Demo - ' + this.visuals.app.fps;

	}

	/**/

	getTime(){

		let time = this.time.seconds;	//this.time.minutes;// +""+ (this.time.seconds);
		if (this.time.seconds<10){
			time = "0" + this.time.seconds;
		}
		if (Number(time)<60){
			return String(Number(60-Number(time)));
		}
			else{
			return "XX";
		}

	}

}
