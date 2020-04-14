const RudeCardsSM = require('./RudeCardsSM');
const shuffle = require('knuth-shuffle-seeded');
const {prompts, responses} = require('./RudeCardsData.json');

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
                responses: [],
                revealedResponses: []
            },
            timerStart: null,
            timerLength: 10000,
            currentRound: 0,
            totalRounds: 5,
            gameEnded: false,
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

        this.setPrompts(prompts);
        this.setResponses(responses);
    }


    printState(){
        return {
            game: {...this.gameState},
            players: {...this.playerStates}
        }
    }


    start(){
        const nextPhase = ((timerStart, timerLength) => {this.makeAction(null, {actionType: 'NEXT_PHASE', timerStart: timerStart, timerLength: timerLength})}).bind(this)
        const turn = (function(){
            const phase = this.gameState.currentPhase;
            if (phase == 'INITIAL'){
                nextPhase(Date.now(), 3000);
                turn();
            }
            else if (phase == 'DRAW_CARDS'){
                setTimeout(() => {
                    nextPhase(Date.now(), 10000)
                    turn();
                }, 3000)
            }
            else if (phase == 'PLACE_CARDS'){
                setTimeout(() => {
                    nextPhase(Date.now(), 5000)
                    turn();
                },10000)
            }
            else if (phase == 'VOTING'){
                setTimeout(() => {
                    nextPhase(Date.now(), 5000)
                    turn();
                },5000)
            }
            else if (phase == 'UPDATE_SCORES'){
                setTimeout(() => {
                    nextPhase(Date.now(), 3000)
                    turn();
                }, 5000)
            }
        }).bind(this);

        turn();
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


        console.log('available prompts length: ', this.hiddenState.availablePrompts.length, 'available responses length: ', this.hiddenState.availableResponses.length);
        this.gameStateUpdateCallback(game, players);
    }

    setPrompts(prompts){
        this.hiddenState.availablePrompts = [...prompts];
        shuffle(this.hiddenState.availablePrompts);
    }

    setResponses(responses){
        this.hiddenState.availableResponses = [...responses];
        shuffle(this.hiddenState.availableResponses);
    }

}

module.exports = RudeCardsGame;