import React from 'react';
import styled, { injectGlobal } from 'styled-components';
import GridLines from './components/GridLines';
import { clamp } from './utils/math';

const MIN_SCALE = 1;
const MAX_SCALE = 100;

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
  width: 77vw;
  height: 66vh;
  background-color: black;
  overflow: hidden;
`;

const SVGContainer = styled.svg.attrs({
  style: ({ scale, translate: { x, y } }) => ({
    transform: `scale(${scale}) translate(${x * 100}%, ${y * 100}%)`,
  }),
})`
  width: ${props => props.startingWidth}px;
  height: ${props => props.startingHeight}px;
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
    const {
      scale: currentScale,
      translate: {
        x: currentXTranslation,
        y: currentYTranslation,
      },
    } = this.state;
    const { viewportBounds } = this;

    const isZoomingOut = event.deltaY > 0;

    if (isZoomingOut && currentScale <= MIN_SCALE) {
      return;
    }

    if (!isZoomingOut && currentScale >= MAX_SCALE) {
      return;
    }

    const newScale = clamp(
      currentScale + currentScale * (-event.deltaY / 100),
      MIN_SCALE,
      MAX_SCALE,
    );

    const deltaScale = newScale - currentScale;

    const mousePos = {
      x: ((event.clientX - (viewportBounds.x)) / viewportBounds.width) * 2 - 1,
      y: ((event.clientY - (viewportBounds.y)) / viewportBounds.height) * 2 - 1,
    };

    const deltaTranslation = {
      x: (deltaScale / (newScale * 2)) * -(mousePos.x / currentScale),
      y: (deltaScale / (newScale * 2)) * -(mousePos.y / currentScale),
    };

    const maxTranslation = (newScale - 1) / (newScale * 2);
    const minTranslation = -((newScale - 1) / (newScale * 2));

    const translate = {
      x: clamp(
        currentXTranslation + deltaTranslation.x, 
        minTranslation, 
        maxTranslation
      ),
      y: clamp(
        currentYTranslation + deltaTranslation.y, 
        minTranslation, 
        maxTranslation
      ),
    };

    this.setState({
      scale: newScale,
      translate,
    });
  }

  handlePointerMove = (event) => {
    const { isDragging, translate: { x, y }, scale } = this.state;
    if (!isDragging) return;
    const { width, height } = this.viewportBounds;
    
    
    const maxTranslation = (scale - 1) / (scale * 2);
    const minTranslation = -((scale - 1) / (scale * 2));

    const deltaX = (event.movementX / width) / scale;
    const deltaY = (event.movementY / height) / scale;
    
    this.setState({ 
      translate: { 
        x: clamp(x + deltaX, minTranslation, maxTranslation),
        y: clamp(y + deltaY, minTranslation, maxTranslation),
      },
    });

  }

  startDrag = () => {
    this.setState({ isDragging: true });
  }

  endDrag = () => {
    this.setState({ isDragging: false });
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
          onPointerMove={this.handlePointerMove}
          onPointerDown={this.startDrag}
          onPointerUp={this.endDrag}
          onPointerLeave={this.endDrag}
        >
          {this.renderVieportContent()}
        </Viewport>
      </Container>
    );
  }
}
