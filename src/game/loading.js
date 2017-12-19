//@flow

import {
	State
	// $FlowFixMe
} from 'ryanspice2016-spicejs';

import NewState from './newstate.js';

import {
	StatsBuffer
} from './utils';

import {
	BackgroundController
} from './background';

import Spinner from './ui/spinner';

import Game from './game';

declare var require:any;

let lastError = 0;


/**
 * @param k: the max of input, used to create a range for our buckets
 * @param exp: 1, 10, 100, 1000, ... used to calculate the nth digit
 */
Array.prototype.countingSort = function (k, exp) {
    /* eslint consistent-this:0 */
    /* self of course refers to this array */
    const self = this;

    /**
     * let's say the this[i] = 123, if exp is 100 returns 1, if exp 10 returns 2, if exp is 1 returns 3
     * @param i
     * @returns {*}
     */
    function index(i) {
        if (exp)
            return Math.floor(Number(self[i].priority) / exp) % 10;
        return i;
    }

    const LENGTH = this.length;

    /* create an array of zeroes */
    let C = Array.apply(null, new Array(k)).map(() => 0);
    let B = [];

    for (let i = 0; i < LENGTH; i++)
        C[index(i)]++;

    for (let i = 1; i < k; i++)
        C[i] += C[i - 1];

    for (let i = LENGTH - 1; i >= 0; i--) {
        B[--C[index(i)]] = this[i].priority;
    }

    B.forEach((e, i) => {
        self[i].priority = Number(e);
    });
}
Array.prototype.radixSort = function () {
    const MAX = Math.max.apply(null, this.map((a)=>{return Number(a.priority);}));

    /* let's say the max is 1926, we should only use exponents 1, 10, 100, 1000 */
    for (let exp = 1; MAX / exp > 1; exp *= 10) {
        this.countingSort(10, exp);
    }
}


/* Loading state */

class Loading extends NewState {

	static asyncDoneLoading:boolean = false;
	static getErrors(){


	}
	/* Pass self into Sprite for secure inheritence ( SS ) */

	constructor(){

		super(Loading);

	}

	/* Initalize objects and load sprites */

	static async init():Promise<void> {

		Loading.asyncDoneLoading = false;

		//Set buffer index of the UI draw event TODO: ?
		this.visuals.bufferIndex = 0;

		//TODO: bring to SpiceJS.... overrides sort method specifically for priority
		this.visuals.sortPriorityRegistry =	function():void {
			if (this.PriorityRegistryFlags.sort === true) {
				console.log('eh')
				this.PriorityRegistry.radixSort(); // = sortBy(this.PriorityRegistry,(o)=>{return -o.priority;});
				this.PriorityRegistryFlags.sort = false;
			}

		};

		this.asyncDoneLoading = false;

		this.spinner =  new Spinner(this.visuals,1);
		this.spinner.colour = this.spinner.getColour('Red');

		//TODO: fix inside SpiceJS
		this.app.client.loader.graphics = await this.graphics;

//		this.visuals.appendNew = function(toRegister:any){
	//		return this.PriorityRegistry.push(toRegister);
		//}

		this.visuals.PrioirtySort = function(){
			let t = this.PriorityRegistry.radixSort();
			this.PriorityRegistry.reverse();
			console.log(this.PriorityRegistry);
			return this.PriorityRegistry;
		}


		//Load spriteDataList from data folder TODO: add to SpiceJS as API - look into dynamic? nawh
		/*this.spriteDataList = await require.ensure(['../require/data'],async ()=>{

			return await require('../require/data').default.spriteDataList;
		},'maps');
		*/

		this.spriteDataList = await require.ensure(['../require/data'],async ()=> await require('../require/data').default.spriteDataList,'maps');

		//Load sprites
		for(let i = 0; i<=this.spriteDataList.length-1;i++){
			await this.app.client.loader.asyncLoadImage(this.spriteDataList[i],String("spr"+i));
		}

		//Build BackgroundController
		this.BackgroundManager  = await new BackgroundController(new StatsBuffer('',0,0,1,1,0,0,0,272,160),this.visuals);

		this.asyncDoneLoading = true;
		Loading.asyncDoneLoading = true;

		this.app.Loading = this;

		this.gamepad =  this.visuals.app.input.gamepads;
		console.log(this);
				await this.visuals.PrioirtySort().map(a=>console.log(a.priority));

	}

	/* Update objects */

	static update(){

		this.spinner.updateAll();

		//TODO: spicejs recognize that graphics.getErrors will return 0 before we request an object and there for while the async function is running
		//			we need to check the error has changed
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

			return;
		}

		this.spinner.colour = this.spinner.getColour('Green');

		//TODO; no if? but sprite initalization error otherwise
		if (this.backgroundContoller){
			this.backgroundContoller.updateAll();
		}

		if (this.gamepad){

			if ((this.gamepad.left)||(this.gamepad.right)||(this.gamepad.x)||(this.gamepad.a)||(this.gamepad.y)||this.app.input.pressed) {

								for(let i=8;i>=0;--i){
									this.spinner.sprites[i].delete = true;
								}

								this.spinner = null;
								this.app.client.update.state = new State(Game);
			}

		}else {

			if (this.app.input.pressed){

								for(let i=8;i>=0;--i){
									this.spinner.sprites[i].delete = true;
								}

								this.spinner = null;
								this.app.client.update.state = new State(Game);

			}

		}

		document.title = 'Demo - ' + this.app.fps;

	};

	/* UI Overlay*/

	static draw(){

	};

}

window.Loading = Loading;
export default new Loading();
