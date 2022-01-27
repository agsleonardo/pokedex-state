import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Button extends Component {
  render() {
    const { type, onClick, disabled, style } = this.props;
    return (
      <button onClick={onClick} disabled={disabled} style={style}>{ `${type.substring(0,1).toUpperCase()}${type.slice(1)}` }</button>
    )
  }
}

Button.propTypes = {
  type: PropTypes.string.isRequired
}