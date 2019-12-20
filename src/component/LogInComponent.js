import React from "react"
import Axios from 'axios'
import {message ,Row, Col, Icon,Input,Modal,Form,Button,Divider} from 'antd'
import './LogInComponent.css'


//////////////////////
// 以下全局变量设计不太合理，请注意
let loginSuccess = null;
let loginCancelToken=null;
let logonSuccess =null;
/////////////////////


class LogInComponent extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            loginVisible:true,
            isLogonType:false,
        }

        // 登录成功回调,返回用户的一些信息
        loginSuccess = this.props.loginSuccess;
        // 取消登录回调
        this.loginCancel = props.loginCancel;
        logonSuccess = this.logonSuccess;
    }

    handleCancel = ()=>{
        if(loginCancelToken!=null)
            loginCancelToken.cancel("取消登录");
        // 执行取消登录回调
        if(this.loginCancel != null)
            this.loginCancel();
    }

    logonSuccess=()=>{
        this.setState({isLogonType:false});
        message.success("注册成功，请登录！");
    }


    render() {
        let  Wrapform =null;
        if(!this.state.isLogonType)
            Wrapform = Form.create({ name: 'login_form' })(LogInForm);
        else
            Wrapform = Form.create({ name: 'logon_form' })(LogonForm);
        return(
            <div>
                <Modal
                    visible={this.props.visible}
                    destroyOnClose={true}
                    onCancel={this.handleCancel}
                    mask={false}
                    maskClosable={false}
                    width={400}
                    footer={null}
                    style={{}}>
                    <Wrapform />
                    <Divider/>
                    <Button onClick={e=>{this.setState({isLogonType:!this.state.isLogonType})}}>
                        {this.state.isLogonType?"返回登录":"注册"}
                    </Button>
                </Modal>
            </div>
        );
    }
}

class LogInForm extends React.Component{

    state={
        loginLoading:false,
        username:'zwp5',
        password:'123456',
    }


    doLogin = loginInfo=>{
        loginCancelToken = Axios.CancelToken.source();
        this.connect = Axios(
            {
                url:'/api/login',
                method:'post',
                params:{"username":loginInfo.username,
                    "password":loginInfo.password},
                cancelToken:loginCancelToken.token
            }
        ).then(respone=>{
            this.setState({loginLoading:false});
            console.log(respone);
            // 登录成功回调
            const res = respone.data;
            if(res.code === 1000){
                // 登录成功
                res.data.username=loginInfo.username;
                loginSuccess(res.data);
            }else{
                console.debug('login fal');
                message.error("用户名或者密码错误！");
            }
            loginCancelToken=null;
        }).catch(e=>{
            this.setState({loginLoading:false});
            if(Axios.isCancel(e)){
                console.log("登录取消");
            }else{
                message.error("未知错误！");
                console.log(e);
            }
            loginCancelToken=null;
        })
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                // console.debug('Received values of form: ', values);
                this.setState({loginLoading:true})
                this.doLogin(values);
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
                <div >
                    <Divider orientation="left"><h1>用户登录</h1></Divider>
                    <Form onSubmit={this.handleSubmit} style={{}}>
                        <Form.Item>
                            {getFieldDecorator('username', {
                                initialValue:this.state.username,
                                rules: [{ required: true, trigger: 'blur',message: '请输入用户名!' },
                                    { max: 16,min:4, message: '用户名长度为4-16字节!' },
                                    {pattern:'^[_a-zA-Z0-9]+$' ,
                                        message: ' 只能输入英文字母，数字以及下划线! '}
                                ],
                            })(
                                <Input
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="用户名"
                                    maxLength={16}
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('password', {
                                initialValue:this.state.password,
                                rules: [{ required: true, trigger: 'blur',message: '请输入密码' },
                                    { max: 20,min:6, message: '密码长度为6-20字节!' },
                                ],
                            })(
                                <Input
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    type="password"
                                    placeholder="密码"
                                    maxLength={20}
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            <Row gutter={[0,10]}>
                                <Col>
                                    <Button type="primary"
                                            htmlType="submit"
                                            style={{width:'100%'}}
                                            loading={this.state.loginLoading}>
                                        登录
                                    </Button>
                                </Col>
                            </Row>
                        </Form.Item>
                    </Form>
                </div>
        );
    }


}

class LogonForm extends React.Component{


    state={
        logonLoading:false,
    }

    doLogon = logonInfo=>{
        loginCancelToken = Axios.CancelToken.source();
        this.connect = Axios(
            {
                url:'/api/logon',
                method:'post',
                params:{"username":logonInfo.username,
                    "password":logonInfo.password},
                cancelToken:loginCancelToken.token
            }
        ).then(respone=>{
            this.setState({logonLoading:false});
            console.log(respone);
            // 登录成功回调
            const res = respone.data;
            if(res.code === 1000){
                // 登录成功
                logonSuccess();
            }else if(res.code === 1102){
                message.error("用户名重复,请换其他名字！");
            }else
                message.error("注册失败！");
            loginCancelToken=null;
        }).catch(e=>{
            this.setState({logonLoading:false});
            if(Axios.isCancel(e)){
                console.log("注册取消");
            }else{
                message.error("未知错误！");
                console.log(e);
            }
            loginCancelToken=null;
        })

    }


    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                // console.debug('Received values of form: ', values);
                this.setState({logonLoading:true})
                this.doLogon(values);
            }
        });
    };


    render() {
        const { getFieldDecorator } = this.props.form;
        return (
                <div >
                    <Divider orientation="left"><h1>用户注册</h1></Divider>
                    <Form onSubmit={this.handleSubmit} style={{}}>
                        <Form.Item>
                            {getFieldDecorator('username', {
                                rules: [{ required: true, trigger: 'blur',message: '请输入用户名!' },
                                    { max: 16,min:4, message: '用户名长度为4-16字节!' },
                                    {pattern:'^[_a-zA-Z0-9]+$' ,
                                        message: ' 只能输入英文字母，数字以及下划线! '}
                                ],
                            })(
                                <Input
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="用户名"
                                    maxLength={16}
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, trigger: 'blur',message: '请输入密码' },
                                    { max: 20,min:6, message: '密码长度为6-20字节!' },
                                ],
                            })(
                                <Input
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    type="password"
                                    placeholder="密码"
                                    maxLength={20}
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            <Row gutter={[0,10]}>
                                <Col>
                                    <Button type="primary"
                                            htmlType="submit"
                                            style={{width:'100%'}}
                                            loading={this.state.logonLoading}>
                                        注册
                                    </Button>
                                </Col>
                            </Row>
                        </Form.Item>
                    </Form>
                </div>
        );
    }


}


export default LogInComponent;





