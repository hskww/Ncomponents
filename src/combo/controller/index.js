'use strict';

import Base from './base.js';
import fs from 'fs';
export default class extends Base {
  /*
   * index action
   * @return {Promise} []
   */
  async indexAction(){
  	let http = this.http;
  	let response=http.res;
  	let request=http.req;
  	let headers=http.headers;
  	let lastModified="";
  	let ifModifiedSince="";
    //auto render template file index_index.html
    let content="";
    let path= this.get("path").split(",");
    
    let reg=/.+\.(\w+)$/;
    let etc=reg.exec(path[0])[1].toLowerCase();
    for(let i=0;i<path.length;i++){
    	let reg=/^(.+)\..+$/g; 
    	let name=reg.exec(path[i])[1];
    	let cachename = name+"_"+etc;
    	think.cache(cachename,null);
    	let js1= await think.cache(cachename);
    	let lsmt= await think.cache(cachename);
		if(!js1){
			let filepath="";
			if(etc == "js"){
				filepath="www/static/js/components/"+name+"/main-min.js";
			}else if(etc == "css"){
				filepath="www/static/css/components/"+name+"/main.css";
			}
			js1=fs.readFileSync(filepath,"utf-8"); 
			let stat=fs.statSync(filepath);
			lastModified = stat.mtime.toUTCString();
			think.cache(name,js1);
			think.cache(name+"lsmt",lastModified);
		}
		content +=js1;
    }
	
	
	if(etc == "js"){
		http.type('application/javascript');
	}else if(etc == "css"){
		http.type('text/css');
	}
	let expires = new Date();
	let maxage=60*60*24*30;
    expires.setTime(expires.getTime() + maxage*1000);
    response.setHeader("Expires", expires.toUTCString());
    response.setHeader("Cache-Control", "max-age=" + maxage);
    response.setHeader("Last-Modified", lastModified);
	if (headers['if-modified-since'] && lastModified == headers['if-modified-since']) {
        response.writeHead(304, "Not Modified");
        http.end();
        
    }else{
    	http.end(content);
    }
   
    
  }
}