/**
 * this file will be loaded before server started
 * you can define global functions used in controllers, models, templates
 */

/**
 * use global.xxx to define global functions
 * */
 global.xrem = function(x){
   if(x){
        return x * 320 / 750 /20 + 'rem';
    }else{
        return "";
    }
}
 