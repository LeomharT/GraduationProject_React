import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';

class JourneyDetail extends Component<RouteComponentProps, {}>
{
    componentDidMount()
    {
        console.log(this.props.location.state);
    }
    render()
    {
        return (
            <div className='JourneyDetail'>

            </div>
        );
    }
}


export default withRouter(JourneyDetail);
