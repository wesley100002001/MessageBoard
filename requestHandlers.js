var pageview = require("./pageview");
var querystring = require("querystring");
var mongodb = require("mongodb");
var MongoClient = require("mongodb").MongoClient;
var Server = require("mongodb").Server;
var fs = require("fs");

function start(response, postData)
{
    console.log("Request handler 'start' was called.");
    var content = querystring.parse(postData)
    var loginOption = ((typeof content.login != 'undefined') ? content.login : 0);
    pageview.set_Login(loginOption);
    var sortingOption = ((typeof content.sorting != 'undefined') ? content.sorting : 1);
    pageview.set_Sorting(sortingOption);
    var pageOption = ((typeof content.paging != 'undefined') ? content.paging : 0);
    pageview.set_Paging(pageOption);
    
    
    var dbclient =  new MongoClient(new Server("localhost", 27017), {native_parser: true});
    dbclient.open(function(err, dbclient){
        var msgdb = dbclient.db("messageDB");
        msgdb.collection('record').count(function(err, count){
            pageview.set_Count(count)
        });
        var allmsg = msgdb.collection('record').find({}, {"sort": [["time", sortingOption]], "limit": 10, "skip": pageOption * 10});
        
        allmsg.toArray(function(err, results){
            pageview.add_Content(results);
            pageview.view_Generate(response);
        });
    });
}

function adminLogin(response, postData)
{
    var content = querystring.parse(postData);
    
    var dbclient =  new MongoClient(new Server("localhost", 27017), {native_parser: true});
    dbclient.open(function(err, dbclient){
        var msgdb = dbclient.db("admin");

        var cursor = msgdb.collection('admin').find({"account": content.account, "password": content.password});
        
        cursor.count(function(err, count){
            if(count > 0)
            {
                pageview.set_Login(1);
                pageview.nullview_Generate(response);
            }
            else
            {
                pageview.set_Login(0);
                pageview.nullview_Generate(response);
            }
        });
    });
}

function deleteRecord(response, postData)
{
    var content = querystring.parse(postData);
    
    var dbclient =  new MongoClient(new Server("localhost", 27017), {native_parser: true});
    dbclient.open(function(err, dbclient){
        var msgdb = dbclient.db("messageDB");
                  
        var document = {_id: new mongodb.ObjectID(content._id)};
        //delete record
        msgdb.collection('record').remove(document, function(err, records) {
            if (err) throw err;
            console.log(records);
        });
                  
    });
    pageview.nullview_Generate(response);
}

function leaveMessage(response, postData)
{
    console.log("Request handler 'leaveMessage' was called.");
    
    var content = querystring.parse(postData);
    
    var dbclient =  new MongoClient(new Server("localhost", 27017), {native_parser: true});
    dbclient.open(function(err, dbclient){
        var msgdb = dbclient.db("messageDB");

        var document = {username:content.username, email:content.email, message:content.message, time: new Date()};
        //insert record
        msgdb.collection('record').insert(document, function(err, records) {
            if (err) throw err;
            console.log("Record added as "+records[0]._id);
        });

    });
    pageview.nullview_Generate(response);
}

function layout(response) {
    
    console.log("Request handler 'layout.css' was called.");
    fs.readFile("layout.css", function(error, file) {
        if(error)
        {
            response.writeHead(500, {"Content-Type": "text/plain"});
            response.write(error + "\n");
            response.end();
        }
        else
        {
            response.writeHead(200, {"Content-Type": "text/css"});
            response.write(file);
            response.end();
        }

    });
}

exports.start = start;
exports.leaveMessage = leaveMessage;
exports.adminLogin = adminLogin;
exports.deleteRecord = deleteRecord;
exports.layout = layout;