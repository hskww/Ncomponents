'use strict';
/**
 * template config
 */
export default {
  type: 'nunjucks',
  content_type: 'text/html',
  file_ext: '.html',
  file_depr: '_',
  root_path: think.ROOT_PATH + '/view',
  adapter: {
    nunjucks: {
     autoescaping: true, //不转义
     prerender: function(nunjucks, env){
     	if(!env) return;
     	//添加一个过滤器，这样可以在模板里使用了
        env.addFilter("xrem", function(x){
        	if(x){
		        return x * 320 / 750 /20 + 'rem';
		    }else{
		        return "";
		    }
        });
     } //针对nunjucks模板的过滤器
    }
  }
};