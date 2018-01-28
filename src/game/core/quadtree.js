//@flow


declare var Vector;
import Rectangle from "./rectangle";

export default class QuadTree {


	MAX_OBJECTS:number = 25;
	MAX_LEVELS:number = 5;

	level:number;
	objects:Array<any>;
	bounds:any;
	list:Array<Vector>;
	nodes:Array<any>;

	constructor(level:number, rect:any){

		this.level = level;
		this.objects = [];
		this.bounds = rect;
		this.nodes = [];

	}

	clear(){

		this.objects = [];
		for(let i = 0; i < this.nodes.length; i++){

			if (this.nodes[i]!=null){
				this.nodes[i].clear();
				//this.nodes[i] = [];
			}

		}

	}

	split(){

		let subWidth = (this.bounds.width() / 2);
		let subHeight = (this.bounds.height() / 2);

		let x = this.bounds.left;
		let y = this.bounds.top;
	   this.nodes[0] = new QuadTree(this.level+1, new Rectangle(x + subWidth, y, subWidth, subHeight));
	   this.nodes[1] = new QuadTree(this.level+1, new Rectangle(x, y, subWidth, subHeight));
	   this.nodes[2] = new QuadTree(this.level+1, new Rectangle(x, y + subHeight, subWidth, subHeight));
	   this.nodes[3] = new QuadTree(this.level+1, new Rectangle(x + subWidth, y + subHeight, subWidth, subHeight));

	}

	getIndex(pRect:any){

		let index = -1;
	    let verticalMidpoint = this.bounds.top + (this.bounds.height() / 2);
		let  horizontalMidpoint = this.bounds.left + (this.bounds.width() / 2);

		//console.log(pRect.top);
		const height = 32; //pRect.height()
		const width = 64; //pRect.width()
		const y = pRect.y;
		const x = pRect.x;

	    // Object can completely fit within the top quadrants
	    let topQuadrant = ((y < horizontalMidpoint) && ((y + height) < horizontalMidpoint));
	    // Object can completely fit within the bottom quadrants
	    let bottomQuadrant = (y > horizontalMidpoint);

		   if (topQuadrant) {
			 index = 1;
		   }
		   else if (bottomQuadrant) {
			 index = 2;
		   }

		return index;
	    // Object can completely fit within the left quadrants
	    if ((x < verticalMidpoint) && ((x + width) < verticalMidpoint) ){
	       if (topQuadrant) {
	         index = 1;
	       }
	       else if (bottomQuadrant) {
	         index = 2;
	       }
	     }
	     // Object can completely fit within the right quadrants
	     else if (x > verticalMidpoint) {
	      if (topQuadrant) {
	        index = 0;
	      }
	      else if (bottomQuadrant) {
	        index = 3;
	      }
	    }

	    return index;
	}

	insert(pRect:any){

	   if (this.nodes[0] != null) {
	     let index = this.getIndex(pRect);

	     if (index != -1) {
			   	//console.log(this.nodes[index]);
	       this.nodes[index].insert(pRect);

	       return;
	     }
	   }

	   this.objects.push(pRect);
	   if (((this.objects.length-1) > this.MAX_OBJECTS) && (this.level < this.MAX_LEVELS)) {
	      if (this.nodes[0] == null) {
	         this.split();
	      }

	     let i = 0;
		 for(i;i<this.objects.length-1;i++){

		   let index = this.getIndex(this.objects[i]);
		   if (index != -1) {

			   	//console.log(this.nodes[index])
		 	this.nodes[index].insert(this.objects.slice(i));
		   }

		 }


/*
	     while (i < this.objects.length-1) {
	       let index = this.getIndex(this.objects[i]);
	       if (index != -1) {
	         this.nodes[index].insert(this.objects.slice(i));
	       }
	       else {
	         i++;
	       }
	     }
*/





	   }
	}

	retrieve(returnObjects:Array<any>, pRect) {

		let index = this.getIndex(pRect);
		if (index != -1 && this.nodes[0] != null) {
		 this.nodes[index].retrieve(returnObjects, pRect);
		}

		//		returnObjects.concat(this.objects);
		return [...returnObjects, ...this.objects];
	}

}
