
import { selectTracks } from 'store/sync';

/*global sinon,expect*/


describe('reducer', ()=>{

  it('should run tests', ()=>{
    let a = 1;
    expect(a).to.equal(1);
  });

  let state, rstate, tracks;

  beforeEach(() => {
    state = {
      'a': {
        id: 'a',
        kind: 'timer',
        desc: 'proba',
        state: 'recording',
        amount: 28062,
        lastRecord: 100
      },
      'c': {
        id: 'c',
        kind: 'timer',
        desc: 'proba',
        state: 'stopped',
        amount: 1000,
        lastRecord: 10
      }
    }

    rstate = {
      'a': {
        id: 'a',
        kind: 'timer',
        desc: 'proba',
        state: 'stopped',
        amount: 1000,
        lastRecord: 10
      },
      'b': {
        id: 'b',
        kind: 'timer',
        desc: 'proba',
        state: 'stopped',
        amount: 10,
        lastRecord: 10
      }
    }
    tracks = ['a', 'b', 'c']
  });

  it('should return a mixed state', () => {

    let res = selectTracks(tracks, state, rstate);
    expect(res).to.have.all.keys('a', 'b', 'c');
    expect(res.a.lastRecord).to.equal(100);


  })


});
