/* @flow */

export default class Time {

	startTime:number;

	constructor(){

		this.startTime = new Date().getTime();

	}

	get duration():number {
		return -((this.startTime-new Date().getTime()));
	}

	get minutes():number {
		return Math.floor(this.duration/60000);
	}

	get seconds():mixed {
		return ((this.duration % 60000) / 1000).toFixed(0);
	}

}
