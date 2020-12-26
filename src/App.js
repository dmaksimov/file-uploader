import React, { useState } from 'react';
import './App.css';

// Amplify libraries
import Amplify, { Storage } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);

const App = () => {
  const [fileUrl, setFileUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [progress, setProgress] = useState(0);

  const handleChange = async (e) => {
    const file = e.target.files[0];
    try {
      setLoading(true);
      setFileName('');
      await Storage.put(file.name, file, {
        level: 'private',
        progressCallback(progress) {
          setProgress(Math.floor((progress.loaded / progress.total) * 100));
        },
      });
      const url = await Storage.get(file.name, { level: 'private' })
      setFileUrl(url);
      setFileName(file.name);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="App">
      <h1> Upload a File </h1>
      {loading ? <h3>Uploading... {progress}%</h3> : <input
        type="file"
        onChange={(evt) => handleChange(evt)}
      />}
      <div>
        {fileUrl ? (<span>Done!</span>) : <span />}
      </div>
    </div>
  );
}

export default withAuthenticator(App);
