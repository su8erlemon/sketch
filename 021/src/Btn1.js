import React from 'react';
import PropTypes from 'prop-types';

class Motion1 extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isClose:false,
        }
    }

    componentDidMount(){

    }

    render() {
        return (
            <div className="borderBtn">
                <div className="borderBtn--text">{this.props.text}</div>
                <div className="borderBtn--fill"/>
                <div className="borderBtn--fillText">{this.props.text}</div>
            </div>
        );
    }
}

const PROP_TYPES = {
    text:PropTypes.string
};

Motion1.protoType = PROP_TYPES;

export default Motion1;

