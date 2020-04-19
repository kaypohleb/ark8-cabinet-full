const RudeCardsSM = require('./RudeCardsSM');
const firebase = require('../../firebase/firebase');
const shuffle = require('knuth-shuffle-seeded');
const db = firebase.firestore();
const getPrompts = async()=>{
    await db.collection('prompts').doc('rude_cards').get().then(result=>{allPrompts = result.data()});
}

let allPrompts = null;
class RudeCardsGame {
    constructor(players,settings){
        //TODO setup based on settings, default also taken from firestore
        getPrompts();
        this.id = 'RUDE_CARDS';
        this.history = [];
        this.timer = null;
        this.gameStateUpdateCallback = null;
        this.gameStateMachine = new RudeCardsSM(settings);
        
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
            totalRounds: 2,
            gameEnded: false,
        };

        this.playerStates = players.reduce( (playerStates, player) => {
            playerStates[player.id] = {availableResponses: [], currentResponse: null, votableResponses: [], votedResponse: null};
            return playerStates;
        }, {});

        this.hiddenState = {
            availablePrompts: [],
            availableResponses: [],
            currentResponses: [],
        };
        if(settings){
            this.gameState.totalRounds = settings.totalRounds.defaultValue;
        }
        
    }
    end(){
        console.log('ending game...')
        const players = this.gameState.players;
        players.sort((a,b) => b.score - a.score); // sort by highest score first
        const winner = players[0];
        this.publishScoreCallback(winner, players);
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
                this.setPrompts(allPrompts.prompts);
                this.setResponses(allPrompts.responses);
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
            else if (phase == 'END_GAME'){
                if(this.gameState.toEnd){
                    this.end();
                }
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


        //console.log('available prompts length: ', this.hiddenState.availablePrompts.length, 'available responses length: ', this.hiddenState.availableResponses.length);
        this.gameStateUpdateCallback(game, players);
    }

    setPrompts = (prompts)=>{
        this.hiddenState.availablePrompts = [...prompts];
        shuffle(this.hiddenState.availablePrompts);
    }

    setResponses = (responses)=>{
        this.hiddenState.availableResponses = [...responses];
        shuffle(this.hiddenState.availableResponses);
    }

}

module.exports = RudeCardsGame;