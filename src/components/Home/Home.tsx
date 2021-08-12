import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import styled from 'styled-components';
import '../../assets/scss/Home.scss';
import Navigate from './Navigate';
import Recommend from './Recommend';
import SearchBar from './SearchBar';

const HomeWrapper = styled.div`
display: flex;
flex-wrap: wrap;
justify-content: space-between;
align-items: center;
`;
interface HomeProps extends RouteComponentProps
{

}
class Home extends Component<HomeProps, {}>
{
    render()
    {
        return (
            <HomeWrapper>
                <div className="HomeEntry" >
                    <Navigate />
                    <SearchBar />
                </div>
                <Recommend />
            </HomeWrapper>
        );
    }
}
export default withRouter(Home);
