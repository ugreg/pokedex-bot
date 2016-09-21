var builder = require("botbuilder");
var http = require("http");
var request = require("request");
var restify = require("restify");

//=========================================================
// Bot Setup
//=========================================================

var pokeapi = "http://pokeapi.co/api/v2/"
var pkmnOfficialArtwork = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other-sprites/official-artwork/";


// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log("%s listening to %s", server.name, server.url);
});

// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
server.post("/api/messages", connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog("/", [
    function (session) {
        session.beginDialog("/welcome");
    },
    function (session, results) {
        session.send("Let\'s see what I can find on this pokemon . . .");
        var name = lookupPkmn(121);
        session.send("Oh, it\s %s !", name);
        var card = new builder.HeroCard(session)
            .title(name)
            .text("Type")
            .images([
                builder.CardImage.create(session, pkmnOfficialArtwork + results.response + ".png")
            ]);
        var msg = new builder.Message(session).attachments([card]);
        session.send(msg);
    },
    function (session) {

    }
]);

bot.dialog("/welcome", [
    function (session) {
        var card = new builder.HeroCard(session)
            .title("Pokedex Bot")
            .text("Explore the Pokemon World")
            .images([
                builder.CardImage.create(session, "http://cdn.bulbagarden.net/upload/3/30/FireRed_LeafGreen_Professor_Oak.png")
            ]);
        var msg = new builder.Message(session).attachments([card]);
        session.send(msg);
        session.send("Hello, there! Glad to meet you! Welcome to the world of Pokemon");
        builder.Prompts.text(session, "Give me a Pokemon number.");
    }
]);

function lookupPkmn(number) {
    var reqURL = pokeapi + "pokemon/" + number + "/";

    var headers = {
        "User-Agent": "Greg Universe/0.2",
        "Content-Type": "application/x-www-form-urlencoded"
    }

    var options = {
        url: reqURL,
        method: "GET",
        headers: headers
    }

    var x;

    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            x = JSON.parse(body);
            console.log(x);
        }
    });

    return x.forms[0].name;
}