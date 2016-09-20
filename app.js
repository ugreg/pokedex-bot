var restify = require('restify');
var builder = require('botbuilder');

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog('/', [
    function (session) {
        builder.Prompts.text(session, 'Welcome to Pokedex bot! Give me a Pokemon number.');
    },
    function (session, results) {
        session.send('Looking up Pokemon number %s ', results.response);
    },
    function (session) {

    }
]);

function loopupPokemon(number) {
    var callURL = "http://pokeapi.co/api/v2/pokemon" + number + "/";

    xhr.open("GET", callURL, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            var serverResponse = xhr.responseText;
        }
    };
    xhr.send(null);

    return serverResponse;
}