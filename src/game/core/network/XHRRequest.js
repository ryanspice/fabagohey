//@flow

import type {IXHRErrors} from "../interfaces";

/**/

const XHRErrors:IXHRErrors = {
	empty:{'error':'Response was empty string ""'}
}

/*
	ES6+ Async implementation of the XHR Request
*/

export default class XHRRequest {

	static online = true;

	request:XMLHttpRequest;
	timeout:number = 100;

	/* */

	constructor(url:string) {

    	this.init(url);

	}

	/* */

	async init(url:string) {


		this.request = await new XMLHttpRequest();

		this.request.onload = this.onload;

		//this.request.ontimeout = this.ontimeout;

		await this.request.open("GET",url,false);

		this.request.setRequestHeader('Content-type','text/plain');

		try{

				await this.request.send(null);

		} catch(e) { console.log(e);}

	}

	/* */

	data():Object {

		if (this.request.response.length==0){

			console.warn('response is empty')

			return XHRErrors.empty;
		} else {

			return JSON.parse(this.request.response);
		}

	}

	/* */


	ontimeout(err:string) {

		console.error("The request for " + err + " timed out.");

	}

	/* */


	onload = ()=>{

		if (this.request.readyState === 4) {
			if (this.request.status === 200) {

			//OK

			} else {

			//NOT OKAY

			}
		}

	}

}

/**/

//window.addEventListener('offline', function(e) { XHRRequest.online = 'offline'; });

/**/

//window.addEventListener('online', function(e) { XHRRequest.online = 'online'; });
