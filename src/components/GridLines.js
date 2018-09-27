import React from 'react';

export default class GridLines extends React.PureComponent {
  componentDidMount() {
    const { size, numberOfDivisions } = this.props;
    this.lines = [];
    for (let i = 0; i < numberOfDivisions; i++) {
      const percent = i / numberOfDivisions;
      this.lines.push({

        position: percent * size,
        color: `hsl(${Math.floor(percent * 360)}, 100%, 50%)`,
      });
    }
    this.forceUpdate();
  }

  render() {
    if (!this.lines) return null;
    return this.lines.map(({ position, color }) => {
      return (
        <React.Fragment>
          <line
            key={`hl:${position}`}
            x1={0}
            y1={position}
            x2={this.props.size}
            y2={position}
            style={{
              stroke: 'white',
              // stroke: color,
            }}
          />
          <line
            key={`vl:${position}`}
            x1={position}
            y1={0}
            x2={position}
            y2={this.props.size}
            style={{
              // stroke: 'white',
              stroke: color,
            }}
          />
        </React.Fragment>
      );
    });
  }
}
