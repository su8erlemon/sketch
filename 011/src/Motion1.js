import React from 'react';

class Motion1 extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            text:[],
            isClose:false,
        }
    }

    componentDidMount(){
        let text = [];
        $(".motion-1 ul.dummy li").each(function (value) {
            console.log($(this))
            console.log($(this)[0].offsetTop)
            text.push({
                x: $(this)[0].offsetLeft,
                y: $(this)[0].offsetTop,
                width: $(this).width(),
                height: $(this).height(),
                word: $(this)[0].innerHTML,
            });
        });
        this.setState({text});

        setTimeout(()=>{
            this.setState({isClose:true});
        },3000)
    }

    render() {

        const parentProps = Object.assign({}, this.props);
        for (let key in PROP_TYPES) {
            if (parentProps.hasOwnProperty(key)) {
                delete parentProps[key];
            }
        }

        return (
            <div {...parentProps}
                className="motion-1">

                <ul className="text-2">
                    {this.state.text.map((value,index)=>{
                        const delay = (this.state.isClose?0.2+index*0.02:(index*0.1 + (index%3) * 0.1 ));
                        const style = {
                            animation: 'transY 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) ' + (index * 0.1  + (index%3) * 0.1) + 's forwards,' +
                                        (this.state.isClose?'scale1':'scale0') + ' 0.8s cubic-bezier(0.19, 1, 0.22, 1) ' + delay + 's forwards',
                            left:value.x,
                            top:value.y,
                        };
                        return <li key={index} style={style} className={"init-transY "+(this.state.isClose?"init-scale1":"init-scale0")}>{value.word}</li>
                    })}
                </ul>

                <ul className="text-1">
                    {this.state.text.map((value,index)=>{
                        const delay = (this.state.isClose?index*0.02:(0.3+index*0.1 + (index%3) * 0.1 ));
                        const style = {
                            animation: 'transY 0.5s cubic-bezier(0.175, 0.885, 0.42, 1.175) ' + (0.3+index * 0.1  + (index%3) * 0.1) + 's forwards,' +
                                        (this.state.isClose?'scale1':'scale0') + ' '+(this.state.isClose?0.8:2.0)+'s cubic-bezier(0.19, 1, 0.22, 1) ' + delay + 's forwards',
                            left:value.x,
                            top:value.y,
                        };
                        return <li key={index} style={style} className={"init-transY "+(this.state.isClose?"init-scale1":"init-scale0")}>{value.word}</li>
                    })}
                </ul>

                <ul className="dummy">
                    <li>Lorem</li>
                    <li>ipsum</li>
                    <li>dolor</li>
                    <li>sit</li>
                    <li>amet</li>
                    <li>consectetur</li>
                    <li>adipiscing</li>
                    <li>elit</li>
                </ul>

            </div>
        );
    }
}

const PROP_TYPES = {
};

Motion1.protoType = PROP_TYPES;

export default Motion1;

