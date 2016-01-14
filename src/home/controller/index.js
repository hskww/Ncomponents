'use strict';
import Base from './base.js';


export default class extends Base {
    /**
     * index action
     * @return {Promise} []
     */
    async indexAction() {
        var that = this;
        var pageData = {
            components: [{
                componet_id: "681",
                componet_info_type: "titleComponent",
                props: {
                    align: "center",
                    anchor_name: "anchor_name681",
                    bg_image: "http://d06.res.meilishuo.net/pic/_o/c4/fa/1a8a971c0389f624ff5e0ee59efc_750_400.cf.jpg",
                    bgcolor: "#ededed",
                    font_color: "#02adae",
                    margin: "20",
                    more_name: "更多",
                    more_url: "http://www.so.com",
                    title: "标题背景图片"
                }
            }, {
                componet_id: "472",
                componet_info_type: "textComponent",
                props: {
                    anchor_name: "anchor_name472",
                    bg_color: "",
                    bg_image: "http://d06.res.meilishuo.net/pic/_o/c4/fa/1a8a971c0389f624ff5e0ee59efc_750_400.cf.jpg",
                    font_color: "",
                    margin: "20",
                    text: "js判断是安卓 还是 ios webview iOS分享到: 专业回答huanglenzhi 资 还是 ios webview iOS分享到: 专业回答huanglenzhi",
                }
            }],
            page_name: "服务端渲染组件"
        }
       
        var nameMap={
        	"titleComponent":"title",
        	"textComponent":"text"
        }
        var compArray=[];
        var jsArray=[];
        var cssArray=[];
        var componentHtml = "";
        
        for (var i = 0; i < pageData.components.length; i++) {
        	var data= pageData.components[i];
        	that.assign('data', data.props);
            componentHtml += await this.fetch("components/"+nameMap[data.componet_info_type]+".html");
            compArray.push({
            	componentname:data.componet_info_type,
            	domid: data.props.anchor_name
            });
            jsArray.push(nameMap[data.componet_info_type]+".js");
            cssArray.push(nameMap[data.componet_info_type]+".css");
        }
        that.assign('compArray',JSON.stringify(compArray));
        that.assign('jsArray',jsArray.join(","));
        that.assign('cssArray',cssArray.join(","));
        that.assign('title', pageData.page_name);
        that.assign('componentHtml', componentHtml);
        return this.display("index");
    }
    
}