import React from 'react';
import './bootstrap.min.css';

class EmotionTable extends React.Component {
  render() {
    //Returns the emotions as an HTML table
    const { emotions } = this.props
    return (
      <div>
        <table className="table table-bordered">
          <tbody>
            {
              Object.keys(emotions).map((value, index) => <tr key={index}><td>{value}</td><td>{emotions[value]}</td></tr>)
            }
          </tbody>
        </table>
      </div>
    );
  }

}
export default EmotionTable;