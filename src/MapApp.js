import React from 'react'
import './MapApp.css'
import BMap from 'BMap';
import LogInComponent from './component/LogInComponent';
import {message,Row, Col, Checkbox, Avatar,Input,Select,Drawer} from 'antd'
import Search from "antd/es/input/Search";

class MapApp extends React.Component{

    ckOptions = ["已发生","已发生并验证","未发生"]

    constructor(props, context) {
        super(props, context);
        // this.onLoginSuccess = this.onLoginSuccess.bind(this);

    }

    // 组件状态
    state={
        // 登录相关状态
        loginVisible:false,// 显示登录窗口
        loginDefaultIcon:'user',
        loginDefaultM:"",
        hasLogin:false,//true 已经登录，false还未登录
        user:null// 用户信息
    }


    // checkbox筛选回调
    onChecked(checked){
        console.log(checked);
    }

    // 地图单击回调
    onMapClick(event){
        console.log(event.type, event.target, event.point, event.pixel, event.overlay);
    };

    // 点击用户头像回调
    onClickUser =e=>{
        console.debug("onClickUser login=",this.state.hasLogin)
        if(this.state.hasLogin){
            // 已经登录
            console.debug("user has login")
        }else{
            // 未登录
            this.setState({loginVisible:true})
            console.debug("user try to login")
        }
    }
    // 登录成功后处理
    onLoginSuccess = userinfo=>{
        console.log('user login success!',userinfo)
        message.success("登录成功！")
        this.setState({loginVisible:false,
                            hasLogin:true,
                            user:userinfo,
            loginDefaultIcon:'',
            loginDefaultM:userinfo.username.charAt(0).toUpperCase()})
    }
    // 登录取消处理
    onLoginCancel = ()=>{
        console.log('user login canceled!')
        this.setState({loginVisible:false,hasLogin:false})
    }


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

    render() {
        return(
            <div id="map-app" className="map-app">
                <Row type="flex" align="middle">
                    <Col span={8} >
                        <div className="user-container">
                            <Avatar className="user-container-user-icon"
                                    size={60}
                                    icon={this.state.loginDefaultIcon}
                                    onClick={this.onClickUser}>{this.state.loginDefaultM}</Avatar>
                        </div>
                    </Col>
                    <Col span={8}>
                        <Row type="flex" justify="center">
                            <div className="cg-container">
                                <Checkbox.Group size="large"
                                                options={this.ckOptions}
                                                defaultValue={this.ckOptions}
                                                onChange={this.onChecked}/>
                            </div>
                        </Row>

                    </Col>
                    <Col  span={8}>
                        <div className="search-container">
                            <Input.Group compact>
                                <Select defaultValue={"地图"} style={{width:80}}>
                                    <Select.Option value={"地图"}>地图</Select.Option>
                                    <Select.Option value={"事件点"}>事件点</Select.Option>
                                </Select>
                                <Search placeholder="input search text"
                                        onSearch={value => console.log(value)}
                                        style={{ width: 300 }}/>
                            </Input.Group>
                        </div>
                    </Col>
                </Row>

                <Row type="flex">
                    <Col span={5}>
                        <Drawer title="Basic Drawer"
                                placement="left"
                                closable={true}
                                onClose={null}
                                visible={true}
                                mask={false}
                                getContainer={false}
                                width={300}
                                style={{ position: 'absolute',
                                    height:"78vh"}}>
                        </Drawer>
                    </Col>

                </Row>

                <Row>
                    <Col>
                        {/*底部多媒体信息展示区*/}
                        <div className="bottom-container"></div>
                    </Col>
                </Row>
                <div id="map-container" className="map-container"/>

                <div>
                    <LogInComponent visible = {this.state.loginVisible}
                                    loginSuccess={this.onLoginSuccess}
                                    loginCancel={this.onLoginCancel} />
                </div>

            </div>
        )
    }


}

export default MapApp

