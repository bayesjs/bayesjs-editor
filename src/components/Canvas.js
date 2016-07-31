import React from 'react';
import { StyleSheet, css } from 'aphrodite';
import Node from './Node';

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    display: 'flex',
    background: '#ccc',
    overflow: 'auto',
  },
  container: {
    flexShrink: 0,
    margin: 'auto',
  },
  canvas: {
    border: 'solid 1px #333',
    backgroundColor: '#fcfcfc',
    boxShadow: '0px 0px 20px #333',
    margin: 10,
  },
});

const Canvas = () => (
  <div className={css(styles.scroll)}>
    <div className={css(styles.container)}>
      <svg
        className={css(styles.canvas)}
        height="400"
        width="600"
      >
        <Node x="70" y="50" />
        <Node x="270" y="80" />
        <Node x="200" y="230" />
      </svg>
    </div>
  </div>
);

export default Canvas;
