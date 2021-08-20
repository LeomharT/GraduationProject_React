import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';



interface DetailInfoProps extends RouteComponentProps
{

}

class DetailInfo extends Component<DetailInfoProps, {}>
{
    componentDidMount()
    {
        console.log(this.props.history);
    }
    render()
    {
        return (
            <div style={{ height: "100px", width: "100px", background: "red" }}>
                {this.props.location.pathname}
            </div>
        );
    }
}



export default withRouter(DetailInfo);
