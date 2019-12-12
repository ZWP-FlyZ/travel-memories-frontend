import React from 'react'
import {Input, Row, Col, Button, Spin, DatePicker, Radio, message, Icon, Popconfirm, AutoComplete} from 'antd'
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

            // 事件点属性相关状态
            showEPointUpdateBtn:0,
            ePointUpdateLoading:false,
            waitingEPoingInfo:true,
            titlesDatasource:[],


            //事件点描述相关状态
            showEPTextInfoUpdateBtn:0,
            ePTextInfoUpdateLoading:false,
            waitingTextInfo:true,
            disableTextInfo:true,

            // 事件点删除
            deleteLoading:false,

            // 事件点信息
            epTitle:'',
            epAddr:'',
            epLng:0.0,
            epLat:0.0,
            epTime:m.valueOf(),
            epTimeMoment:m,
            epType:1,
            epTiText:''
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
            let ds = [];
            data.titles.forEach((t,_,__)=>{ds.push(t)})
            this.setState({
                // 事件点信息
                epTitle:data.title,
                epAddr:data.address,
                epLng:data.lng,
                epLat:data.lat,
                epTime:m.valueOf(),
                epTimeMoment:m,
                epType:1,
                addEPointLoading:false,
                titlesDatasource:ds
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
                epType:data.epType,

                // 事件点属性相关状态
                showEPointUpdateBtn:0,
                ePointUpdateLoading:false,
                waitingEPoingInfo:false,

                //事件点描述相关状态
                showEPTextInfoUpdateBtn:0,
                ePTextInfoUpdateLoading:false,
                waitingTextInfo:true,
                disableTextInfo:true,
            },()=>{
                if(data.epTiInfo==null){
                    this.getTextInfo(data);
                }else{
                    let gg = '';
                    if(data.epTiInfo!==0)
                        gg =data.epTiInfo.epTiText;
                    this.setState({epTiText:gg,
                        waitingTextInfo:false,
                        disableTextInfo:false});
                }
            });// end callback
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

    // 从服务器中获取事件点文本信息
    getTextInfo= (epoint)=>{
        // this.setState({addEPointLoading:true})
        Axios({
            url:'/api/epoint/get_textinfo',
            method:'get',
            params:{
                "epId":epoint.epId,
            },
        }).then(respone=>{
            this.setState({waitingTextInfo:false});
            console.debug('getTextInfo',respone);
            // 成功回调
            const res = respone.data;
            if(res.code === 1000){
                //获取到文本信息
                this.setState({disableTextInfo:false,
                    epTiText:res.data==null?'':res.data.epTiText});
                if(res.data!=null)
                    epoint.epTiInfo=res.data;
                else
                    epoint.epTiInfo=0
            }else{
                message.error("获取文本信息失败！");
            }
        }).catch(e=>{
            this.setState({waitingTextInfo:false});
            if(Axios.isCancel(e)){
                console.log("获取文本信息取消");
            }else{
                message.error("未知错误！");
                console.log(e);
            }
        })
    }

    // 更新文本信息到服务器中
    updateTextInfo = ()=>{
        const epoint = this.props.data;
        const curtext = this.state.epTiText;
        if((epoint.epTiInfo===0&&curtext==='')||
            (epoint.epTiInfo!==0&&
            epoint.epTiInfo.epTiText===curtext)){
            // 无需更新
            console.debug('无须更新文本信息');
            this.setState({
                showEPTextInfoUpdateBtn:0,
                ePTextInfoUpdateLoading:false,
                waitingTextInfo:false,
                disableTextInfo:false,
            });
            message.success("更新完成")
        }else {
            console.debug('更新文本信息');
            console.debug(epoint,curtext);
            Axios({
                url:'/api/epoint/update_textinfo',
                method:'post',
                params:{
                    "epId":epoint.epId,
                    "text":curtext
                },
            }).then(respone=>{
                this.setState({waitingTextInfo:false,disableTextInfo:false});
                console.debug('updateTextInfo',respone);
                // 成功回调
                const res = respone.data;
                if(res.code === 1000){
                    //更新文本信息成功
                    this.setState({
                        showEPTextInfoUpdateBtn:0,
                        ePTextInfoUpdateLoading:false});
                    if(epoint.epTiInfo===0){
                        epoint.epTiInfo={
                            epTiText:curtext
                        }
                    }else
                        epoint.epTiInfo.epTiText=curtext;
                    message.success("更新文本信息成功！")
                }else if(res.code === 1006){
                    message.error("更新文本信息失败！文本超过1800字符！");
                    this.setState({ePTextInfoUpdateLoading:false});
                }else{
                    message.error("更新文本信息失败！");
                    this.setState({ePTextInfoUpdateLoading:false});
                }
            }).catch(e=>{
                this.setState({
                    waitingTextInfo:false,
                    disableTextInfo:false,
                    ePTextInfoUpdateLoading:false});
                if(Axios.isCancel(e)){
                    console.log("更新文本信息取消");
                }else{
                    message.error("未知错误！");
                    console.log(e);
                }
            })


        }


    }

    // 更新事件属性到服务器中
    updateEpointAtrr=()=>{
        const epoint = this.props.data;
        const curstate = this.state;
        console.debug('updateEpointAtrr',epoint,curstate);
        if(
            epoint.epTitle===curstate.epTitle&&
            epoint.epAddr===curstate.epAddr&&
            epoint.epTime===curstate.epTime&&
            epoint.epType===curstate.epType){
            // 无需更新
            console.debug('无须更新属性信息');
            this.setState({
                showEPointUpdateBtn:0,
                ePointUpdateLoading:false,
                waitingEPoingInfo:false,
            });
            message.success("更新完成")
        }else{
            console.debug('更新属性信息');
            Axios({
                url:'/api/epoint/setting',
                method:'post',
                params:{
                    epId:epoint.epId,
                    epTitle:curstate.epTitle,
                    epAddr:curstate.epAddr,
                    epTime:curstate.epTime,
                    epType:curstate.epType
                },
            }).then(respone=>{
                this.setState({waitingEPoingInfo:false});
                console.debug('updateEpointAtrr',respone);
                // 成功回调
                const res = respone.data;
                if(res.code === 1000){
                    //更新文本信息成功
                    this.setState({
                        showEPointUpdateBtn:0,
                        ePointUpdateLoading:false});
                    epoint.epTitle=curstate.epTitle
                    epoint.epAddr=curstate.epAddr
                    epoint.epTime=curstate.epTime
                    epoint.epType=curstate.epType
                    message.success("更新事件点属性成功！")
                    this.props.onUpdateAtrrSuccess(epoint);
                }else if(res.code === 1006){
                    message.error("更新事件点属性失败！属性格式不符合要求！");
                    this.setState({ePointUpdateLoading:false});
                }else{
                    message.error("更新事件点属性失败！服务器未知问题");
                    this.setState({ePointUpdateLoading:false});
                }
            }).catch(e=>{
                this.setState({
                    waitingEPoingInfo:false,
                    ePointUpdateLoading:false});
                if(Axios.isCancel(e)){
                    console.log("更新事件点属性取消");
                }else{
                    message.error("未知错误！");
                    console.log(e);
                }
            })
        }
    }

    onDeleteEPoint = ()=>{
        const epoint = this.props.data
        this.setState({deleteLoading:true});
        Axios({
            url:'/api/epoint/delete',
            method:'get',
            params:{
                epId:epoint.epId,
            },
        }).then(response=>{
            this.setState({deleteLoading:false});
            console.debug('onDeleteEPoint',response);
            const res = response.data;
            if(res.code===1000){
                console.debug('删除事件点成功！');
                this.props.onDeleteSuccess(epoint);
            }else{
                message.error("删除事件点失败！");
            }
        }).catch(e=>{
            this.setState({deleteLoading:false});
            if(Axios.isCancel(e)){
                console.log("删除事件点取消");
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
        else if (boxType === 'add_epoint')
            return this.addEpoint();
        else if (boxType === 'edit_epoint')
            return this.editEpoint();
    }

    addEpoint(){
        return (
            <div style={{width:'100%',height:'100%'}}>
                <div className={'border-add-epoint'}>
                    <Row gutter={[16,16]} >
                        <Col >
                            <div style={{fontSize:'15px'}}>事件点属性</div>
                        </Col>
                    </Row>
                    <Row gutter={[16,32]}>
                        <Col >
                            <AutoComplete style={{width:'100%'}}
                                          value={this.state.epTitle}
                                          onChange={e => {this.setState({epTitle:e})}}
                                          dataSource={this.state.titlesDatasource}
                            >
                                <Input addonBefore="标题"/>
                            </AutoComplete>
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
                            <Input.Group compact>
                                <span className={'border-item-labe'} style={{width:'30%'}}>发生时间</span>
                                <DatePicker
                                    showTime placeholder="事件发生时间"
                                    onOk={e=>{this.setState({epTime:e.valueOf(),epTimeMoment:e})}}
                                    onChange={e=>{this.setState({epTime:e.valueOf(),epTimeMoment:e})}}
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
                                    <Radio.Group onChange={e=>{this.setState({epType:e.target.value})}}
                                                 value={this.state.epType}>
                                        <Radio value={1}>已完成</Radio>
                                        <Radio value={0}>未完成</Radio>
                                    </Radio.Group>
                                </span>
                            </Input.Group>
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
                                        onClick={e=>{
                                            this.setState({
                                                ePointUpdateLoading:true,
                                                waitingEPoingInfo:true,});
                                                this.updateEpointAtrr();
                                        }}
                                        style={{display:this.displaystr[this.state.showEPointUpdateBtn]}} >
                                    <Icon type="cloud-upload" spin={this.state.ePointUpdateLoading}
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
                                        onChange={e=>{this.setState({epTime:e==null?0:e.valueOf(),epTimeMoment:e,
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
                    style={{top:'7px'}}>
                    <Row gutter={[16,16]} type={'flex'}>
                        <Col span={12}>
                            <div style={{fontSize:'15px'}}>事件点描述</div>
                        </Col>
                        <Col span={12}>
                            <div
                                style={{float:'right'}}>
                                <Button size={'small'}
                                        onClick={e=>{
                                            this.setState({
                                                ePTextInfoUpdateLoading:true,
                                                waitingTextInfo:true,});
                                            this.updateTextInfo();
                                        }}
                                        style={{display:this.displaystr[this.state.showEPTextInfoUpdateBtn]}}>
                                    <Icon type="cloud-upload" spin={this.state.ePTextInfoUpdateLoading}
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
                                    onChange={e=>{this.setState({epTiText:e.target.value,
                                        showEPTextInfoUpdateBtn:1})}}
                                    placeholder="无数据"
                                    autoSize={{ minRows: 15, maxRows: 15 }}
                                    disabled={this.state.disableTextInfo}
                                    value={this.state.epTiText}
                                />
                            </Spin>
                        </Col>
                    </Row>
                </div>
                <div className={'border-edit-epoint-button'}
                     style={{top:'10px'}}>
                    <Row gutter={[8,16]}>
                        <Col span={10}>
                            <Button disabled={true} style={{width:'100%'}}>锁定</Button>
                        </Col>
                        <Col span={14}>
                            <Popconfirm title={'确认删除该事件点？'}
                                        okText="确认" cancelText="取消"
                                        okType={'danger'}
                                        onConfirm={this.onDeleteEPoint}>
                                <Button type={'danger'}
                                        loading={this.state.deleteLoading}
                                        style={{width:'100%'}}>删除</Button>
                            </Popconfirm>

                        </Col>
                    </Row>
                </div>




            </div>
        );
    }


}


export default InfoBoxComponent;






