import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Header from './components/Header';
import UrlForm from './components/UrlForm';
import Summary from './components/Summary';
import McqList from './components/McqList';
import './App.css';

function App() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [language, setLanguage] = useState('en');

  const parseResponse = (responseText) => {
    try {
      // First try to parse directly
      return JSON.parse(responseText);
    } catch (e1) {
      try {
        // If that fails, try cleaning markdown formatting
        const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleaned);
      } catch (e2) {
        console.error('Failed to parse response:', e2);
        throw new Error('Invalid response format from server');
      }
    }
  };

  const handleSubmit = async (url) => {
    if (!url) {
      toast.error('Please enter a YouTube URL');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/generate', {
        url: url
      });

      const parsedData = parseResponse(response.data.output);
      setResult(parsedData);
      setLanguage(response.data.language);
      toast.success('MCQs generated successfully!');
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.error || error.message || 'Failed to generate MCQs');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <Header />
      <div className="container">
        <UrlForm onSubmit={handleSubmit} loading={loading} />
        {loading && (
          <div className="loader-container">
            <div className="loader"></div>
            <p>Generating MCQs from the video...</p>
          </div>
        )}
        {result && !loading && (
          <>
            {result.error ? (
              <div className="error">{result.error}</div>
            ) : (
              <>
                <Summary summary={result.summary} />
                <McqList mcqs={result.quiz} language={language} />
              </>
            )}
          </>
        )}
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default App;