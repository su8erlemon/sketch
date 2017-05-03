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
                width: $(this).width()+1,
                height: $(this).height(),
                word: $(this)[0].innerHTML,
            });
        });
        this.setState({text});

        setTimeout(()=>{
            // this.setState({isClose:true});
        },3000)
    }

    render() {
        const parentProps = Object.assign({}, this.props);
        for (let key in PROP_TYPES) {
            if (parentProps.hasOwnProperty(key)) {
                delete parentProps[key];
            }
        }

        console.log( this.state.isClose)

        // return(
        //     <div>
        //         <svg width="0" height="0">
        //             <defs>
        //                 <clipPath id="myClip">
        //                     <rect x="0" y="0" width="40" height="30"/>
        //                 </clipPath>
        //             </defs>
        //         </svg>
        //
        //         {/*<div className="tokens_clip">*/}
        //         {/*<div>*/}
        //             <svg width="100" height="100">
        //                 <text x="0" y="30px" className="aa" >Textaa</text>
        //             </svg>
        //         {/*</div>*/}
        //         {/*<div className="tokens_clip">Leee</div>*/}
        //
        //     </div>
        // )

        return (
            <div {...parentProps}
                className="motion-1">

                <svg width="0" height="0">
                    <defs>
                    {this.state.text.map((value,index)=>{
                        const delay = (this.state.isClose?index*0.02:(index*0.1  + (index%3) * 0.1 ));
                        const style = {
                            animation: (this.state.isClose?'scale1':'scale0') + ' 0.8s cubic-bezier(0.19, 1, 0.22, 1) ' + delay + 's forwards',
                        };
                        return <clipPath key={index} id={"clip-" + index}>
                            <rect className={this.state.isClose?"init-scale1":"init-scale0"} style={style} x={value.x} y={value.y} width={value.width+5*2+1} height={value.height+1}/>
                        </clipPath>
                    })}
                    {this.state.text.map((value,index)=>{
                        const delay = (this.state.isClose?index*0.02:(0.2+index*0.1  + (index%3) * 0.1));
                        const style = {
                            animation: (this.state.isClose?'scale1':'scale0') + ' 0.6s cubic-bezier(0.19, 1, 0.22, 1) ' + delay + 's forwards',
                        };
                        return <clipPath key={index} id={"clip2-" + index}>
                            <rect className={this.state.isClose?"init-scale1":"init-scale0"} style={style} x="-1" y="0" width={value.width+5*2+1} height={value.height+1}/>
                        </clipPath>
                    })}
                    </defs>
                </svg>

                <svg width="500" height="500" className="text-2">
                    {this.state.text.map((value,index)=>{
                        const style = {
                            animation: 'transY 1.0s cubic-bezier(0.19, 1, 0.22, 1) ' + (index * 0.1  + (index%3) * 0.1) + 's forwards',
                            clipPath:"url(#clip-" + index + ")",
                        };
                        return <g key={index} >
                            <rect x={value.x} y={value.y} style={style} width={value.width+10} height={value.height} className="init-transY"></rect>
                            <text x={value.x} y={value.y} style={style} className="init-transY">{value.word}</text>
                        </g>
                    })}
                </svg>

                {/*<ul className="text-1">*/}
                    {/*{this.state.text.map((value,index)=>{*/}
                        {/*const style = {*/}
                            {/*animation: 'transY 1.0s cubic-bezier(0.19, 1, 0.22, 1) ' + (0.2+index * 0.1  + (index%3) * 0.1) + 's',*/}
                            {/*animationFillMode: "forwards",*/}
                            {/*clipPath:"url(#clip2-" + index + ")",*/}
                        {/*};*/}
                        {/*return <li key={index} style={style} className="init-transY">{value.word}</li>*/}
                    {/*})}*/}
                {/*</ul>*/}

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

