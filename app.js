var restify = require("restify");
var builder = require("botbuilder");
var pokeapi = "http://pokeapi.co/api/v2/"
var pkmnOfficialArtwork = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other-sprites/official-artwork/";

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
        session.beginDialog("/welcome");
    },
    function (session, results) {
        session.send("Looking up Pokemon number %s ", results.response);
    }
]);

bot.dialog("/welcome", [
    function (session) {
        var card = new builder.HeroCard(session)
            .title("Pokedex")
            .text("Explor the Pokemon world")
            .images([
                 builder.CardImage.create(session, pkmnOfficialArtwork + "351.png")
            ]);
        var msg = new builder.Message(session).attachments([card]);
        session.send(msg);
        session.send("Hello, there! Glad to meet you! Welcome to the world of Pokemon");
        builder.Prompts.text(session, "Give me a Pokemon number.");
    }
]);

function lookupPkmn(number) {
    var callURL = pokeapi + "pokemon" + number + "/";

    var xhr = new XMLHttpRequest();
    xhr.open("GET", callURL, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            var serverResponse = xhr.responseText;
        }
    };
    xhr.send(null);

    return serverResponse;
}