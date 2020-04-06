const RudeCards = require('../src/models/games/RudeCardsGame');
const Player = require('../src/models/Player');
const {prompts, responses} = require('./RudeCards.json')

const playerNames = ["Giorno", "Bruno", "Guido", "Narancia", "Diavolo"];
let players;

beforeEach(() => {
    players = playerNames.map((name) => new Player(name, name));
})

test('', () => {  

    console.log('INITIALIZE');
    let game = new RudeCards(players);
    game.gameStateUpdateCallback = () => {};
    console.log(game);

    console.log('ADD PROMPTS AND RESPONSES');
    game.setPrompts(prompts);
    game.setResponses(responses);
    console.log(game);

    console.log('START GAME, REVEAL PROMPTS');
    game.makeAction(null, {actionType: 'NEXT_PHASE'})
    console.log(game);

    console.log('REVEALED PROMPTS');
    game.makeAction(null, {actionType: 'NEXT_PHASE'})
    console.log(game.playerStates["Giorno"]);

    console.log('PLACING CARDS');
    let card0 = game.playerStates["Giorno"].availableResponses[0];
    let card1 = game.playerStates["Bruno"].availableResponses[0];
    game.makeAction("Giorno", {actionType: 'SEND_CARD', response: card0});
    game.makeAction("Bruno", {actionType: 'SEND_CARD', response: card1});
    game.makeAction(null, {actionType: 'NEXT_PHASE'})
    console.log(game);

    console.log('REVEALING RESPONSES');
    game.makeAction(null, {actionType: 'NEXT_PHASE'})
    console.log(game);

    console.log('VOTING');
    game.makeAction("Giorno", {actionType: 'SEND_VOTE', card1})
    game.makeAction(null, {actionType: 'NEXT_PHASE'})
    console.log(game);

    console.log('UPDATING SCORES');
    game.makeAction(null, {actionType: 'NEXT_PHASE'})
    console.log(game);

    console.log('DRAWING CARDS');
    game.makeAction(null, {actionType: 'NEXT_PHASE'})
    console.log(game);
})