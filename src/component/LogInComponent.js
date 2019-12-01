import React from "react"
import {Row, Col, Icon,Input,Modal,Form} from 'antd'
import './LogInComponent.css'





class LogInComponent extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            // 登录时等待
            confirmLoading:false,
            visible:false
        }
        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        // 登录成功回调,返回用户的一些信息
        this.loginSuccess = this.props.loginSuccess;
        // 取消登录回调
        this.loginCancel = this.props.loginCancel;
    }

    // 点击登录回调
    handleOk(){
        this.setState(pre=>({confirmLoading:true}));
        this.doLogin();
    }
    handleCancel(){
        this.setState(pre=>({confirmLoading:false}));
        // 执行取消登录回调
        if(this.loginCancel != null)
            this.loginCancel();
    }
    // 执行登录操作
    doLogin(){
        setTimeout(()=>{
            this.setState({confirmLoading:false});
            if(this.loginSuccess != null)
                this.loginSuccess({uId:1,username:"zz",iconPath:"ssss"});
        },2000)
        // 登录成功回调
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
                    cancelButtonProps={{visible:false}}
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
                        />
                    </Col>
                </Row>
                <Row gutter={[16,32]}>
                    <Col>
                        <Input
                            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            type="password"
                            placeholder="密码"
                        />
                    </Col>
                </Row>

            </Modal>);
    }

    componentWillMount() {
        console.log(this.props);
    }
}

// 登录表单组件
class LogInForm extends React.Component{

}



export default LogInComponent;





