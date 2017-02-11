
import {MultiPartBuilder} from './utils';


const FILE = 'tracks.json';


export default function delve(obj, key, def, p) {
	p = 0;
	key = key.split ? key.split('.') : key;
	while (obj && p<key.length) obj = obj[key[p++]];
	return obj===undefined ? def : obj;
}

export function checkStatus() {

}


const create = function () {
  return gapi.client.drive.files
    .create({
      fields: 'id',
      resource: { name: FILE, parents: ['appDataFolder'] }
    })
    .then(response => {
      console.log('create', response);
      return delve(response, 'result.id', null);
    });
};


const prepare = function() {
  return gapi.client.drive.files
    .list({
      q: `name="${FILE}"`,
      spaces: 'appDataFolder',
      fields: 'files(id)'
    }).then(resp => {
      console.log('prepare', resp);
      console.log(delve(resp, 'result.files.0.id', undefined))
      return delve(resp, 'result.files.0.id') || create();
    })
}

export const load = () => {
  return prepare().then(id => {
    return gapi.client.drive.files
      .get({fileId: id, alt: 'media'})
      .then(resp => {
        console.log(resp);
        return delve(resp, 'result')
      })
  });
}


export const upload = (state) => {
  return prepare().then(id =>
    gapi.client.request({
      path: `/upload/drive/v3/files/${id}`,
      method: 'PATCH',
      params: { uploadType: 'media' },
      body: JSON.stringify(state)
    })
  );
}


window.prepare = prepare;
window.upload = upload;
window.load = load;
