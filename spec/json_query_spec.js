describe("where", function(){
    var input, expected_movies;

    beforeEach(function(){
        input = JsonQuery(Movies);
        
        expected_movies = [
            {"name":"Cool Hand Luke","rating":8.2,"director":"Stuart Rosenberg","year":1967,"actor":"Paul Newman"},
            {"name":"The Graduate","rating":8.1,"director":"Mike Nichols","year":1967,"actor":"Dustin Hoffman"},
            {"name":"Guess Who's Coming to Dinner","rating":7.7,"director":"Stanley Kramer","year":1967,"actor":"Spencer Tracy"}        ];
    });

    it("with no operator", function(){
        actual = input.where({'year': 1967});

        expect(actual.length).toEqual(3)
        expect(actual[0]).toEqual(expected_movies[0]);
    });

    it("with $eq operator", function(){
        actual = input.where({'year.$eq': 1967});

        expect(actual.length).toEqual(3)
        expect(actual[0]).toEqual(expected_movies[0]);
    });

    it("with $ne operator", function(){
        input = JsonQuery(expected_movies);
        actual = input.where({'rating.$ne': 8.2});

        expect(actual.length).toEqual(2)
        expect(actual[0]).toEqual(expected_movies[1]);
        expect(actual[1]).toEqual(expected_movies[2]);
    });
});

describe("where", function(){
    var input;

    beforeEach(function(){
      input = JsonQuery(Movies);
    });

    it("with $li operator", function(){
        actual = input.where({'name.$li': 'Terminator'});

        expect(actual.length).toEqual(2)
        expect(actual[0].name).toEqual("Terminator 2: Judgment Day");
        expect(actual[1].name).toEqual("The Terminator");
    });

    it("with $li operator with regex", function(){
        actual = input.where({'name.$li': /[a-zA-Z]+ [0-9]+/});

        expect(actual.length).toEqual(2)
        expect(actual[0].name).toEqual("Terminator 2: Judgment Day");
        expect(actual[1].name).toEqual("4 Months, 3 Weeks and 2 Days");
    });

    it("with $li without case sensitiveness", function(){
       actual = input.where({'name.$li': /terminator/i});

       expect(actual.length).toEqual(2)
       expect(actual[0].name).toEqual("Terminator 2: Judgment Day");
       expect(actual[1].name).toEqual("The Terminator");
    });
});
