const RudeCardsSM = require('./RudeCardsSM');

class RudeCardsGame {
    constructor(players){
        this.id = 'RUDE_CARDS';
        this.history = [];
        this.timer = null;
        this.gameStateUpdateCallback = null;
        this.gameStateMachine = new RudeCardsSM();

        this.gameState = {
            gameId: 'RUDE_CARDS',
            players: players.map((player) => ({id: player.id, name: player.name, score: 0})),
            currentPhase: 'INITIAL',
            currentPrompt: {
                prompt: null,
                responses: []
            },
            timerStart: null,
            timerLength: null,
            currentRound: 0,
            totalRounds: 5
        };

        this.playerStates = players.reduce( (playerStates, player) => {
            playerStates[player.id] = {availableResponses: [], currentResponse: null, votableResponses: [], votedResponse: null};
            return playerStates;
        }, {});

        this.hiddenState = {
            availablePrompts: [],
            availableResponses: [],
            currentResponses: []
        };
    }


    printState(){
        return {
            game: {...this.gameState},
            players: {...this.playerStates}
        }
    }


    start(){

    }


    validateAction(userId, action){
        return true;
    }


    makeAction(userId, action){
        this.history.push({gameState: {...this.gameState}, playerStates: {...this.playerStates}});
        const {game, players, hidden} = this.gameStateMachine.step(userId, action, {...this.gameState}, {...this.playerStates}, {...this.hiddenState});
        this.gameState = game;
        this.playerStates = players;
        this.hiddenState = hidden;

        this.gameStateUpdateCallback(game, players);
    }

    setPrompts(prompts){
        this.hiddenState.availablePrompts = prompts;
    }

    setResponses(responses){
        this.hiddenState.availableResponses = responses;
    }

}

module.exports = RudeCardsGame;