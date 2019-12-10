import React from 'react'
import './MapApp.css'
import BMap from 'BMap';
import LogInComponent from './component/LogInComponent';
import InfoBoxComponent from './component/InfoBoxComponent'
import {message, Row, Col, Checkbox, Avatar, Input,Icon,
        Select, Drawer, Radio,Popover,Button} from 'antd'
import Search from "antd/es/input/Search";
import Axios from 'axios'
import UserInfoBoxComponent from "./component/UserInfoBoxComponent";

class MapApp extends React.Component{


    // 地址逆解析工具
    myGeo = new BMap.Geocoder();
    // 定位工具
    location = new BMap.Geolocation();
    constructor(props, context) {
        super(props, context);
        // this.onLoginSuccess = this.onLoginSuccess.bind(this);
        // 设置通信版本号
        Axios.defaults.headers['c-version']='1.0';
        const x = 20;
        this.starEmpty = new BMap.Icon("/star-empty.png",
            new BMap.Size(x+5,x+5));
        this.starEmpty.setImageSize(new BMap.Size(x+5,x+5));
        this.starFill = new BMap.Icon("/star-fill.png",
            new BMap.Size(x,x));
        this.starFill.setImageSize(new BMap.Size(x,x));

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
        infoBoxData:{},

        //用户信息框相关状态
        userInfoBoxTitle:'EMPTY',
        userInfoBoxVisible:false,
        userInfoBoxType:'',
        userInfoBoxData:{},


        // checkbox相关状态
        checked:[0,1,2],
    }

    // 事件点
    ePoints={
        drawPoints:[],// 需要被添加到地图的事件点
        remPoints:[]// 其余事件点
    }


    choseEPoints =checked =>{
        let newdraw = [];
        let newrem=[];
        this.ePoints.drawPoints.forEach((p,idx,arr)=>{
            if(checked.indexOf(p.epType)>=0){
                newdraw.push(p);
            }else
                newrem.push(p);
        })
        this.ePoints.remPoints.forEach((p,idx,arr)=>{
            if(checked.indexOf(p.epType)>=0){
                newdraw.push(p);
            }else
                newrem.push(p);
        })
        this.ePoints.drawPoints=newdraw;
        this.ePoints.remPoints=newrem;
    }
    // checkbox筛选回调
    onChecked =checked=>{
        console.log(checked);
        this.setState({checked:checked},()=>{
            this.choseEPoints(checked);
            this.reDrawEPoints();
        })
    }
    // 点击用户头像回调
    onClickUser =e=>{
        console.debug("onClickUser login=",this.state.hasLogin)
        if(this.state.hasLogin){
            // 已经登录
            if(this.state.infoBoxVisible||(
                this.state.userInfoBoxVisible&&
                this.state.userInfoBoxType !== 'user_info')) return ;
            console.debug("user has login")
            this.setState({
                userInfoBoxTitle:'用户信息',
                userInfoBoxVisible:true,
                userInfoBoxType:'user_info',
                userInfoBoxData:this.state.user},
                ()=>{this.$userInfoBox.updateInfoBox();})
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
        this.getAllEPoints();
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
            userInfoBoxTitle:'EMPTY',
            userInfoBoxVisible:false,
            userInfoBoxType:'',
            userInfoBoxData:{}})
        this.ePoints={
            drawPoints:[],// 需要被添加到地图的事件点
            remPoints:[]// 其余事件点
        };
        this.map.clearOverlays();
    }
    //单击地图事件
    onClickMap = event=>{
        // console.log(event.type, event.target, event.point, event.pixel, event.overlay);
        // var infoWindow = new BMap.InfoWindow(" <div> <Button>I</Button></div> ", {width:300,height: 300});  // 创建信息窗口对象
        // this.map.openInfoWindow(infoWindow, event.point);
        // this.setState({
        //     userInfoBoxTitle:'EMPTY',
        //     userInfoBoxVisible:true,
        //     userInfoBoxType:'',
        //     userInfoBoxData:{},})


    }
    // 双击地图事件
    onDoubleClickMap = event=>{
        console.log(event.type, event.target, event.point, event.pixel, event.overlay);
    }
    // 开启添加事件点信息框
    onRightClickMap = event=>{
        // console.log(event.type, event.target, event.point, event.pixel, event.overlay);
        if(!this.state.hasLogin){
            message.error("登录之后添加事件点！");
            return ;
        }
        if( this.state.userInfoBoxVisible||
            (this.state.infoBoxVisible
            &&this.state.infoBoxType !== 'add_epoint')) return ;
        if(!!this.pointToAdd){
            this.map.removeOverlay(this.pointToAdd);
        }
        this.myGeo.getLocation(event.point,res=>{
            console.log('geo',res);
            let data = {
                lng:event.point.lng,
                lat:event.point.lat,
                title:'',
                address:''
            }
            if(res){
                data.address = res.address;
                data.title = res.address;
                const surds = res.surroundingPois;
                if(surds.length>0)
                    data.title = surds[0].title;

            }
            this.setState({
                infoBoxTitle:'创建事件点',
                infoBoxVisible:true,
                infoBoxType:'add_epoint',
                infoBoxData:data},()=>{this.$infobox.updateInfoBox();})
            this.pointToAdd = new BMap.Marker(event.point);
            this.map.addOverlay(this.pointToAdd);
            this.pointToAdd.setAnimation(window.BMAP_ANIMATION_BOUNCE); //跳动的动画
        });
        this.map.panTo(event.point);
    }
    // 双击右键地图事件
    onRightDoubleClickMap = event=>{
    // console.log(event.type, event.target, event.point, event.pixel, event.overlay);
    }
    // 点击关闭消息box回调
    onCloseInfoBox = e => {
        this.setState({infoBoxVisible:false})
        this.$infobox.closeInfoBox();
        if(!!this.pointToAdd){
            this.map.removeOverlay(this.pointToAdd);
        }
        if(!!this.markToEdit){
            this.markToEdit.setAnimation(null);
        }
    }

    onCloseUserInfoBox=e=>{
        this.setState({userInfoBoxVisible:false})
        this.$userInfoBox.closeInfoBox();
    }

    // 当InfoBox准备就绪时，更新内部内容。
    onReadyInfoBox = visible =>{
        // if(visible)
        //     this.$infobox.updateInfoBox();
    }
    onReadyUserInfoBox = visible =>{
        // if(visible)
        //     this.$userInfoBox.updateInfoBox();
    }
    // 添加事件点完成回调
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
        this.getAllEPoints();
    }

    //从服务端获取所有事件点
    getAllEPoints =()=>{
        Axios({
            url:'/api/epoint/getall',
            method:'get',
        }).then(response=>{
            console.debug(response);
            // 成功回调
            const res = response.data;
            if(res.code === 1000){
                this.ePoints.drawPoints=res.data;
                this.ePoints.remPoints=[];
            }else{
                message.error("获取用户事件点失败")
            }
        }).then(e=>{
            this.choseEPoints(this.state.checked);
            this.reDrawEPoints();
        }).catch(e=>{
            message.error("获取用户事件点失败")
        })
    }
    // 事件点点击回调
    onEPointClick = (e)=>{
        console.debug('点击事件点',e.target);
        if(this.state.userInfoBoxVisible||
            (this.state.infoBoxVisible
            &&this.state.infoBoxType !== 'edit_epoint')) return ;
        // setAnimation(window.BMAP_ANIMATION_BOUNCE);
        if(!!this.markToEdit){
            this.markToEdit.setAnimation(null);
        }

        this.setState({
            infoBoxTitle:'事件点详情',
            infoBoxVisible:true,
            infoBoxType:'edit_epoint',
            infoBoxData:e.target.epoint},
            ()=>{this.$infobox.updateInfoBox();})
        e.target.setAnimation(window.BMAP_ANIMATION_BOUNCE);
        this.map.panTo(e.point);
        this.markToEdit = e.target;
    }
    // 重画所有事件点
    reDrawEPoints = () =>{

        this.map.clearOverlays();
        this.ePoints.drawPoints.forEach((point,idx,arr)=>{
            let bp = new BMap.Point(point.epLng, point.epLat);
            let mk = null;
            if(point.epType===0)
                mk = new BMap.Marker(bp,{icon:this.starEmpty});
            else
                mk = new BMap.Marker(bp,{icon:this.starFill});
            mk.epoint = point;
            mk.addEventListener('click',this.onEPointClick);
            this.map.addOverlay(mk);
        })
    }

    onMapTypeChange = e=>{
        const v = e.target.value;
        if(v===0)
            this.map.setMapType(window.BMAP_NORMAL_MAP)
        else if(v===1)
            this.map.setMapType(window.BMAP_SATELLITE_MAP)
        else
            this.map.setMapType(window.BMAP_HYBRID_MAP)
    }
    //删除某个事件点后回调
    onDeleteEpointSuccess =epoint=>{
        message.success("删除事件点成功！");
        this.setState({infoBoxVisible:false},()=>{
            const points = this.ePoints;
            points.drawPoints.forEach((item,idx,arr)=>{
                if(item.epId === epoint.epId)
                    arr.splice(idx,1);
            })
            points.remPoints.forEach((item,idx,arr)=>{
                if(item.epId === epoint.epId)
                    arr.splice(idx,1);
            })
            this.reDrawEPoints();
        });
    }

    // 当更新某个事件点属性成功后回调
    onUpdateEpointAtrrSuccess = epoint=>{
        this.choseEPoints(this.state.checked);
        this.reDrawEPoints();
    }

    doLocation = ()=>{
        this.location.getCurrentPosition(e=>{
            console.debug('location',e);
            if(e!=null){
                this.map.panTo(e.point);
            }
        })
    }


    componentDidMount() {
        let map = new BMap.Map('map-container',
            {
                enableMapClick:false,// 关闭默认点击事件
            });
        // map.disableDoubleClickZoom();
        // map.addControl(new BMap.MapTypeControl(
        //     {   anchor:window.BMAP_ANCHOR_TOP_LEFT,
        //         offset: new BMap.Size(20, 20),
        //         // mapTypes: [2,2],
        //     }));

        let cent = new BMap.Point(116.404, 39.915);
        map.centerAndZoom(cent,15);
        map.enableScrollWheelZoom();
        map.addControl(new BMap.ScaleControl());
        // map.addControl(new BMap.NavigationControl({type:1}))
        map.addEventListener('click',this.onClickMap);
        map.addEventListener('dblclick',this.onDoubleClickMap);
        map.addEventListener('rightclick',this.onRightClickMap);
        map.addEventListener('rightdblclick',this.onRightDoubleClickMap);
        this.map = map;

        // 定位
        this.doLocation();

    }

    render() {

        const checkBox = (
            <div className="cg-container">
                <Checkbox.Group
                                disabled={this.state.infoBoxVisible}
                                style={{width:'100%'}}
                                defaultValue={this.state.checked}
                                onChange={this.onChecked}>

                    <Row gutter={[0,10]} align="middle" >
                        <Col span={20}>
                            <Checkbox value={1}>已完成</Checkbox>
                        </Col>
                        <Col span={4}>
                            <img src={'/star-fill.png'}
                                 alt={'star-fill.png'}
                                 height={'20px'} width={'20px'}/>
                        </Col>
                    </Row>

                    <Row gutter={[0,10]} align="middle" >
                        <Col span={20}>
                            <Checkbox value={0}>未完成</Checkbox>
                        </Col>
                        <Col span={4}>
                            <img src={'/star-empty.png'}
                                 alt={'star-empty.png'}
                                 height={'20px'} width={'20px'}/>
                        </Col>
                    </Row>
                    {/*<Row gutter={[0,10]} align="middle" >*/}
                    {/*    <Col span={20}>*/}
                    {/*        <Checkbox value={2}>已完成并验证</Checkbox>*/}
                    {/*    </Col>*/}
                    {/*    <Col span={4}>*/}
                    {/*        <img src={'/star-fill.png'}*/}
                    {/*             alt={'star-fill.png'}*/}
                    {/*             height={'20px'} width={'20px'}/>*/}
                    {/*    </Col>*/}
                    {/*</Row>*/}
                </Checkbox.Group>
            </div>);

        return(
            <div id="map-app" className="map-app">
                <Row type="flex" align="middle">
                    <Col span={12} >
                        <Row type="flex" align="middle">
                            <Col >
                                <div className="user-container">
                                    <Avatar className="user-container-user-icon"
                                            size={60}
                                            icon={this.state.loginDefaultIcon}
                                            onClick={this.onClickUser}>{this.state.loginDefaultM}</Avatar>
                                </div>
                            </Col>
                            <Col >
                            </Col>
                        </Row>
                    </Col>
                    <Col  span={12}>
                        <Row type="flex" align="middle" justify="end" >
                            <Col>
                                <div className="eptype-container">
                                    <Popover placement={"bottom"}
                                             content={checkBox}>
                                        <Button size={'large'}
                                                style={{width:'100%'}}>事件点类型</Button>
                                    </Popover>
                                </div>
                            </Col>

                            <Col>
                                <div className="search-container">
                                    <Input.Group compact size={'large'}>
                                        <Select defaultValue={"地图"} style={{width:'25%'}}
                                                size={'large'} disabled={true}>
                                            <Select.Option value={"地图"}>地图</Select.Option>
                                            <Select.Option value={"事件点"}>事件点</Select.Option>
                                        </Select>
                                        <Search placeholder="未实现功能" disabled={true}
                                                onSearch={value => console.log(value)}
                                                style={{width:'75%'}}/>
                                    </Input.Group>
                                </div>
                            </Col>
                        </Row>

                    </Col>
                </Row>

                <Row type="flex">
                    <Col span={5}>
                        {/*用户登录，登出，用户信息处理相关弹出框*/}
                        <Drawer
                            title={this.state.userInfoBoxTitle}
                            placement="left"
                            closable={true}
                            onClose={this.onCloseUserInfoBox}
                            afterVisibleChange={this.onReadyUserInfoBox}
                            visible={this.state.userInfoBoxVisible}
                            mask={false}
                            getContainer={false}
                            width={300}
                            destroyOnClose={true}
                            style={{ position: 'relative',
                                height:"50vh"}}>
                            <UserInfoBoxComponent
                                type={this.state.userInfoBoxType}
                                data={this.state.userInfoBoxData}
                                child={self=>{this.$userInfoBox = self;}}
                                onLogoutSuccess={this.onLogoutSuccess}
                            />
                        </Drawer>
                        {/*事件点相关弹出框*/}
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
                                    height:"85vh"}}>
                            <InfoBoxComponent
                                type={this.state.infoBoxType}
                                data={this.state.infoBoxData}
                                child={self=>{this.$infobox = self;}}
                                onLogoutSuccess={this.onLogoutSuccess}
                                onAddEPointSuccess={this.onAddEPointSuccess}
                                onDeleteSuccess={this.onDeleteEpointSuccess}
                                onUpdateAtrrSuccess={this.onUpdateEpointAtrrSuccess}
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


                <div className={'location-container'}>
                    <Button shape={'circle'}
                            size={'lager'}
                            style={{width:'30px',height:'30px'}}
                            onClick={this.doLocation}>
                        <Icon type="close-circle" style={{fontSize:'30px',color:'black'}} />
                    </Button>
                </div>

                <div className={'map-type-container'}>
                    <Radio.Group defaultValue={0}
                                 buttonStyle="solid"
                                 onChange={this.onMapTypeChange}>
                        <Radio.Button value={0}>地图</Radio.Button>
                        <Radio.Button value={1}>卫星</Radio.Button>
                        <Radio.Button value={2}>混合</Radio.Button>
                    </Radio.Group>
                </div>

            </div>
        )
    }

}

export default MapApp

