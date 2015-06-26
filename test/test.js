describe('deepObserve', function() {
  var observed;

  function observer(changesTriggered) {
    changes.push(changesTriggered);
  }

  var changes;
  var deliver;

  beforeEach(function() {
    observed = {};
    changes = [];
    deliver = Object.deepObserve(observed, observer);
  });
  
  it('should throw when cyclic object is detected', function(){
      //TODO implement
  });

  xit("should be able to watch simple object and it's values same as regular Object.observe, deliver function should be returned", function(done) {

    observed.a = 1;
    observed.a = 2;
    delete observed.a;
    deliver();
    expect(changes.length).toBe(1);

    setTimeout(function() {
      observed.b = 0;
    }, 4);

    setTimeout(function() {
      expect(changes.length).toBe(2);
      expect(changes[0].length).toBe(3);
      expect(changes[0][0].type).toBe('add');
      done();
    }, 10);

  });

  it('should watch an object assigned to the root object and stop watching it when it is deleted', function(done) {

    var another = {};
    observed.a = another;
    //delete observed.a;
    setTimeout(function() {
      another.propOnAnother = 'value on another';
      observed.b = 0;
    }, 4);

    setTimeout(function() {
      expect(changes.length).toBe(2);
      expect(changes[0].length).toBe(1);
      expect(changes[0][0].type).toBe('add');
      delete observed.a;
      deliver();

    }, 10);

    setTimeout(function() {
      another.c = 1;
    }, 12);

    setTimeout(function() {
      expect(changes.length).toBe(2);	//TODO find out reason for failure

      done();
    }, 15)

  })

});