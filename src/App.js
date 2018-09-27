import React from 'react';
import styled, { injectGlobal } from 'styled-components';
import GridLines from './components/GridLines';

export const WIDTH = 423;
export const HEIGHT = 534;

// eslint-disable-next-line
injectGlobal`
  html, body {
    margin: 0;
    padding: 0;
  }
  body {
    overflow: hidden;
    overscroll-behavior: none;
  }
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: gray;
  height: 100vh;
`;

const Viewport = styled.div`
  /* width: 100vw; */
  /* height: 100vw; */
  width: ${WIDTH}px;
  height: ${HEIGHT}px;
  background-color: black;
  overflow: hidden;
`;

const SVGContainer = styled.svg.attrs({
  style: ({ scale, translate: { x, y } }) => ({
    transform: `scale(${scale}) translate(${x * 100}%, ${y * 100}%)`,
  }),
})`
  width: ${WIDTH}px;
  height: ${HEIGHT}px;
`;

export default class App extends React.PureComponent {
  state = {
    scale: 1,
    translate: {
      x: 0,
      y: 0,
    },
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateViewportBounds);
    this.updateViewportBounds();
    this.forceUpdate();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateViewportBounds);
  }

  updateViewportBounds = () => {
    this.viewportBounds = this.viewportElement.getBoundingClientRect();
  }

  handleScroll = (event) => {
    const MIN_SCALE = 1;
    const MAX_SCALE = 100;

    const {
      scale: currentScale,
      translate: {
        x: currentXTranslation,
        y: currentYTranslation,
      },
    } = this.state;

    const isZoomingOut = event.deltaY > 0;

    if (isZoomingOut && currentScale <= MIN_SCALE) {
      return;
    }

    if (!isZoomingOut && currentScale >= MAX_SCALE) {
      return;
    }

    const newScale = Math.min(
      MAX_SCALE,
      Math.max(
        MIN_SCALE,
        (currentScale + currentScale * (-event.deltaY / 100)),
      ),
    );

    const deltaScale = newScale - currentScale;

    const mousePos = {
      x: ((event.clientX - (this.viewportBounds.x)) / WIDTH) * 2 - 1,
      y: ((event.clientY - (this.viewportBounds.y)) / HEIGHT) * 2 - 1,
    };

    const deltaTranslation = {
      x: (deltaScale / (newScale * 2)) * -(mousePos.x / currentScale),
      y: (deltaScale / (newScale * 2)) * -(mousePos.y / currentScale),
    };

    const maxTranslation = (newScale - 1) / (newScale * 2);
    const minTranslation = -((newScale - 1) / (newScale * 2));

    const translate = {
      x: Math.min(
        maxTranslation,
        Math.max(
          minTranslation,
          currentXTranslation + deltaTranslation.x,
        ),
      ),
      y: Math.min(
        maxTranslation,
        Math.max(
          minTranslation,
          currentYTranslation + deltaTranslation.y,
        ),
      ),
    };

    this.setState({
      scale: newScale,
      translate,
    });
  }

  renderVieportContent() {
    if (!this.viewportBounds) return null;
    const { width, height } = this.viewportBounds;
    return (
      <SVGContainer
        startingWidth={width}
        startingHeight={height}
        {...this.state}
      >
        <GridLines
          size={Math.max(width, height)}
          numberOfDivisions={64}
        />
      </SVGContainer>
    );
  }

  render() {
    return (
      <Container>
        <Viewport
          onWheel={this.handleScroll}
          innerRef={(element) => {
            this.viewportElement = element;
          }}
        >
          {this.renderVieportContent()}
        </Viewport>
      </Container>
    );
  }
}
