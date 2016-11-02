/**
 *
//example json from vimeo API
// http://vimeo.com/api/v2/video/ID.json
// [{"id":53720557,
// "title":"Kathryn Bolkovac",
// "description":"Sector:  Police\/UN<br \/>\r\n<br \/>\r\nKathryn Bolkovac is an American former police investigator from Nebraska. She worked as a U.N. International Police Force monitor. Originally hired by the U.S. company DynCorp in the framework of a U.N.-related contract, she filed a lawsuit in Great Britain against DynCorp for unfair dismissal due to a protected disclosure (whistleblowing), and on 2 August 2002 the tribunal unanimously found in her favor. DynCorp had a $15 million contract to hire and train police officers for duty in Bosnia at the time she reported such officers were paying for prostitutes and participating in sex trafficking. Many of these were forced to resign under suspicion of illegal activity, but none have been prosecuted, as they also enjoy immunity from prosecution in Bosnia.<br \/>\r\n<br \/>\r\nBolkovac's story was made into a film, The Whistleblower, released in 2010. Following a film screening of \"The Whistleblower,\" UN Secretary-General Ban Ki-moon opened a panel discussion on sexual exploitation and abuse in conflict and post-conflict situations. The filmmaker and senior UN officials addressed issues raised in the film, including human trafficking and forced prostitution as well as the Organization's effort to combat sexual exploitation of women and children.<br \/>\r\n<br \/>\r\nBolkovac has also co-authored a 2011 book with Cari Lynn The Whistleblower: Sex Trafficking, Military Contractors And One Woman's Fight For Justice.",
// "url":"https:\/\/vimeo.com\/53720557",
// "upload_date":"2012-11-16 20:31:40",
// "mobile_url":"https:\/\/vimeo.com\/53720557",
// "thumbnail_small":"https:\/\/i.vimeocdn.com\/video\/457985855_100x75.webp",
// "thumbnail_medium":"https:\/\/i.vimeocdn.com\/video\/457985855_200x150.webp",
// "thumbnail_large":"https:\/\/i.vimeocdn.com\/video\/457985855_640.webp",
// "user_id":13076801,"user_name":"Whistleblower Interview Project",
// "user_url":"https:\/\/vimeo.com\/whistleblowers",
// "user_portrait_small":"https:\/\/i.vimeocdn.com\/portrait\/6583717_30x30.webp",
// "user_portrait_medium":"https:\/\/i.vimeocdn.com\/portrait\/6583717_75x75.webp",
// "user_portrait_large":"https:\/\/i.vimeocdn.com\/portrait\/6583717_100x100.webp",
// "user_portrait_huge":"https:\/\/i.vimeocdn.com\/portrait\/6583717_300x300.webp",
// "stats_number_of_likes":0,"stats_number_of_plays":493,
// "stats_number_of_comments":0,"duration":1001,"width":1280,
// "height":720,"tags":"",
// "embed_privacy":"anywhere"}]
 */


/**
* Transcriptions application router 
*/
"use strict";
var app = app || {};
//TODO: not sure if backbone events still needed?
// _.extend(app, Backbone.Events);

var public_spreadsheet_url = 'https://docs.google.com/spreadsheets/d/1Xa1zX7_EQB6m77UdrUIXvhMm4owbDn9n59Pod8R-ozA/pubhtml';
/* 
  You need to declare the tabletop instance separately, then feed it into the model/collection
  You *must* specify wait: true so that it doesn't try to fetch when you initialize
*/
var storage = Tabletop.init( { key: public_spreadsheet_url, wait: true } )


/*
 Need to specify that you'd like to sync using Backbone.tabletopSync
 Can specify tabletop attributes, or you can do it on the collection
*/
app.Interview = Backbone.Model.extend({
  idAttribute: 'n',
  tabletop: {
    instance: storage,
    sheet: 'videos'
  },
  sync: Backbone.tabletopSync
})

/*
 Need to specify that you'd like to sync using Backbone.tabletopSync
 Need to specify a tabletop key and sheet
*/
app.InterviewCollection = Backbone.Collection.extend({
    // Reference to this collection's model.
    model: app.Interview,
    tabletop: {
      instance: storage,
      sheet: 'videos'
    },
    sync: Backbone.tabletopSync
});

app.InterviewView = Backbone.View.extend({
  tagname: 'div',
  template: _.template($('#interview-template').html()),
  initialize: function(){
     this.model.on('change', this.render, this);
  },
  render: function() {
    console.log(this)
    $(this.el).html(this.template(this.model.toJSON()));
    return this;
  }
})

app.OneInterviewView = Backbone.View.extend({
  tagname: 'div',
  template: _.template($('#interview-show-template').html()),
  initialize: function(){
     this.model.on('change', this.render, this);
  },
  render: function() {
    console.log(this)
    $(this.el).html(this.template(this.model.toJSON()));
    return this;
  }
})

/**
 * @function showInterviews 
 * @description function to display backbone collection of interviews into html elemen
 * @param  {backbone_collection} interviews a collection of backbone models
 * @return {hthml element}       html elements of backbone colleciton views
 */
function showInterviews(interviews_models) {
  console.info(interviews_models);
  var result =  document.createElement("div");
  for(var i=0; i<interviews_models.models.length; i++){
    var tmp_interview = new app.InterviewView({ model: interviews_models.models[i] });
    result.append( tmp_interview.render().el ); 
  }
  return result;
}

function showOneInterview(interview_model) {
  console.log("showOneInterview")
  console.info(interview_model);
    var tmp_interview = new app.OneInterviewView({ model: interview_model });
    return tmp_interview.render().el ; 
}


app.TranscriptionRouter = Backbone.Router.extend({
	routes: {
		"home" : "home",
		"interviews":"interviews",
    "interview/:id":"showInterview",
    "about":"about",
    "blog":"blog",
    "contact":"contact"
	},
	initialize: function(){
    //TODO: figure out what routes initialise is for
    console.info("Router: INITIALIZED ROUTER");
    app.interviews = new app.InterviewCollection();
    app.interviews.fetch({
      success: function(collection){
        //TODO: make it outomatic to fetch thumbnail images from viemo api 
        // for(var i = 0; i<collection.models.length; i++){
        //   var mn = collection.models[i];
        //     $.getJSON( "http://vimeo.com/api/v2/video/"+collection.models[i].get("vimeo_id")+".json", function( data ) {
        //       //
        //       console.log(data[0].thumbnail_medium);
        //       mn.set({"img_thumbnail": data[0].thumbnail_medium});
        //     });
        // }
        //TODO: fetch transcriptions 
        // for(var i = 0; i<collection.models.length; i++){
         collection.models.forEach(function(d){
   
            $.getJSON( d.get("transcription_json"), function( data ) {
              //
              console.log("before");
              console.log(d);

               d.set({"transcription_json": data});
              app.interviews.set(d,{remove: false});
               console.log("after");
              console.log(d);
            });
        });    




      } 
    });    
  },
   //TODO: router not going to default page
  home: function(){
  	console.log("in landing");
  	var descriptionText = "The Whistleblower Interview Project is a documentary archive of interviews with people who have made public interest disclosures. In these interviews they discuss why and how they blew the whistle, the consequences of their actions, and what their feelings are now. This project has brought their stories to thousands who would not otherwise know of the importance of what they do, the sacrifices they often made, and some of the important lessons learned.";
    var description = "<div class='col-xs-10 col-sm-10 col-md-10 col-lg-10 col-xs-offset-1 col-sm-offset-1 col-md-offset-1  col-lg-offset-1'>"
		+"<p class='lead text-justify'>"+descriptionText+"</p>"
		+"</div>"
		+"</div>";
	var video = "<div class='row'><div class='col-xs-8 col-sm-8 col-md-8 col-lg-8 col-xs-offset-2 col-sm-offset-2 col-md-offset-2  col-lg-offset-2'>"
		+"<div class='embed-responsive embed-responsive-16by9'>"
  		+"<iframe class='embed-responsive-item' width='100%'  src='https://player.vimeo.com/video/47937268?title=0&byline=0&portrait=0'></iframe>"
		+"</div></div> </div> <hr>";

    $('#main').html(video+description);
  },
  interviews: function(){
    $("#main").html(showInterviews(app.interviews));
  },
  showInterview: function(id) {
    console.info("Router: showTranscription: "+id);
    $("#main").html(showOneInterview(app.interviews.where({"id": id})[0]));

    // var tmpTranscription = app.TranscriptionsList.get({"cid":cid});
    // console.info("Router: showTranscription - title: "+tmpTranscription.attributes.title);
    // var tmpTranscriptionView = new app.TranscriptionView({model: tmpTranscription});
    // $("#main").html(tmpTranscriptionView.render().$el);
  },
  about: function(){
        $('#main').html("<h1>About</h1>");
  },
  blog: function(){
        $('#main').html("<h1>blog</h1>");
  },
  contact: function(){
        $('#main').html("<h1>contact</h1>");
  }

});

//This starts the application 
$(document).ready(function(){
  Backbone.history.start();
  app.transcriptionRouter = new app.TranscriptionRouter();
  //TODO: not sure if this is the right thing to do 
  // window.location = "index.html#transcriptions";
   window.location = "index.html#home";
});