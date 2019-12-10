import React from 'react'
import {Button, Col, Input, message, Row} from "antd";
import moment from "./InfoBoxComponent";
import Axios from "axios";
// import {Input,Row,Col,Button,Spin,DatePicker,Radio,message,Icon,Popconfirm} from 'antd'

class UserInfoBoxComponent extends React.Component{

    constructor(props, context) {
        super(props, context);
        this.state = {
            //状态
            logoutLoading:false,

            // 用户信息
            uid:0,
            username:'',

        }
    }

    // 父组件关闭时
    closeInfoBox =()=>{
        console.debug('infobox closed')
    }


    updateInfoBox =()=>{
        let data = this.props.data;
        // console.debug('dddddd')
        if(this.props.type==='user_info'){
            this.setState({
                // 事件点信息
                uid:data.uid,
                username:data.username,
                logoutLoading:false,
            });
        }
    }

    onLogout = e=>{
        this.setState({logoutLoading:true});
        Axios({
            url:'/api/logout',
            method:'get',
        }).then(response=>{
            this.setState({logoutLoading:false});
            console.log(response);
            const res = response.data;
            if(res.code===1000){
                //登出成功
                if(this.props.onLogoutSuccess != null){
                    this.props.onLogoutSuccess();
                }
            }else{
                message.error("登出失败")
            }

        }).catch(e=>{
            this.setState({logoutLoading:false});
            if(Axios.isCancel(e)){
                console.log("登出取消");
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
        if (boxType === 'user_info')
            return this.userInfoView();
        else return (<div>EMPTY</div>);
    }

    userInfoView(){
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



}

export default UserInfoBoxComponent;




