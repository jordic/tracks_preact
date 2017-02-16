import { migrateStore, withoutAction } from 'store/migrations';


/*global sinon,expect*/

describe('migratesotrev1', ()=>{

  it('should run tests', ()=>{
    let a = 1;
    expect(a).to.equal(1);
  });

  let state;

  beforeEach(()=>{
    state = {
      tracks: [
        '1487093831450-5',
        '1487093902979-9'
      ],
      tracksEntities: {
        '1487093831450-5': {
          id: '1487093831450-5',
          kind: 'timer',
          desc: 'Time',
          state: 'stopped',
          amount: 71095,
          lastRecord: 1487093965319
        },
        '1487093902979-9': {
          id: '1487093902979-9',
          kind: 'counter',
          desc: 'proba',
          state: 'stopped',
          amount: 7,
          lastRecord: 1487096007062
        }
      },
      logs: [
        '1487093831451-6',
        '1487093773803-4'
      ],
      logsEntities: {
        '1487093773803-4': {
          id: '1487093773803-4',
          action: 'recording',
          trackId: '1487093772076-2',
          time: 1487093773802,
          amount: 0
        },
        '1487093831451-6': {
          id: '1487093831451-6',
          action: 'track_add',
          trackId: '1487093831450-5',
          time: 1487093831450,
          amount: 0
        }
      }
    };
  });


  describe('function without action', ()=>{

    it('should return tracks without add action tracked on log', ()=>{

      let result = withoutAction(state);
      expect(result).to.eql(['1487093902979-9']);

    });
  });

  it('should add a log of tracks creation, to allow replication', () => {

    let result = migrateStore(state);
    expect(Object.keys(result.logsEntities).length).to.eq(3);
    let res = Object.keys(result.logsEntities)
      .map(a => result.logsEntities[a])
      .filter(a => a.action === 'track_add')
      .map(a => a.trackId);
    expect(res.includes('1487093902979-9')).to.eq(true);
    expect(res.includes('1487093831450-5')).to.eq(true);
    expect(res.length).to.eq(2);
    expect(result.logs.length).to.eq(3);

  });

});
