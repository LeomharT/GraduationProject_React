import { LeftOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';


interface DetailInfoProps extends RouteComponentProps
{

}

class HouseDetailInfo extends Component<DetailInfoProps, {}>
{
    componentDidMount()
    {
        console.log(this.props.match.params);
    }
    render()
    {
        const { history } = this.props;
        return (
            <div className='HouseDetailInfo'>

                <Button
                    type='link'
                    icon={<LeftOutlined />}
                    onClick={() =>
                    {
                        history.go(-1);
                    }} />
                {this.props.location.pathname}
            </div>
        );
    }
}



export default withRouter(HouseDetailInfo);
