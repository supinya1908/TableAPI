/**
* Create an DEMO Awesome Table view
*/
function AwTCreateView_demo(){
  var view = AwTCallWebService('CREATE', {
    viewSettings: {
      // all relevant settings for the view
      viewName: 'DEMO webservice - ' + (new Date()).toDateString(),
      visualizationType: 'Table',
      url: 'https://docs.google.com/spreadsheets/d/1Q2HvdQHQhyLdoAXf94SR70kpFHcA200l2c1-GzHAUNo/edit#gid=1282768648',
      sheet: 'Form Responses',
      range: 'A1:H', 
      rangeTemplate: 'Template!A1:B2'
    }
  });
  
  
  Logger.log('View ID :' + view.viewId);
  Logger.log('View URL :' + view.viewUrl);
}

/**
* List all Awesome Table view created by this app
*/
function AwTGetAllview_demo(){
  var views = AwTCallWebService('LISTVIEW');
  
  // log all view Name & IDs
  for (var i = 0; i < views.length; i++){
    Logger.log(views[i].settings.viewName + ' - ID: ' + views[i].viewId);
  }
}


/**
* Get an Awesome Table view created by this app and change its name
*/
function AwTGetEditAview_demo(){
  var views = AwTCallWebService('LISTVIEW');
  
  // no existing view for this App
  if (views.length == 0) return;
  
  // just for this example, get a view ID to use with 'getView'
  var viewId = views[0].viewId;
  
  // get (again, for the demo) the view settings for corresponding viewId
  var viewSettings = AwTCallWebService('GETVIEW', {
    viewId: viewId
  });
  
  // log settings for this view
  Logger.log(viewSettings);
  
  // change the view name
  viewSettings.viewName = 'Webservice DEMO - Edited view Name at ' + (new Date()).toDateString();
  
  // Change the name of the view
  var view = AwTCallWebService('EDIT', {
    viewId: viewId,
    
    // take care to include ALL previous settings
    viewSettings: viewSettings
  });
  
  // log result
  Logger.log(view);
}




/**
* External call for view creation
*/
function AwTCallWebService(action, parameters){
  var parameters = parameters || {};
  
  // Supercharge token
  Session.getEffectiveUser().getEmail();
  
  // get OAuth 2 token
  parameters.token = ScriptApp.getOAuthToken();
  
  // set the action of the call
  parameters.action = action;
  
  // set the App Title
  parameters.appTitle = "Awesome Table WebService DEMO";
  
  // Stringify viewSettings for the UrlFetch call
  if (parameters.viewSettings){
    parameters.viewSettings = JSON.stringify(parameters.viewSettings);
  }
  
  // web service URL
  var URL = "";
  
  // make the call
  var res = UrlFetchApp.fetch(URL, {
    method: "post",
    payload: parameters
  }).getContentText();
  
  
  // parse the answer
  var view = JSON.parse(res);
  
  // check for possible error
  if(view.error){
    throw view.error.message;
  }
  
  // use the answer
  return view;
}
