import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import styled from 'styled-components';
import '../../assets/scss/Home.scss';
import Navigate from './Navigate';
import SearchBar from './SearchBar';


const Wrapper = styled.div`
display: flex;
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
            <Wrapper>
                <div className="HomeEntry" >
                    <Navigate />
                    <SearchBar />
                </div>
            </Wrapper>
        );
    }
}


export default withRouter(Home);
