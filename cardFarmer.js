
// Licensed to the Apache Software Foundation (ASF) under one
// or more contributor license agreements.  See the NOTICE file
// distributed with this work for additional information
// regarding copyright ownership.  The ASF licenses this file
// to you under the Apache License, Version 2.0 (the
// "License"); you may not use this file except in compliance
// with the License.  You may obtain a copy of the License at

//   http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.

// Made by Vasile2k. See LICENSE

// SEND AS ARGUMENTS TO THIS SCRIPT STEAMID64, USERNAME AND PASSWORD. SEE FUNCTION initAccountInfo()

///////////////////////////////////////
//////////////////////////////////////
//  _____             _   _                
// |  __ \           | | (_)               
// | |__) |   _ _ __ | |_ _ _ __ ___   ___ 
// |  _  / | | | '_ \| __| | '_ ` _ \ / _ \
// | | \ \ |_| | | | | |_| | | | | | |  __/
// |_|  \_\__,_|_| |_|\__|_|_| |_| |_|\___|
//
//
///////////////////////////////////////
//////////////////////////////////////

var process = require("child_process");
var webpage = require("webpage");
var system  = require("system");

var execFile = process.execFile;
var page     = webpage.create();

var address         = "https://store.steampowered.com/";
var address_login   = "https://store.steampowered.com//login/?redir=0";

var steam_username  = "";
var steam_password  = "";
var steam_steamid64 = "";

var debugPageRender = false;
var debugPrint      = true;

page.settings.userAgent = "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.99 Safari/537.36";
page.settings.loadImages = false;
page.viewportSize = {width: 1920, height: 1080};

///////////////////////////////////////
//////////////////////////////////////
//   _____               
//  / ____|              
// | |     ___  _ __ ___ 
// | |    / _ \| '__/ _ \
// | |___| (_) | | |  __/
//  \_____\___/|_|  \___|
//                       
//                       
///////////////////////////////////////
//////////////////////////////////////

var step = 0; // Used for debug page rendering
var padString = "                         "; // 25-chars space string

function println(str){
	if(debugPrint)
		var prefix = "phantomjs: ";
		if(arguments.callee.caller)
			prefix = arguments.callee.caller.name + "(): ";
		var prefixLength = prefix.length;
		prefix += padString.slice(prefixLength)
		console.log(prefix + str);
}

function renderPage(){
	if(debugPageRender)page.render("Motorel" + step++ + ".png");
}

println("Sa trecem la treaba!");

page.open(address_login, navigateAtLogin);

println("Page opening...");

///////////////////////////////////////
//////////////////////////////////////
//  _                 _       
// | |               (_)      
// | |     ___   __ _ _ _ __  
// | |    / _ \ / _` | | '_ \ 
// | |___| (_) | (_| | | | | |
// |______\___/ \__, |_|_| |_|
//               __/ |        
//              |___/         
///////////////////////////////////////
//////////////////////////////////////

var steamAuthCode = "";

function getAuthCode(){
	println("Requesting code for " + steam_steamid64 + "...");
	debugger;
	process.execFile("Steam/SteamAuthenticatorCmd.exe", ["-account", steam_steamid64, "-getAuthCode"], null, function (err, stdout, stderr) {
		steamAuthCode = stdout;
		println("Code found: " + steamAuthCode);
		typeAuthShit();
	});
}

function initAccountInfo(){
	var args = system.args;
	if(args.length > 3){
		steam_steamid64 = args[1];
		steam_username  = args[2];
		steam_password  = args[3];
		println("Done");
	}else{
		println("Failed");
		phantom.exit(1);
	}
}

function navigateAtLogin(status){

	// var logged = page.evaluate(function(){return document.querySelector(".userpic") != null})

	initAccountInfo();

	println("Logging in...")

	renderPage();

	typeInCredentials();
	renderPage();

	login();
	renderPage();

	setTimeout(function(){

		getAuthCode();
		println("Waiting for code...");
		renderPage();

	}, 3000);
}

function typeInCredentials(){
	page.evaluateJavaScript("function(){" +
		"document.getElementById(\"input_username\").value = '" + steam_username + "';" +
		"document.getElementById(\"input_password\").value = '" + steam_password + "';" +
		"}");
	println("Done");
}

function login(){
	page.evaluate(function(){
		document.querySelector(".btnv6_blue_hoverfade.btn_medium").click();
	});
}

function typeAuthShit(){
	page.evaluateJavaScript("function(){document.getElementById('twofactorcode_entry').value = '" + steamAuthCode + "';}");
	accept();

	setTimeout(function(){
		renderPage();
	}, 10000);

	println("Done");
	farm();
}

function accept(){
	page.evaluate(function(){
		document.querySelector("#login_twofactorauth_buttonset_entercode > .auth_button.leftbtn").click();
	});
}

///////////////////////////////////////
//////////////////////////////////////
//  ______                   _             
// |  ____|                 (_)            
// | |__ __ _ _ __ _ __ ___  _ _ __   __ _ 
// |  __/ _` | '__| '_ ` _ \| | '_ \ / _` |
// | | | (_| | |  | | | | | | | | | | (_| |
// |_|  \__,_|_|  |_| |_| |_|_|_| |_|\__, |
//                                    __/ |
//                                   |___/ 
///////////////////////////////////////
//////////////////////////////////////

function farm(){

	page.onNavigationRequested = function(url, type, willNavigate, main){
		println('Trying to navigate to: ' + url);
		println('Caused by: ' + type);
		println('Will actually navigate: ' + willNavigate);
		println('Sent from the page\'s main frame: ' + main);
		renderPage();
	};

	page.onLoadFinished = function(status){
		println("Loaded!");
		page.evaluate(nextInQueue);
		renderPage();
	};

	page.evaluate(nextInQueue);
}

function nextInQueue(){
	var a = document.getElementsByClassName("begin_exploring")[0];

	if(a){
		a.click();
		return "Started exploring...";
	}

	var a2 = document.getElementById("refresh_queue_btn");
	if(a2){
		a2.click();
		return "Exploring queue again!";
	}

	var b = document.querySelector(".btn_next_in_queue.btn_next_in_queue_trigger");

	if(b){
		b.click();
		return "Gone to next item!";
	}

	var c = document.getElementById("ageYear");

	if(c){
		c.value = 1900;
		DoAgeGateSubmit();
		return "Submitted age!";
	}

	var d = document.querySelector(".btn_grey_white_innerfade.btn_medium");

	if(d){
		d.click();
		return "Accepted violent content!";
	}
	return "Failed!";
}
