import React from 'react'
import {Button, Col, Input, message, Avatar,
    Row, Empty, List, Card, Modal, Upload,Icon} from "antd";
import './MediaInfoBoxComponent.css'

class MediaInfoBoxComponent extends React.Component{

        datasource=["http://file02.16sucai.com/d/file/2014/0704/e53c868ee9e8e7b28c424b56afe2066d.jpg",
            'http://b-ssl.duitang.com/uploads/item/201507/04/20150704212949_PSfNZ.jpeg']

    state={
            // 显示管理文件对话框
            showFileOps:false,
    }


    // 父组件关闭时
    closeInfoBox =()=>{
        console.debug('infobox closed')
    }

    updateInfoBox =()=>{

    }

    showFilesModal=()=>{
            if(!this.state.showFileOps)
                this.setState({showFileOps:true})
    }

    componentDidMount() {
        this.props.child(this);
    }

    onUploadChange=(file,fileList,event)=>{
            console.debug(file,fileList,event);
    }



    listItem =item=> (
        <Row type="flex" align="middle" justify="center">
            <Col>
                <Card
                    hoverable
                    style={{ width: 250,minHeight:100}}
                    cover={<img alt="example" src={item} />}>
                    <Card.Meta description="www.instagram.com" />
                </Card>
            </Col>
        </Row>
    )

    modalListItem=item=>(
        <Row type="flex" align="middle" gutter={[20,0]} sty>
            <Col>
                <div className={'list-item-pic-container'}>
                    <img style={{height:'100%',width:'100%',objectFit:'contain'}} src={this.datasource[item%2]}/>
                </div>
            </Col>
            <Col>
                <div className={'list-item-ctx-container'}>
                    <Row gutter={[0,10]}>
                        <Col span={15}>hhhhhhh</Col>
                        <Col span={9}>
                            <Row>
                                {/*<Col span={8}>*/}
                                {/*    <Icon type={'eye'} style={{fontSize:'30px'}}/>*/}
                                {/*</Col>*/}
                                <Col span={12}>
                                    <Icon type={'cloud-download'}  style={{fontSize:'30px'}}/>
                                </Col >
                                <Col span={12}>
                                    <Icon type={'delete'}  style={{fontSize:'30px'}}/>
                                </Col >
                            </Row>
                        </Col>
                    </Row>
                    <Row gutter={[0,10]}>

                    </Row>
                </div>
            </Col>
        </Row>
    )


    modalListItem=item=>(

            <div className={'list-item-pic-container'}>
                <img style={{height:'100%',width:'100%',objectFit:'contain'}}
                     src={this.datasource[item%2]}/>
            </div>

    )


    render() {

        const mList= (
            <div className={'info-box-list-container'}>
                <List
                    itemLayout={"vertical"}
                    dataSource={this.datasource}
                    renderItem={item => <List.Item>{this.listItem(item)}</List.Item>}>
                </List>
            </div>
        );
        const uploadBtn=(
            <Upload
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                showUploadList={false}
                onChange={this.onUploadChange}
            >
                <Button type={"primary"}>
                    <Icon type="upload" /> 点击上传文件
                </Button>
            </Upload>
        );

        return (
            <div>
                <Modal
                   title={uploadBtn}
                   footer={null}
                   closable={true}
                   visible={this.state.showFileOps}
                   destroyOnClose={true}
                   mask={false}
                   width={1000}
                   onCancel={e=>{this.setState({showFileOps:false})}}
                   style={{}}>
                    <div className={'modal-body-container'}>
                        <List
                            bordered={true}
                            grid={{gutter:[0,0], column: 4,}}
                            // itemLayout="horizontal"
                            dataSource={[1,2,3,4,51,2,2,2,1,1,1,1,1,1,11,1,1,1,1,1,1,1,1,1,11,]}
                            renderItem={item => (
                                <List.Item>
                                    {this.modalListItem(item)}
                                </List.Item>
                            )}
                        />
                    </div>
                </Modal>
                <div className={'info-box'}>
                    {mList}
                </div>
            </div>

        );
    }


}

export default MediaInfoBoxComponent;

