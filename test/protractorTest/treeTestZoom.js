// spec.js
describe('Ultimo TLS', function() {
  var loginName = element(by.model('cred.username'));
  var loginPass = element(by.model('cred.password'));
  var loginEnv = element(by.model('cred.envid'));
  var loginButton = element(by.id('loginBtn'));
  var dropdown = element(by.model('timeSelected'));
  var toggle = dropdown.element(by.id('currentTimeSelect'));
  var envDropDown = element(by.model('envSelected'));
  var fromDate = element(by.model('calender.from'));
  var toDate = element(by.model('calender.to'));
  var calendarSub = element(by.id('customTimeSubmit'));
  var treemapSVG = element.all(by.id('treemapSVG'));
  var severityChart = element.all(by.id('severityPieChart'));
  var errorChart = element.all(by.id('errorTypePieChart'));
  var transactionChart = element.all(by.id('transactionType'));
  var customZoomIn = element(by.id('zoomIn'));
  var auditSearchBox = element(by.model('searchCriteria'));
  var auditSearchButton = element(by.id('auditSearchBtn'));
  var payloadButton = element(by.id('payloadBtn'));
  var replayTypeDDL = element(by.model('replayType'));
  var replayButton = element(by.id('replayBtnPayload'));
  var restSubmitButton = element(by.id('replayRestBtn'));
  var restEndpoint = element(by.model('restReplay.endpointUrl'));
  var restHeaderType = element(by.model('restReplay.header.type'));
  var restHeaderVal = element(by.model('restReplay.header.value'));
  var replayCloseBtn = element(by.id('closeMainBtn'));
  var replayButtonBatch = element(by.id('replayButton'));
  var fileLocation = element(by.model('fileReplay.location'));
  var filenameInput = element(by.model('fileReplay.name'));
  var fileSubmit = element(by.css('[ng-click="runFileService()"]'));

  function login(name, pass, envid) {
	loginName.clear().then(function(){
		loginName.sendKeys(name);
	});
	loginPass.clear().then(function(){
		loginPass.sendKeys(pass);
	});
	loginEnv.clear().then(function(){
		loginEnv.sendKeys(envid);
	});	
	loginButton.click();
  }
  function searchAudit(search){
	auditSearchBox.clear().then(function(){
		auditSearchBox.sendKeys(search);
	});
	auditSearchButton.click();
  };
  function enterRestData(endpoint, content, headerType, headerVal, method){
	restEndpoint.clear().then(function() {
		restEndpoint.sendKeys(endpoint);
	});
	element(by.cssContainingText('option', 'application/json')).click();
	restHeaderType.clear().then(function() {
		restHeaderType.sendKeys(headerType);
	});
	restHeaderVal.clear().then(function() {
		restHeaderVal.sendKeys(headerVal);
	});
	element(by.cssContainingText('option', 'POST')).click();
	restSubmitButton.click();
  }
  function enterFileData(location, filename, filetype){
	  fileLocation.clear().then(function(){
		fileLocation.sendKeys(location);  
	  })
	  filenameInput.clear().then(function(){
		filenameInput.sendKeys(filename);  
	  })
	  element(by.cssContainingText('option', filetype)).click();
	  fileSubmit.click();
  }

  beforeEach(function() {
    browser.get('http://localhost:8383/UltimoTLS/index.html#/treemap');
	browser.driver.manage().window().maximize();
  });

  it('should do a custom zoom', function() {
		login("a", "a", "PROD");
		toggle.click();
		element.all(by.repeater('time in timeOptions')).
			get(5).$('a').click();
		browser.sleep(500);
		fromDate.sendKeys("07/01/2015");
		toDate.sendKeys("07/31/2015");
		calendarSub.click();
		browser.sleep(750);
		treemapSVG.get(0).
			$('g').click();
		browser.sleep(750);
		customZoomIn.click();
		browser.actions().mouseMove({x: -100, y: 50 }).perform();
		browser.actions().mouseDown().perform();
		browser.actions().mouseMove({x:  100, y: 350}).perform();
		browser.sleep(1250);
		browser.actions().mouseUp().perform();
		browser.sleep(750);
  });
  
  
});