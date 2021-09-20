import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { CONST_HOST } from '../Common/VariableGlobal';

@observer
export default class SwitchRoom extends Component<{ showSwitchRoom: boolean, currRoomScenes: any[], GetSceneAsync: Function; }, {}>
{
    render()
    {
        return (
            <div
                className='SwitchRoom'
                style={{ bottom: this.props.showSwitchRoom ? '100px' : '-150px' }}
            >
                <ul>
                    {
                        this.props.currRoomScenes.map((r, index) =>
                        {
                            return (<li key={index}
                                onClick={() =>
                                {
                                    this.props.GetSceneAsync(r.hId, r.sceneId);
                                }}>
                                <img alt='imgs' src={`${CONST_HOST}/${r.url}`} />
                                {r.sceneName}
                            </li>
                            );
                        })
                    }
                </ul>
            </div>
        );
    }
}
