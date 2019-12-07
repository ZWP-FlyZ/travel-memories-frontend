import React from 'react'
import './MapApp.css'
import BMap from 'BMap';
import LogInComponent from './component/LogInComponent';
import InfoBoxComponent from './component/InfoBoxComponent'
import {message,Row, Col, Checkbox, Avatar,Input,Select,Drawer} from 'antd'
import Search from "antd/es/input/Search";
import Axios from 'axios'

class MapApp extends React.Component{

    ckOptions = ["已发生","已发生并验证","未发生"]
    myGeo = new BMap.Geocoder();
    constructor(props, context) {
        super(props, context);
        // this.onLoginSuccess = this.onLoginSuccess.bind(this);
        // 设置通信版本号
        Axios.defaults.headers['c-version']='1.0';
    }

    // 组件状态
    state={
        // 登录相关状态
        loginVisible:false,// 显示登录窗口
        loginDefaultIcon:'user',
        loginDefaultM:'',
        hasLogin:false,//true 已经登录，false还未登录
        user:null,// 用户信息

        //信息框相关状态
        infoBoxTitle:'EMPTY',
        infoBoxVisible:false,
        infoBoxType:'',
        infoBoxData:{}

    }

    // checkbox筛选回调
    onChecked(checked){
        console.log(checked);
    }

    // 点击用户头像回调
    onClickUser =e=>{
        console.debug("onClickUser login=",this.state.hasLogin)
        if(this.state.hasLogin){
            // 已经登录
            if(this.state.infoBoxVisible) return ;
            console.debug("user has login")
            this.setState({
                infoBoxTitle:'用户信息',
                infoBoxVisible:true,
                infoBoxType:'user_info',
                infoBoxData:this.state.user})

        }else{
            // 未登录
            this.setState({loginVisible:true})
            console.debug("user try to login")
        }
    }
    // 登录成功后处理
    onLoginSuccess = userinfo=>{
        console.log('user login success!',userinfo)
        let c = userinfo.username.charAt(0).toUpperCase();
        message.success("登录成功！")
        this.setState({loginVisible:false,
            hasLogin:true,
            user:userinfo,
            loginDefaultIcon:null,
            });
        this.setState({loginDefaultM:c})
    }
    // 登录取消处理
    onLoginCancel = ()=>{
        console.log('user login canceled!')
        this.setState({loginVisible:false,hasLogin:false})
    }

    // 登出成功后回调
    onLogoutSuccess = () =>{
        message.success("登出成功！")
        this.setState({
            hasLogin:false,
            user:null,
            loginDefaultIcon:'user',
            loginDefaultM:'',
            infoBoxTitle:'EMPTY',
            infoBoxVisible:false,
            infoBoxType:'',
            infoBoxData:{}})
    }

    //单击地图事件
    onClickMap = event=>{
        console.log(event.type, event.target, event.point, event.pixel, event.overlay);
        // var infoWindow = new BMap.InfoWindow(" <div> <Button>I</Button></div> ", {width:300,height: 300});  // 创建信息窗口对象
        // this.map.openInfoWindow(infoWindow, event.point);
    }

    // 双击地图事件
    onDoubleClickMap = event=>{
        console.log(event.type, event.target, event.point, event.pixel, event.overlay);
    }

    // 开启添加事件点信息框
    onRightClickMap = event=>{
        // console.log(event.type, event.target, event.point, event.pixel, event.overlay);
        if(this.state.infoBoxVisible) return ;
        this.myGeo.getLocation(event.point,res=>{
            console.log('geo',res);
            let data = {
                lng:event.point.lng,
                lat:event.point.lat,
                title:'',
                address:''
            }
            if(res){
                data.title = res.address;
                data.address = res.address;
            }
            this.setState({
                infoBoxTitle:'创建事件点',
                infoBoxVisible:true,
                infoBoxType:'add_epoint',
                infoBoxData:data})
            this.pointToAdd = new BMap.Marker(event.point);
            this.map.addOverlay(this.pointToAdd);
            this.pointToAdd.setAnimation(2); //跳动的动画
        });
        this.map.panTo(event.point);
    }

    // 双击右键地图事件
    onRightDoubleClickMap = event=>{
    console.log(event.type, event.target, event.point, event.pixel, event.overlay);
}

    childSelf = self=>{
        this.$infobox = self;
    }

    // 点击关闭消息box回调
    onCloseInfoBox = e => {
        this.setState({infoBoxVisible:false})
        this.$infobox.closeInfoBox();
        if(!!this.pointToAdd){
            this.map.removeOverlay(this.pointToAdd);
        }
    }
    // 当InfoBox准备就绪时，更新内部内容。
    onReadyInfoBox = visible =>{
        if(visible)
            this.$infobox.updateInfoBox();
    }

    onAddEPointSuccess = e=>{
        message.success("添加事件点成功！");
        if(!!this.pointToAdd){
            this.map.removeOverlay(this.pointToAdd);
        }
        this.setState({
            infoBoxTitle:'EMPTY',
            infoBoxVisible:false,
            infoBoxType:'',
            infoBoxData:{}})
    }

    componentDidMount() {
        let map = new BMap.Map('map-container',
            {
                enableMapClick:false,// 关闭默认点击事件
            });
        let cent = new BMap.Point(116.404, 39.915);
        map.centerAndZoom(cent,15);
        map.enableScrollWheelZoom();
        // map.disableDoubleClickZoom();
        map.addControl(new BMap.MapTypeControl(
            {   anchor:3,
                offset: new BMap.Size(20, 20),
                // mapTypes: [2,2],
            }));
        map.addControl(new BMap.ScaleControl());
        // map.addControl(new BMap.NavigationControl({type:1}))
        map.addEventListener('click',this.onClickMap);
        map.addEventListener('dblclick',this.onDoubleClickMap);
        map.addEventListener('rightclick',this.onRightClickMap);
        map.addEventListener('rightdblclick',this.onRightDoubleClickMap);
        this.map = map;
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
                        <Drawer
                                title={this.state.infoBoxTitle}
                                placement="left"
                                closable={true}
                                onClose={this.onCloseInfoBox}
                                afterVisibleChange={this.onReadyInfoBox}
                                visible={this.state.infoBoxVisible}
                                mask={false}
                                getContainer={false}
                                width={368}
                                destroyOnClose={true}
                                style={{ position: 'absolute',
                                    height:"78vh"}}>
                            <InfoBoxComponent
                                type={this.state.infoBoxType}
                                data={this.state.infoBoxData}
                                child={this.childSelf}
                                onLogoutSuccess={this.onLogoutSuccess}
                                onAddEPointSuccess={this.onAddEPointSuccess}
                                />
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

