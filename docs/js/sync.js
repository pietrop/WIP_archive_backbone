/**
 * @file Manages the backend of the app by overwrighting backbone.sync.
 * @author Pietro Passarelli 
 */
"use strict";
Backbone.sync = autoEdit2API;

/**
* @constructs autoEdit2API
* @description API Object to override Backnone.sync
* @param {object} method - Backbone RESTfull method request.
* @param {object} model - Backbone model being handled.
* @param {object} options - Sucess or failure callback.
*/
var autoEdit2API = function(method, model, options){
  autoEdit2API[method](model, options.success, options.error);
};

/**
* @function 
* @description Create functionality, mapped to REST POST
* @param {object} method - Backbone RESTfull method request.
* @param {object} model - Backbone model being handled.
* @param {object} options - Sucess or failure callback.
* @returns {object} sucess callback with backbone model containing db id
*/
autoEdit2API.create = function(model, success, error){
  if( model.constructor.modelType == "transcription"){
      //returning saved transcription callback
      success(model);
	}
};

/**
* @function 
* @description Read functionality,Find all  and fine One, mapped to REST GET
* @param {object} method - Backbone RESTfull method request.
* @param {object} model - Backbone model being handled.
* @param {object} options - Sucess or failure callback.
* @returns {object} sucess callback with backbone model
*/
autoEdit2API.read = function(model, success, error){
  //If a colleciton
  if (model.models) {
    console.info("Collection:" +model.constructor.modelType );
    //for transcription model
    if( model.constructor.modelType == "transcriptions"){
     //return transcription collection 
        success(transcriptions);
   
    }//if transcription collection
  }else {
    //if a model 
    console.info("Model: "+model.constructor.modelType);
    //for transcription model
    if(model.constructor.modelType == "transcription"){
       //return transcription model
          success(transcription);
    } 
  }
};

/**
* @function 
* @description Update functionality, mapped to REST PUT
* @param {object} method - Backbone RESTfull method request.
* @param {object} model - Backbone model being handled.
* @param {object} options - Sucess or failure callback.
* @returns {object} sucess callback with backbone model
*/
autoEdit2API.update = function(model, success, error){
  //for transcription model
  if(model.constructor.modelType == "transcription"){
        success(model);
  
  } 
};

/**
* @function 
* @description Patch functionality, mapped to REST PUT
* @param {object} method - Backbone RESTfull method request.
* @param {object} model - Backbone model being handled.
* @param {object} options - Sucess or failure callback.
* @returns {object} sucess callback with backbone model
*/
autoEdit2API.patch = function(model, success, error){
  if(model.constructor.modelType == "transcription"){  
       success(model);
 }
};

/**
* @function 
* @description Delete functionality, mapped to REST Delete
* @param {object} method - Backbone RESTfull method request.
* @param {object} model - Backbone model being handled.
* @param {object} options - Sucess or failure callback.
* @returns {object} sucess callback with backbone model
*/ autoEdit2API.delete = function(model, success, error){
  ///for transcription model
  if(model.constructor.modelType == "transcription"){
    
        success(model);
      // }); 
  }
};