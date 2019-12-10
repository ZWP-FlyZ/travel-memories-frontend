import React from 'react'
// import {Input,Row,Col,Button,Spin,DatePicker,Radio,message,Icon,Popconfirm} from 'antd'

class UserInfoBoxComponent extends React.Component{


    render() {
        const boxType = this.props.type;
        if (boxType === 'login')
            return this.loginView();
        else if (boxType === 'user_info')
            return this.userinfo();
        else return (<div>EMPTY</div>);
    }

    loginView =()=>{

    }
}

export default UserInfoBoxComponent;




