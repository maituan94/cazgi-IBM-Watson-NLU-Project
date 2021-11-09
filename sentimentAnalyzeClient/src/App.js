import './bootstrap.min.css';
import './App.css';
import EmotionTable from './EmotionTable.js';
import React from 'react';

class App extends React.Component {
  state = {
    isText: true,
    sentimentOutput: [],
    sentiment: true
  }

  renderOutput = (input_mode) => {
    let isText = false
    if (input_mode === "text") {
      isText = true
    }
    this.setState({ isText })
  }

  sendForSentimentAnalysis = () => {
    this.setState({ sentiment: true });
    const mode = this.state.isText ? "text" : "url"
    const url = `./${mode}/sentiment?${mode}=${document.getElementById("textinput").value}`

    fetch(url).then((response) => {
      response.json().then((data) => {
        this.setState({ sentimentOutput: data.label });
        let output = data.results.label;
        let color = "yellow"
        switch (output) {
          case "positive": color = "green"; break;
          case "negative": color = "red"; break;
          default: break;
        }
        output = <div style={{ color: color, fontSize: 20 }}>{output}</div>
        this.setState({ sentimentOutput: output });
      })
    });
  }

  sendForEmotionAnalysis = () => {

    this.setState({ sentiment: false });
    const mode = this.state.isText ? "text" : "url"
    const url = `./${mode}/emotion?${mode}=${document.getElementById("textinput").value}`

    fetch(url).then((response) => {
      response.json().then((data) => {
        this.setState({ sentimentOutput: <EmotionTable emotions={data.results} /> });
      })
    });
  }


  render() {
    const { isText } = this.state
    const rows = isText ? 4 : 1
    return (
      <div className="App">
        <button className="btn btn-info" onClick={() => { this.renderOutput('text') }}>Text</button>
        <button className="btn btn-dark" onClick={() => { this.renderOutput('url') }}>URL</button>
        <br /><br />
        <textarea rows={rows} cols="50" id="textinput" />
        <br />
        <button className="btn-primary" onClick={this.sendForSentimentAnalysis}>Analyze Sentiment</button>
        <button className="btn-primary" onClick={this.sendForEmotionAnalysis}>Analyze Emotion</button>
        <br />
        {this.state.sentimentOutput}
      </div>
    );
  }
}

export default App;
