import React from 'react';
import PropTypes from 'prop-types';

class TextEffect extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isHover:false,
        }
    }

    componentDidMount(){

    }

    render() {

        console.log(this.state)

        let words = [];
        for( let i = 0; i < this.props.text.length; i++ ){
            const delay = (i*0.03);
            const style = {
                transitionDelay:delay+"s",
            };
            words.push(<span key={i} style={style}>{this.props.text[i]}</span>);
        }

        return (
            <div className={"textEffect"+ (this.props.act?" isAct":"")}
                 onMouseOver={()=>{this.setState({isHover:true })}}
                 onMouseOut ={()=>{this.setState({isHover:false})}}
            >
                <div className="textEffect--text">{words}</div>
            </div>
        );
    }
}

const PROP_TYPES = {
    text:PropTypes.string,
    act:PropTypes.bool,
};

TextEffect.protoType = PROP_TYPES;

export default TextEffect;

