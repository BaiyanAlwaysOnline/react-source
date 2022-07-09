import React from "../react";

class Sum extends React.Component {
  constructor(props) {
    super(props);
    this.a = React.createRef();
    this.b = React.createRef();
    this.result = React.createRef();
  }

  add = () => {
    const aValue = this.a.current.value;
    const bValue = this.b.current.value;
    this.result.current.value = aValue + bValue;
  };

  render() {
    return (
      <div>
        <input ref={this.a} /> + <input ref={this.b} />{" "}
        <button onClick={this.add}>=</button> <input ref={this.result} />
      </div>
    );
  }
}

export default Sum;
