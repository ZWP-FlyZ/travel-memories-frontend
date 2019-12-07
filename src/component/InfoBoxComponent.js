import React from 'react'
import {Input,Row,Col,Button,Form,DatePicker,Radio,message} from 'antd'
import locale from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment';
import Axios from 'axios'

// 信息框内容组件
class InfoBoxComponent extends React.Component{

    constructor(props, context) {
        super(props, context);
        let data = this.props.data;
        let m = moment();
        this.state = {
            //状态
            addEPointLoading:false,
            logoutLoading:false,
            // 事件点信息
            epTitle:data.title,
            epAddr:data.address,
            epLng:data.lng,
            epLat:data.lat,
            epTime:m.valueOf(),
            epTimeMoment:m,
            epType:1
        }
    }


    // 父组件关闭时
    closeInfoBox =()=>{
        console.debug('infobox closed')
    }

    // 更新内容
    updateInfoBox =()=>{
        let data = this.props.data;
        let m = moment();
        this.setState({
            // 事件点信息
            epTitle:data.title,
            epAddr:data.address,
            epLng:data.lng,
            epLat:data.lat,
            epTime:m.valueOf(),
            epTimeMoment:m,
            epType:1
        });
    }

    onLogout = e=>{
        if(this.props.onLogoutSuccess != null){
            this.props.onLogoutSuccess();
        }
    }

    onAddEPointClick =e=>{
        this.setState({addEPointLoading:true})
       const  pr = {
            epTitle:this.state.epTitle,
            epAddr:this.state.epAddr,
            epLng:this.state.epLng,
            epLat:this.state.epLat,
            epTime:this.state.epTime,
            epType:this.state.epType
        };
        console.log(pr);
        Axios({
            url:'/api/epoint/create',
            method:'post',
            params:{
                "epTitle":this.state.epTitle,
                "epAddr":this.state.epAddr,
                "epLng":this.state.epLng,
                "epLat":this.state.epLat,
                "epTime":this.state.epTime,
                "epType":this.state.epType,
            },
        }).then(respone=>{
            this.setState({addEPointLoading:false});
            console.log(respone);
            // 成功回调
            const res = respone.data;
            if(res.code === 1000){
                //
                this.props.onAddEPointSuccess(res.data);
            }else{
                message.error("信息不符号要求！");
            }

        }).catch(e=>{
            this.setState({addEPointLoading:false});
            if(Axios.isCancel(e)){
                console.log("创建取消");
            }else{
                message.error("未知错误！");
                console.log(e);
            }
        })

    }

    componentDidMount() {
        this.props.child(this);
    }

    render() {
        const boxType = this.props.type;
        const data = this.props.data;
        if (boxType === '')
            return (<div>EMPTY</div>);
        else if (boxType === 'user_info')
            return this.userinfo(data);
        else if (boxType === 'add_epoint')
            return this.addEpoint(data);
        else if (boxType === 'edit_epoint')
            return this.editEpint();
    }

    userinfo(user){
        return (
            <div style={{width:'100%',height:'100%'}}>
                <Row gutter={[16,32]}>
                    <Col >
                        <Input addonBefore="用户ID" defaultValue={user.uid} disabled={true} />
                    </Col>
                </Row>
                <Row gutter={[16,32]}>
                    <Col >
                        <Input addonBefore="用户名" defaultValue={user.username} disabled={true}/>
                    </Col>
                </Row>
                <Row gutter={[16,32]}>
                    <Col >
                        <Button style={{width:'100%'}}
                                type="danger"
                                onClick={this.onLogout}
                                loading={this.state.logoutLoading}
                        >登出</Button>
                    </Col>
                </Row>
            </div>);
    }

    addEpoint(data){
        return (
            <div style={{width:'100%',height:'100%'}}>
                <Row gutter={[16,32]}>
                    <Col >
                        <Input addonBefore="标题"
                               defaultValue={data.address}
                               onChange={e => {this.setState({epTitle:e.target.value})}}
                        />
                    </Col>
                </Row>
                <Row gutter={[16,32]}>
                    <Col >
                        <Input addonBefore="地址"
                               defaultValue={data.address}
                               onChange={e => {this.setState({epAddr:e.target.value})}}
                        />
                    </Col>
                </Row>
                <Row gutter={[3,32]}>
                    <Col span={12}>
                        <Input addonBefore="经度" defaultValue={data.lng.toFixed(7)} disabled={true}/>
                    </Col>
                    <Col span={12}>
                        <Input addonBefore="纬度" defaultValue={data.lat.toFixed(7)} disabled={true} />
                    </Col>
                </Row>

                <Row gutter={[16,32]}>
                    <Col >
                        <DatePicker
                                    showTime placeholder="事件发生时间"
                                    onOk={e=>{this.setState({epTime:e.valueOf(),epTimeMoment:e})}}
                                    onChange={e=>{this.setState({epTime:e.valueOf(),epTimeMoment:e})}}
                                    style={{width:'100%'}}
                                    locale={locale}
                                    defaultValue={this.state.epTimeMoment}
                        />
                    </Col>
                </Row>

                <Row gutter={[16,32]}>
                    <Col >
                        <Radio.Group onChange={e=>{this.setState({epType:e.target.value})}}
                                     value={this.state.epType}>
                            <Radio value={1}>已完成</Radio>
                            <Radio value={2}>已完成并验证</Radio>
                            <Radio value={0}>未完成</Radio>
                        </Radio.Group>
                    </Col>
                </Row>


                <Row gutter={[16,32]}>
                    <Col >
                        <Button style={{width:'100%'}}
                                type="primary"
                                onClick={this.onAddEPointClick}
                                loading={this.state.addEPointLoading}
                        >提交</Button>
                    </Col>
                </Row>
            </div>
        );
    }

}


export default InfoBoxComponent;






