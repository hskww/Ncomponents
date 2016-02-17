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
    let hlast=headers['if-modified-since'];
    if(Number(hlast)){
      hlast = Number(hlast);
    }else{
      hlast =0;
    }
    //auto render template file index_index.html
    let content="";
    let path= this.get("path").split(",");
    
    let reg=/.+\.(\w+)$/;
    let etc=reg.exec(path[0])[1].toLowerCase();
    let ischange =false;
    for(let i=0;i<path.length;i++){
    	let reg=/^(.+)\..+$/g; 
    	let name=reg.exec(path[i])[1];
    	let cachename = name+"_"+etc;
    	
    	let js1= await think.cache(cachename);
    	lastModified = await think.cache(cachename+"lsmt");
      
    	if(!js1){
       
    		let filepath="";
    		if(etc == "js"){
    			filepath="www/static/js/components/"+name+"/main-min.js";
    		}else if(etc == "css"){
    			filepath="www/static/css/components/"+name+"/main.css";
    		}
    		js1=fs.readFileSync(filepath,"utf-8").toString(); 
    		let stat=fs.statSync(filepath);
    		lastModified = stat.mtime.getTime();
    		think.cache(cachename,js1);
    		think.cache(cachename+"lsmt",lastModified);
        
    	}
      if (lastModified > hlast) {
          ischange =true;
      }
      
		  content +=js1;
    }
	
	//console.log("lastModified="+lastModified+"---hlast="+hlast);
	if(etc == "js"){
		http.type('application/javascript');
	}else if(etc == "css"){
		http.type('text/css');
	}
	let expires = new Date();
	let maxage=60*60*24*30;
    expires.setTime(expires.getTime() + maxage*1000);
    response.setHeader("Expires", expires.getTime());
    response.setHeader("Cache-Control", "max-age=" + maxage);
    response.setHeader("Last-Modified", lastModified);
	if (!ischange) {
        response.writeHead(304, "Not Modified");
        http.end();
        
    }else{
    	http.end(content);
    }
   
  }

  async gettplAction(){
    let http = this.http;
    let response=http.res;
    let request=http.req;
    let headers=http.headers;
    let lastModified="";
    let ifModifiedSince="";
    let hlast=headers['if-modified-since'];
    if(Number(hlast)){
      hlast = Number(hlast);
    }else{
      hlast =0;
    }
    
    let content="";
    let path= this.get("names").split(",");
    
    let reg=/.+\.(\w+)$/;
    let etc="tpl";
    let nameMap={
          "titleComponent":"components_title",
          "textComponent":"components_text"
        }
    let ischange =false;
    let obj={};
    for(let i=0;i<path.length;i++){
      
      let name=path[i];
      let cachename = name+"_"+etc;
      
      let js1= await think.cache(cachename);
      lastModified = await think.cache(cachename+"lsmt");
      if(!js1){
        let filepath="";
        
        filepath="view/component/"+nameMap[name]+".html";
        
        js1=fs.readFileSync(filepath,"utf-8"); 
        let stat=fs.statSync(filepath);
        lastModified = stat.mtime.getTime();
        think.cache(cachename,js1);
        think.cache(cachename+"lsmt",lastModified);
        
      }
      obj[name]=js1;
      if (lastModified > hlast) {
          ischange =true;
      }
      
    }
  
    http.type('text/plain');
  
  let expires = new Date();
  let maxage=60*60*24*30;
    expires.setTime(expires.getTime() + maxage*1000);
    response.setHeader("Expires", expires.getTime());
    response.setHeader("Cache-Control", "max-age=" + maxage);
    response.setHeader("Last-Modified", lastModified);
  if (!ischange) {
        response.writeHead(304, "Not Modified");
        http.end();
        
    }else{
     
      content = JSON.stringify(obj);
      http.end(content);
    }
  }
}