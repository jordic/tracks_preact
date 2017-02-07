function isTouchDevice() {
  return 'ontouchstart' in window;
}



export default {
  GAPI_UID: '784309713365-ho3koq0d7e0pr32jbs162o9bi19q01n6.apps.googleusercontent.com',
  SCOPES: ['https://www.googleapis.com/auth/spreadsheets'],
  GJS_CLIENT: 'https://apis.google.com/js/client.js?onload=',
  DISCOVERY: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
  IsTouch: isTouchDevice()
};
