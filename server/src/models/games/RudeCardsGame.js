const RudeCardsSM = require('./RudeCardsSM');
const firebase = require('../../firebase/firebase');
const shuffle = require('knuth-shuffle-seeded');
const db = firebase.firestore();

class RudeCardsGame {
    constructor(players,settings){
        console.log("settings:" , settings);
        //TODO setup based on settings, default also taken from firestore
        this.id = 'RUDE_CARDS';
        this.settings = settings;
        this.history = [];
        this.timer = null;
        this.timers = {
            placeCards: 10,
            voting: 10,
            update: 5
        };
        this.gameStateUpdateCallback = null;
        this.gameStateMachine = new RudeCardsSM(this.settings);
        
        
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

        if(this.settings){
            this.gameState.totalRounds = this.settings.totalRounds.defaultValue;
            this.timers.placeCards = this.settings.placeCardsTimer.defaultValue;
            this.timers.voting = this.settings.votingTimer.defaultValue;
            this.timers.update = this.settings.updateTimer.defaultValue;
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


    async start(){
        const promptsRef = await db.collection('prompts').doc('rude_cards').get();
        const allPrompts = await promptsRef.data();

        const prompts = allPrompts.prompts;
        const responses = allPrompts.responses;

        if (this.settings && this.settings.customPrompts){
            prompts.concat(this.settings.customPrompts);
        }

        if (this.settings && this.settings.customResponse){
            responses.concat(this.customResponse);
        }

        this.setPrompts(prompts);
        this.setResponses(responses);

        const nextPhase = ((timerStart, timerLength) => {this.makeAction(null, {actionType: 'NEXT_PHASE', timerStart: timerStart, timerLength: timerLength})}).bind(this)

        const turn = (function(){
            const phase = this.gameState.currentPhase;
            console.log("CURRENT PHASE", phase, "CALLED TURN")
            if (phase == 'INITIAL'){
                nextPhase(Date.now(), this.timers.placeCards * 1000);
                setTimeout(turn, this.timers.placeCards * 1000);
            }
            else if (phase == 'DRAW_CARDS'){
                nextPhase(Date.now(), this.timers.placeCards * 1000);
                setTimeout(turn, this.timers.placeCards * 1000);
            }
            else if (phase == 'PLACE_CARDS'){
                nextPhase(Date.now(), this.timers.voting * 1000);
                setTimeout(turn, this.timers.voting * 1000);
            }
            else if (phase == 'VOTING'){
                nextPhase(Date.now(), this.timers.update * 1000);
                setTimeout(turn, this.timers.update * 1000);
            }
            else if (phase == 'UPDATE_SCORES'){
                nextPhase(Date.now(),0);
                turn();
            }
            else if (phase == 'END_GAME'){
                this.end();
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