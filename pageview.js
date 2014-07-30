var messages = [];
var count;
var sorting;
var paging;
var login;

function add_Content(postData)
{
    messages = postData;
}

function set_Login(log)
{
    login = log;
}

function set_Count(num)
{
    count = num;
}

function set_Sorting(str)
{
    sorting = str;
}

function set_Paging(num)
{
    paging = parseInt(num);
}

function nullview_Generate(response)
{
    console.log("nullview");
    response.writeHead(404, {"Content-Type": "text/html"});
    response.write("<html><head></head><body onload=\"document.nullview.submit()\">" + "<form method=\"POST\" action=\"start\" name=\"nullview\"><input type=\"hidden\" name=\"login\" value=\"" + login + "\"></form></body></html>");
    response.end();
}

function view_Generate(response)
{
    response.writeHead(404, {"Content-Type": "text/html"});
    response.write("<html>\n<head>\n<link rel=\"stylesheet\" type=\"text/css\" href=\"layout.css\" /><title>Message Board</title>\n</head>\n<body>\n");
    
    if(login < 1)
    {
        response.write("<div id=\"right\"><h2>Admin Only</h2><form action=\"adminLogin\" method=\"POST\"><label>Account:&nbsp&nbsp</label><input type=\"text\" id=\"account\" Name=\"account\"></br><label>Password:</label><input type=\"password\" id=\"password\" Name=\"password\"></br><input type=\"submit\" value=\"Login\"></form></div>");
    }
    else
    {
        response.write("<div id=\"right\"><h2>Admin Only</h2>");
        response.write("<form action=\"start\" method=\"POST\">");
        response.write("<button type =\"submit\" id=\"login\" name=\"login\" value=" + 0 + ">Logout</button></form></div>");
    }

    response.write("<h1>Message Board</h1></br>");
    
    response.write("<form action=\"start\" method=\"POST\" style=\"display:inline\">");
    response.write("<input type=\"hidden\" name=\"login\" value=\"" + login + "\">");
    response.write("<button type =\"submit\" id=\"sorting\" name=\"sorting\" value=\"1\">Ascending</button></form>");
    response.write("<form action=\"start\" method=\"POST\" style=\"display:inline\">");
    response.write("<input type=\"hidden\" name=\"login\" value=\"" + login + "\">");
    response.write("<button type =\"submit\" id=\"sorting\" name=\"sorting\" value=\"-1\">Descending</button></br>");
    response.write("</form></br>");
    var tbstr = "";
    tbstr += "<table class=\"fancytable\">\n";
    tbstr += "<tr class=\"dataroweven\">\n";
    tbstr += "<td align=\"middle\"><b>Username</b></td>\n";
    tbstr += "<td align=\"middle\"><b>E-Mail</b></td>\n";
    tbstr += "<td align=\"middle\"><b>Message</b></td>\n";
    tbstr += "<td align=\"middle\"><b>Time</b></td>\n";
    tbstr += "</tr>";
    for(var i = 0; i < messages.length; i++)
    {
        tbstr += ((i % 2 > 0) ? "<tr class=\"dataroweven\">\n" : "<tr class=\"datarowodd\">\n");
        tbstr += "<td>" + messages[i].username + "</td>\n";
        tbstr += "<td>" + messages[i].email + "</td>\n";
        tbstr += "<td>" + messages[i].message + "</td>\n";
        tbstr += "<td>" + messages[i].time.toUTCString() + "</td>\n";
        if(login > 0)
        {
            tbstr += "<form action=\"deleteRecord\" method=\"POST\">";
            tbstr += "<td>" + "<input type=\"hidden\" name=\"_id\" value=\"" + messages[i]._id + "\"><input type=\"hidden\" name=\"login\" value=\"" + login +  "\">" + "<input type=\"submit\" value=\"Delete\"></td>";
            tbstr += "</form>"
        }
        tbstr += "</tr>";

    }
    tbstr += "</table>\n</br>";
    response.write(tbstr);
    
    tbstr = "";
    
    if(paging > 0)
    {
        var previous = paging - 1;
        tbstr += "<form action=\"start\" method=\"POST\" style=\"display:inline\">";
        tbstr += "<input type=\"hidden\" name=\"sorting\" value=\"" + sorting + "\">";
        tbstr += "<input type=\"hidden\" name=\"login\" value=\"" + login + "\">";
        tbstr += "<button type =\"submit\" id=\"paging\" name=\"paging\" value=" + previous + ">Previous</button></form>";
    }
    if(paging < Math.floor((count - 1) / 10))
    {
        var next = paging + 1;
        tbstr += "<form action=\"start\" method=\"POST\" style=\"display:inline\">";
        tbstr += "<input type=\"hidden\" name=\"sorting\" value=\"" + sorting + "\">";
        tbstr += "<input type=\"hidden\" name=\"login\" value=\"" + login + "\">";
        tbstr += "<button type =\"submit\" id=\"paging\" name=\"paging\" value=" + next + ">Next</button></form>";
    }

    response.write(tbstr);
    
    tbstr = "";
    tbstr += "<h1>Welcome to leave any message!!!</h1><table><form method=\"POST\" action=\"leaveMessage\">";
    tbstr += "<tr><td><label>Name</label></td><td><input type=\"text\" id=\"username\" Name=\"username\"></td></tr>";
    tbstr += "<tr><td><label>E-Mail</label></td><td><input type=\"text\" id=\"email\" Name=\"email\"></td></tr>";
    tbstr += "<tr><td><label>Your message</label></td><td><textarea name=\"message\" rows=\"10\" cols=\"60\"></textarea></td></tr>";
    tbstr += "<tr><td><input type=\"submit\" value=\"Leave message\"></td><td></td></tr></form></table>";
    response.write(tbstr);
    
    response.write("</body>\n</html>");
    response.end();
}

exports.add_Content = add_Content;
exports.view_Generate = view_Generate;
exports.set_Count = set_Count;
exports.set_Paging = set_Paging;
exports.set_Sorting = set_Sorting;
exports.set_Login = set_Login;
exports.nullview_Generate = nullview_Generate;