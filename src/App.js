import React, { useState } from 'react';
import './App.css';

// Amplify libraries
import Amplify, { Storage } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);

const App = () => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');

  const downloadUrl = async () => {
    Storage.get(fileKey, { level: 'private', download: true })
      .then(res => downloadBlob(res.Body, fileName))
  }

  const downloadBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'download';
    const clickHandler = () => {
      setTimeout(() => {
        URL.revokeObjectURL(url);
        a.removeEventListener('click', clickHandler);
      }, 150);
    };
    a.addEventListener('click', clickHandler, false);
    a.click();
    return a;
  }

  const handleChange = async (e) => {
    const file = e.target.files[0];
    try {
      setLoading(true);
      await Storage.put(file.name, file, {
        level: 'private',
        contentType: 'image/jpg'
      });
      const url = await Storage.get(file.name, { level: 'private' })
      setImageUrl(url);
      setFileName(file.name);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="App">
      <h1> Upload an Image </h1>
      {loading ? <h3>Uploading...</h3> : <input
        type="file"
        onChange={(evt) => handleChange(evt)}
      />}
      <div>
        {imageUrl ? (<a href={imageUrl}>{imageUrl}</a>) : <span />}
      </div>
      <div>
        <h2>Download URL?</h2>
        <button onClick={() => downloadUrl()}>Click Here!</button>
      </div>
    </div>
  );
}

export default withAuthenticator(App);
