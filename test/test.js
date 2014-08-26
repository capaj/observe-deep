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

	xit("should be able to watch simple object and it's values same as regular Object.observe", function() {

        runs(function () {
            observed.a = 1;
            observed.a = 2;
            delete observed.a;
            setTimeout(function () {
                observed.b = 0;
            }, 4)
        });

        waits(10);

        runs(function () {

            expect(changes.length).toBe(2);
            expect(changes[0].length).toBe(3);
            expect(changes[0][0].type).toBe('add');

        });
	});

    it('should be able to watch an object assigned to the root object', function () {
        runs(function () {
            var another={};
            observed.a = another;
            //delete observed.a;
            setTimeout(function () {
                another.a = 2;

                observed.b = 0;
            }, 4)
        });

        waits(10);

        runs(function () {

            expect(changes.length).toBe(2);
            expect(changes[0].length).toBe(3);
            expect(changes[0][0].type).toBe('add');

        });
    })
});