import React from "../react";

const { Provider, Consumer } = React.createContext();

export default class Container extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      color: "red",
    };
  }

  setColor = (color) => {
    this.setState({ color });
  };

  render() {
    const style = {
      border: `2px solid ${this.state.color}`,
      padding: "4px",
    };
    return (
      <Provider value={{ color: this.state.color, setColor: this.setColor }}>
        <div style={style}>
          <Header />
          <Content />
        </div>
      </Provider>
    );
  }
}

class Header extends React.Component {
  render() {
    return (
      <div>
        Header
        <Title />
      </div>
    );
  }
}

class Content extends React.Component {
  render() {
    return (
      <Consumer>
        {({ color, setColor }) => {
          return (
            <div style={{ border: `2px solid ${color}` }}>
              Content
              <button onClick={() => setColor("red")}>设置成红色</button>
              <button onClick={() => setColor("green")}>设置成绿色</button>
            </div>
          );
        }}
      </Consumer>
    );
  }
}

class Title extends React.Component {
  render() {
    return (
      <Consumer>
        {({ color, setColor }) => {
          return <h3 style={{ border: `2px solid ${color}` }}>Title</h3>;
        }}
      </Consumer>
    );
  }
}
