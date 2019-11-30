import React from 'react'
import './MapApp.css'
import BMap from 'BMap';
import {Row, Col, Icon, Checkbox} from 'antd'

class MapApp extends React.Component{

    ckOptions = ["已发生","已发生并验证","未发生"]


    render() {
        return(
            <div id="map-app" className="map-app">
                <Row type="flex" align="middle">
                    <Col span={1} >
                        <div className="user-container">
                            <div className="user-container-user-icon">
                                <Icon  type="user" className="user-container-user-icon-default"/>
                            </div>

                        </div>
                    </Col>
                    <Col push={10} span={4}>
                        <div className="cg-container">
                            <div className="cg-container-options">
                                <Checkbox.Group
                                    options={this.ckOptions}
                                    defaultValue={this.ckOptions}
                                    onChange={this.onChecked}/>
                            </div>
                        </div>
                    </Col>
                    <Col  span={5} push={14}>
                        <div className="search-container">
                            <h1>search-bar</h1>
                        </div>
                    </Col>
                </Row>

                <Row type="flex">
                    <Col span={4}>
                        <div className="info-container">
                            <h1>info-container</h1>
                        </div>
                    </Col>

                </Row>

                <Row>
                    <Col>
                        {/*底部多媒体信息展示区*/}
                        <div className="bottom-container"></div>
                    </Col>
                </Row>
                <div id="map-container" className="map-container"/>
            </div>
        )
    }


    onChecked(checked){
        console.log(checked);
    }

    onMapClick(event){
        console.log(event.type, event.target, event.point, event.pixel, event.overlay);
    };



    componentDidMount() {
        let map = new BMap.Map('map-container',
            {enableMapClick:false// 关闭默认点击事件
            });
        let cent = new BMap.Point(116.404, 39.915);
        map.centerAndZoom(cent,15);
        map.enableScrollWheelZoom();
        map.addControl(new BMap.MapTypeControl(
            {   anchor:3,
                offset: new BMap.Size(20, 20),
                // mapTypes: [2,2],
            }));
        map.addControl(new BMap.ScaleControl());
        // map.addControl(new BMap.NavigationControl({type:1}))
        map.addEventListener('click',this.onMapClick);
    }
}

export default MapApp

