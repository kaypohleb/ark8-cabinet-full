const RockPaperScissors = require('../src/models/games/RockPaperScissors');
const Player = require('../src/models/Player');

jest.useFakeTimers();

test('add one player', ()=> {
    const player = new Player("Jonathan", "Jonathan");
    const game = new RockPaperScissors();

    game.addPlayer(player);
    expect(game.state.players).toEqual([player]);
});

test('add multiple players', ()=> {
    const playerNames = ["Joseph", "Caesar", "Lisa", "Smokey"];
    const players = playerNames.map((name) => new Player(name, name));

    const game = new RockPaperScissors();
    
    players.forEach((player) => {game.addPlayer(player)});
    expect(game.state.players).toEqual(players);
});

test('test setRounds', ()=> {
    const game = new RockPaperScissors();
    const rounds = 21;

    game.setRounds(rounds);

    expect(game.rounds).toEqual(rounds);
    expect(game.state.remainingRounds).toEqual(rounds);
});

test('test setTimeoutLength', ()=> {
    const game = new RockPaperScissors();
    const timeout = 420;
    
    game.setTimeoutLength(timeout);

    expect(game.timeout).toEqual(timeout);
});

test('10-round game with no players', ()=> {
    const updateCallback = jest.fn();
    const game = new RockPaperScissors(updateCallback);
    const timeout = 10000;

    game.start();
    jest.advanceTimersByTime(timeout * 5);
    expect(updateCallback).toBeCalledTimes(5);
})

test('1-round game with one player, player makes multiple selections', () => {
    const game = new RockPaperScissors(()=>{});
    const player = new Player("Jotaro", "Jotaro");

    game.setRounds(1);

    game.addPlayer(player);

    game.start();
    game.makeAction(player, {selection : "paper"});
    game.makeAction(player, {selection : "scissors"});
    game.makeAction(player, {selection : "rock"});

    jest.advanceTimersByTime(10000);

    expect(game.state.history[0].length).toEqual(1);
})

test('1-round game with two players', () => {
    const game = new RockPaperScissors(()=>{game.getState()});
    
    const player0 = new Player("Jotaro", "Jotaro");
    const player1 = new Player("Joseph", "Joseph");

    game.addPlayer(player0);
    game.addPlayer(player1);

    const finalScore = {"Jotaro" : 1, "Joseph" : 0};

    game.start();
    game.makeAction(player0, {selection : "paper"});
    game.makeAction(player0, {selection : "scissors"});
    game.makeAction(player0, {selection : "rock"});
    game.makeAction(player1, {selection : "scissors"});
    game.makeAction(player1, {selection : "paper"});
    game.makeAction(player1, {selection : "scissors"});

    jest.advanceTimersByTime(10000);

    expect(game.state.scores).toEqual(finalScore);
})

test('10-round game with two players', () => {
    const game = new RockPaperScissors(()=>{});
    game.setRounds(10);
    game.setTimeoutLength(10000);

    const player0 = new Player("Josuke", "Josuke");
    const player1 = new Player("Koichi", "Koichi");
    game.addPlayer(player0);
    game.addPlayer(player1);

    const finalScore = { "Josuke" : 10, "Koichi" : 0};

    game.start();
    for (let i = 0; i < 10; i++){
        game.makeAction(player0, {selection : "paper"});
        game.makeAction(player1, {selection : "rock"});
        jest.advanceTimersByTime(10000);
    }
    
    expect(game.state.scores).toEqual(finalScore);
})

test('1-round game with five players', () => {
    const game = new RockPaperScissors(()=>{game.getState()});
    
    const player0 = new Player("Jotaro", "Jotaro");
    const player1 = new Player("Joseph", "Joseph");
    const player2 = new Player("Polnareff", "Polnareff");
    const player3 = new Player("Kakyoyin", "Kakyoyin");
    const player4 = new Player("Avdol", "Avdol");
    
    game.addPlayer(player0);
    game.addPlayer(player1);
    game.addPlayer(player2);
    game.addPlayer(player3);
    game.addPlayer(player4);

    const finalScore = {"Jotaro" : 1, "Joseph" : 0, "Polnareff" : 0, "Kakyoyin" : 0, "Avdol" : 0};

    game.start();
    game.makeAction(player0, {selection : "scissors"});
    game.makeAction(player1, {selection : "paper"});
    game.makeAction(player2, {selection : "paper"});
    game.makeAction(player3, {selection : "paper"});
    game.makeAction(player4, {selection : "paper"});
    jest.advanceTimersByTime(10000);

    expect(game.state.scores).toEqual(finalScore);
})