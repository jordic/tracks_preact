import { h, Component } from 'preact';


export default function NewsModal({onClose}) {

  return (
    <div className="modal">
      <div className="modal__content">
        <h2>New version</h2>
        <img src="assets/drive.svg"
          alt="Google Drive Icon" width="64" />
        <p>Sync with Google Drive</p>
        <hr />
        <p>Report Bugs and feature requests:</p>
        <p>
          <a href="https://github.com/jordic/trackspr">
          github.com/jordic/trackspr
          </a>
        </p>
        <hr />
        <button className="btn-preload" onclick={onClose}>Continue</button>
      </div>
    </div>
  );

}
