import React from "react"
import Axios from 'axios'
import {message ,Row, Col, Icon,Input,Modal,Form} from 'antd'
import './LogInComponent.css'


class LogInComponent extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            // 登录时等待
            confirmLoading:false,
            Visible:"false",
            username:'zwp5',
            password:'123456'
        }

        // 登录成功回调,返回用户的一些信息
        this.loginSuccess = props.loginSuccess;
        // 取消登录回调
        this.loginCancel = props.loginCancel;
        this.cancelToken = null;
    }

    // 点击登录回调
    handleOk = ()=>{
        this.setState(pre=>({confirmLoading:true}));
        this.doLogin();
    }
    handleCancel = ()=>{
        this.setState(pre=>({confirmLoading:false}));
        if(this.cancelToken!=null)
            this.cancelToken.cancel("取消登录");
        // 执行取消登录回调
        if(this.loginCancel != null)
            this.loginCancel();
    }
    // 执行登录操作
    doLogin(){
        this.cancelToken = Axios.CancelToken.source();
        this.connect = Axios(
            {
                url:'/api/login',
                method:'post',
                params:{"username":this.state.username,
                    "password":this.state.password},
                cancelToken:this.cancelToken.token
            }
        ).then(respone=>{
            this.setState({confirmLoading:false});
            console.log(respone);
            // 登录成功回调
            const res = respone.data;
            if(res.code === 1000){
                // 登录成功
                res.data.username=this.state.username;
                this.loginSuccess(res.data);
            }else{
                console.debug('login fal');
                message.error("用户名或者密码错误！");
            }
        }).catch(e=>{
            this.setState({confirmLoading:false});
            if(Axios.isCancel(e)){
                console.log("登录取消");
            }else{
                message.error("未知错误！");
                console.log(e);
            }

        })

        // setTimeout(()=>{
        //
        //     if(this.loginSuccess != null)
        //         this.loginSuccess({uId:1,username:this.state.username,iconPath:"ssss",password:this.state.password});
        // },2000)

    }

    // 用户名输入框回调
    onChangeUsername = e=>{
        // console.log(e.target.value);
        this.setState({username:e.target.value})
    }
    onChangePassword = e=>{
        // console.log(e.target.value);
        this.setState({password:e.target.value})
    }


    componentDidMount() {

    }

    componentWillUnmount() {

    }

    render() {

        return(
            <Modal
                    title={"请输入登录信息"}
                    visible={this.props.visible}
                    destroyOnClose={true}
                    onOk={this.handleOk}
                    okText={"登录"}
                    onCancel={this.handleCancel}
                    cancelText={"取消"}
                    cancelButtonProps={{visible:'false'}}
                    confirmLoading={this.state.confirmLoading}
                    mask={false}
                    maskClosable={false}
                    width={400}
                    style={{}}>
                <Row gutter={[16,32]}>
                    <Col>
                        <Input
                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            placeholder="用户名"
                            defaultValue={"zwp5"}
                            onChange={this.onChangeUsername}
                        />
                    </Col>
                </Row>
                <Row gutter={[16,32]}>
                    <Col>
                        <Input
                            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            type="password"
                            placeholder="密码"
                            defaultValue={"123456"}
                            onChange={this.onChangePassword}
                        />
                    </Col>
                </Row>

            </Modal>);
    }

}

// 登录表单组件
class LogInForm extends React.Component{

    render() {
        return(
            <Form>

            </Form>

        );
    }
}



export default LogInComponent;





