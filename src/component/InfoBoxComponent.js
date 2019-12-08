import React from 'react'
import {Input,Row,Col,Button,Spin,DatePicker,Radio,message,Icon} from 'antd'
import locale from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment';
import Axios from 'axios'
import './InfoBoxComponent.css'

// 信息框内容组件
class InfoBoxComponent extends React.Component{

    displaystr =['none','block'];
    constructor(props, context) {
        super(props, context);
        let m = moment();
        this.state = {
            //状态
            addEPointLoading:false,
            logoutLoading:false,

            showEPointUpdateBtn:0,
            ePointUpdateLoading:false,
            waitingEPoingInfo:false,
            showEPTextInfoUpdateBtn:0,
            ePTextInfoUpdateLoading:false,
            waitingTextInfo:false,
            // 用户信息
            uid:0,
            username:'',
            // 事件点信息
            epTitle:'',
            epAddr:'',
            epLng:0.0,
            epLat:0.0,
            epTime:m.valueOf(),
            epTimeMoment:m,
            epType:1,
            epTiInfo:''
        }
    }


    // 父组件关闭时
    closeInfoBox =()=>{
        console.debug('infobox closed')
    }

    // 更新内容
    updateInfoBox =()=>{
        let data = this.props.data;
        if(this.props.type==='add_epoint'){
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
        }else if(this.props.type==='user_info'){
            this.setState({
                // 事件点信息
                uid:data.uid,
                username:data.username,
            });
        }else if(this.props.type==='edit_epoint'){
            console.debug(data);
            this.setState({
                // 事件点信息
                epTitle:data.epTitle,
                epAddr:data.epAddr,
                epLng:data.epLng,
                epLat:data.epLat,
                epTime:data.epTime,
                epTimeMoment:moment.unix(data.epTime/1000),
                epType:data.epType
            });
        }
    }

    onLogout = e=>{
        if(this.props.onLogoutSuccess != null){
            this.props.onLogoutSuccess();
        }
    }

    onAddEPointClick =e=>{
        this.setState({addEPointLoading:true})
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
        if (boxType === '')
            return (<div>EMPTY</div>);
        else if (boxType === 'user_info')
            return this.userinfo();
        else if (boxType === 'add_epoint')
            return this.addEpoint();
        else if (boxType === 'edit_epoint')
            return this.editEpoint();
    }
    userinfo(){
        return (
            <div style={{width:'100%',height:'100%'}}>
                <Row gutter={[16,32]}>
                    <Col >
                        <Input addonBefore="用户ID" value={this.state.uid} disabled={true} />
                    </Col>
                </Row>
                <Row gutter={[16,32]}>
                    <Col >
                        <Input addonBefore="用户名" value={this.state.username} disabled={true}/>
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
    addEpoint(){
        return (
            <div style={{width:'100%',height:'100%'}}>
                <Row gutter={[16,32]}>
                    <Col >
                        <Input addonBefore="标题"
                               value={this.state.epTitle}
                               onChange={e => {this.setState({epTitle:e.target.value})}}
                        />
                    </Col>
                </Row>
                <Row gutter={[16,32]}>
                    <Col >
                        <Input addonBefore="地址"
                               value={this.state.epAddr}
                               onChange={e => {this.setState({epAddr:e.target.value})}}
                        />
                    </Col>
                </Row>
                <Row gutter={[3,32]}>
                    <Col span={12}>
                        <Input addonBefore="经度" value={this.state.epLng.toFixed(7)} disabled={true}/>
                    </Col>
                    <Col span={12}>
                        <Input addonBefore="纬度" value={this.state.epLat.toFixed(7)} disabled={true} />
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
                                    value={this.state.epTimeMoment}
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
    editEpoint(){
        return(
            <div className={'infobox'}>
                <div className={"border-edit-epoint"}>
                    <Row gutter={[16,16]} >
                        <Col span={12}>
                            <div style={{fontSize:'15px'}}>事件点属性</div>
                        </Col>
                        <Col span={12}>
                            <div  style={{float:'right'}}>
                                <Button size={'small'}
                                        onClick={e=>{this.setState({ePointUpdateLoading:true})}}
                                        style={{display:this.displaystr[this.state.showEPointUpdateBtn]}} >
                                    <Icon type="sync" spin={this.state.ePointUpdateLoading}
                                          style={{fontSize:'15px',color:'red'}}
                                    />
                                </Button>
                            </div>
                        </Col>
                    </Row>
                    <Spin tip={'更新中...'}
                          spinning={this.state.waitingEPoingInfo}
                          delay={500}>
                        <Row gutter={[16,32]} >
                            <Col >
                                <Input addonBefore="标题"
                                       value={this.state.epTitle}
                                       onChange={e => {this.setState({epTitle:e.target.value,
                                           showEPointUpdateBtn:1})}}
                                />
                            </Col>
                        </Row>
                        <Row gutter={[16,32]}>
                            <Col >
                                <Input addonBefore="地址"
                                       value={this.state.epAddr}
                                       onChange={e => {this.setState({epAddr:e.target.value,
                                           showEPointUpdateBtn:1})}}
                                />
                            </Col>
                        </Row>
                        <Row gutter={[3,32]}>
                            <Col span={12}>
                                <Input addonBefore="经度" value={this.state.epLng} disabled={true}/>
                            </Col>
                            <Col span={12}>
                                <Input addonBefore="纬度" value={this.state.epLat} disabled={true} />
                            </Col>
                        </Row>

                        <Row gutter={[0,32]}>
                            <Col >
                                <Input.Group compact>
                                    <span className={'border-item-labe'} style={{width:'30%'}}>发生时间</span>
                                    <DatePicker
                                        showTime placeholder="发生时间"
                                        onOk={e=>{this.setState({epTime:e.valueOf(),epTimeMoment:e})}}
                                        onChange={e=>{this.setState({epTime:!!e?0:e.valueOf(),epTimeMoment:e,
                                            showEPointUpdateBtn:1})}}
                                        style={{width:'70%'}}
                                        locale={locale}
                                        value={this.state.epTimeMoment}
                                    />
                                </Input.Group>

                            </Col>
                        </Row>

                        <Row gutter={[16,32]}>
                            <Col >
                                <Input.Group compact>
                                    <span className={'border-item-labe'} style={{width:'30%'}}>事件类型</span>
                                    <span className={'border-edit-epoint-radio'}
                                          style={{width:'70%',padding:'5px'}}>
                                    <Radio.Group
                                        onChange={e=>{this.setState({epType:e.target.value,
                                            showEPointUpdateBtn:1})}}
                                        value={this.state.epType>=1?1:0}>
                                        <Radio value={1}>已完成</Radio>
                                        <Radio value={0}>未完成</Radio>
                                    </Radio.Group>
                                </span>

                                </Input.Group>

                            </Col>
                        </Row>
                    </Spin>
                </div>

                <div className={"border-edit-epoint"}
                    style={{top:'10px'}}>
                    <Row gutter={[16,16]} type={'flex'}>
                        <Col span={12}>
                            <div style={{fontSize:'15px'}}>事件点描述</div>
                        </Col>
                        <Col span={12}>
                            <div
                                style={{float:'right'}}>
                                <Button size={'small'}
                                        onClick={e=>{this.setState({ePTextInfoUpdateLoading:true})}}
                                        style={{display:this.displaystr[this.state.showEPTextInfoUpdateBtn]}}>
                                    <Icon type="sync" spin={this.state.ePTextInfoUpdateLoading}
                                          style={{fontSize:'15px',color:'red'}}
                                    />
                                </Button>
                            </div>
                        </Col>
                    </Row>
                    <Row gutter={[16,16]}>
                        <Col >
                            <Spin tip={'更新中...'} spinning={this.state.waitingTextInfo} delay={500}>
                                <Input.TextArea
                                    onChange={e=>{this.setState({epTiInfo:e.target.value,
                                        showEPTextInfoUpdateBtn:1})}}
                                    placeholder="无数据"
                                    autoSize={{ minRows: 14, maxRows: 14 }}
                                />
                            </Spin>
                        </Col>
                    </Row>



                </div>


            </div>
        );
    }


}


export default InfoBoxComponent;






