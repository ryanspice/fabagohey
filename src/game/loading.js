//@flow

//declare var require:any;

import {
	State
	// $FlowFixMe
} from 'ryanspice2016-spicejs';

import Game from './game';
import Spinner from './ui/spinner';
import NewState from './newstate.js';

import {
	StatsBuffer
} from './utils';

import {
	BackgroundController
} from './background';

let lastError = 0;

/* Loading state */

class Loading extends NewState {

	static asyncDoneLoading:boolean = false;

	/* Pass self into Sprite for secure inheritence ( SS ) */

	constructor(){

		super(Loading);

	}

	/* Initalize objects and load sprites */

	static async init():Promise<void> {

		//TODO: build into SpiceJS
		this.asyncDoneLoading = false;

		//TODO: build into SpiceJS
		this.app.client.loader.graphics = await this.graphics;

		//region Override Visuals
		//TODO: bring to SpiceJS.... overrides sort method specifically for priority
		//	visuals.PriorityRegistryAttempt - size of array on initial load
		//	visuals.PriorityRegistryAttemptCount - count of time accessed array
		//	visuals.PriorityRegistry - array of all data (game objects)

		//	visuals.sortPriorityRegistry - sort radix if sorting
		//	visuals.appendNew - now caches array then cleans remaining, will warn if adding more to cache.
		//	visuals.PrioritySort - now uses radixSort
		//

		this.visuals.PriorityRegistryAttempt = 96;
		this.visuals.PriorityRegistryAttemptCount = 0;
		this.visuals.PriorityRegistry = new Array(this.visuals.PriorityRegistryAttempt);

		/* sort using radix if sorting */

		this.visuals.sortPriorityRegistry =	function():void {

			if (!this.PriorityRegistryFlags.sort === true)
				return;

			this.PriorityRegistry.radixSort(); // = sortBy(this.PriorityRegistry,(o)=>{return -o.priority;});
			this.PriorityRegistryFlags.sort = false;

		};

		/* caches array then cleans remaining, will warn if adding more to cache.  */

		this.visuals.appendNew = function(toRegister:any){

			if (!this.PriorityRegistry){
				this.PriorityRegistry = new Array(this.PriorityRegistryAttempt);
			}

			if (this.PriorityRegistryAttemptCount>this.PriorityRegistryAttempt){

				console.warn('SJS:Visuals:PriorityRegistry:'+this.PriorityRegistryAttempt+': Pushing at ' + this.PriorityRegistryAttemptCount++);

				return this.PriorityRegistry.push(toRegister);
			} else {

				this.PriorityRegistry[this.PriorityRegistryAttemptCount] = toRegister;
				this.PriorityRegistry = this.PriorityRegistry.clean(undefined); //TODO move into just before sort proprly
				this.PriorityRegistryAttemptCount++;

				return true;
			}

		}

		/* using radixSort */

		this.visuals.PrioirtySort = function(){

			this.PriorityRegistry.radixSort();

			return this.PriorityRegistry;
		}

		//
		//endregion

		//region Build/Get References
		//
		//

		this.spinner =  new Spinner(this.visuals);
		this.spinner.colour = this.spinner.getColour('Red');

		//Build gotoGame Function (lol)
		this.gotoGame = ()=>{

			for(let i=8;i>=0;--i){
				this.spinner.sprites[i].delete = true;
			}

			this.spinner = null;
			this.visuals.PriorityRegistry.reverse(); //TODO: mitigate this
			this.app.client.update.state = new State(Game);

		}

		//Load gamepad reference
		this.gamepad =  await this.visuals.app.input.gamepads;

		//Load spriteDataList from data folder TODO: add to SpiceJS as API - look into dynamic? nawh
		this.spriteDataList = await require.ensure(['../require/data'],async ()=> await require('../require/data').default.spriteDataList,'maps');

		//Load sprites
		let i = this.spriteDataList.length-1;
		for(i; i>=0;i--){
			await this.app.client.loader.asyncLoadImage(this.spriteDataList[i],String("spr"+i));
		}

		//Build BackgroundController
		this.BackgroundManager  = await new BackgroundController(new StatsBuffer('',0,0,1,1,0,0,0,272,160),this.visuals);

		//
		//
		//endregion Build/Get References

		this.app.Loading = this;

		//TODO: move to spicejs
		await this.visuals.PrioirtySort();

		this.asyncDoneLoading = true;
	}

	/* Update objects */

	static update(){

		this.spinner.updateAll();

		//region Loading Error Handling
		//TODO: move to SpiceJS
		// recognize that graphics.getErrors will return 0 before we request an object and there for while the async function is running
		//	we need to check the error has changed
		//

		let _continue = false;
		let _errors = this.app.client.graphics.getErrors();

		//if no errors, continue is true
		if (_errors===0) {
			_continue = true;
		}

		//if errors equals last error, cease to continue
		if (_errors===lastError) {

			if (!this.asyncDoneLoading) {
				_continue = false;
			}

		}

		lastError = _errors;

		if (!_continue){

		//	return;
		}

		if (!this.asyncDoneLoading) {
			return;
		}

		this.spinner.colour = this.spinner.getColour('Green');

		//
		//endregion Loading Error Handling

		//region Input Handling
		//

		if (this.gamepad){

			if ((this.gamepad.left)||(this.gamepad.right)||(this.gamepad.x)||(this.gamepad.a)||(this.gamepad.y)||this.app.input.pressed) {

				this.gotoGame();
			}

		}else {

			if (this.app.input.pressed){

				this.gotoGame();

			}

		}

		//
		//endregion

		this.BackgroundManager.updateAll();

	};

	/* UI Overlay*/

	static draw(){

		document.title = 'Demo - ' + this.app.fps;

	};

}

export default new Loading();
