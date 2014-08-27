describe('deepObserve', function() {
	var observed;
	var observer;
    var changes;

	beforeEach(function() {
		observed = {};
        changes = [];
        Object.deepObserve(observed, function (changesTriggered) {
            changes.push(changesTriggered);
        });
	});

	it("should be able to watch simple object and it's values same as regular Object.observe", function(done) {


		observed.a = 1;
		observed.a = 2;
		delete observed.a;
		setTimeout(function () {
			observed.b = 0;
		}, 4);

		setTimeout(function(){
			expect(changes.length).toBe(2);
			expect(changes[0].length).toBe(3);
			expect(changes[0][0].type).toBe('add');
			done();
		}, 10);

	});

    it('should be able to watch an object assigned to the root object', function (done) {

		var another={};
		observed.a = another;
		//delete observed.a;
		setTimeout(function () {
			another.a = 2;

			observed.b = 0;
		}, 4);

		setTimeout(function(){
			expect(changes.length).toBe(2);
			expect(changes[0].length).toBe(3);
			expect(changes[0][0].type).toBe('add');
			done();
		}, 10);


    })
});