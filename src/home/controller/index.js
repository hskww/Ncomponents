'use strict';
import Base from './base.js';


export default class extends Base {
    /**
     * index action
     */
    async indexAction() {
        var that = this;
        //diy页面json示例，实际中是使用http代理从接口服务层获取数据
        var pageData = {
            components: [{
                componet_id: "681",
                componet_info_type: "titleComponent",
                props: {
                    align: "center",
                    anchor_name: "anchor_name681",
                    bg_image: "http://d03.res.meilishuo.net/pic/_o/66/58/a871ab7fc3acf94ad9b668b29de0_750_595.cf.jpg",
                    bgcolor: "#ededed",
                    font_color: "#02adae",
                    margin: "0",
                    more_name: "好搜",
                    more_url: "http://www.so.com",
                    title: "Ncomponents"
                }
            }, {
                componet_id: "472",
                componet_info_type: "textComponent",
                props: {
                    anchor_name: "anchor_name472",
                    bg_color: "",
                    bg_image: "http://d03.res.meilishuo.net/pic/_o/66/58/a871ab7fc3acf94ad9b668b29de0_750_595.cf.jpg",
                    font_color: "",
                    margin: "0",
                    text: "在node层，对js和css的文件做了一个缓存，然后加Expires头，尽量利用浏览器缓存。对于node层的缓存，在生产环境中，上线时可以手动更新这些js和css缓存，让用户每次访问都是从缓存中取数据。",
                }
            },
            {
                componet_id: "689",
                componet_info_type: "titleComponent",
                props: {
                    align: "center",
                    anchor_name: "anchor_name689",
                    bg_image: "",
                    bgcolor: "#ededed",
                    font_color: "#0af",
                    margin: "20",
                    more_name: "",
                    more_url: "",
                    title: "web组件开发"
                }
            }
            ],
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