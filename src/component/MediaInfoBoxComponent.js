import React from 'react'
import {Button, Col, Input, message, Avatar,Progress,
    Row, Empty, List, Card, Modal, Upload,Icon} from "antd";
import './MediaInfoBoxComponent.css'

class MediaInfoBoxComponent extends React.Component{

        datasource=["http://file02.16sucai.com/d/file/2014/0704/e53c868ee9e8e7b28c424b56afe2066d.jpg",
            'http://b-ssl.duitang.com/uploads/item/201507/04/20150704212949_PSfNZ.jpeg',
            "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"]


    // 文件项定义
    // fileItem = {
    //         fid:0,
    //         fName:''
    //         rowUrl:'',// 原始文件路径
    //         previewUrl:'',//预览图文件地址
    //         fType:0,//文件类型
    //         describe:'',//文件描述
    //         epMiId:0,//媒体文件id
    //         percent:null | 0-100 // 是否加载
    //      }

    ds=[
        {
            fid:0,
            rowUrl:this.datasource[0],// 原始文件路径
            previewUrl:this.datasource[0],//预览图文件地址
            fType:0,//文件类型
            describe:'花',//文件描述
            epMiId:0,//媒体文件id
            percent:null // 是否加载
        },
        {
            fid:1,
            rowUrl:this.datasource[1],// 原始文件路径
            previewUrl:this.datasource[1],//预览图文件地址
            fType:0,//文件类型
            describe:'女孩',//文件描述
            epMiId:0,//媒体文件id
            percent:null // 是否加载
        },
        {
            fid:2,
            rowUrl:this.datasource[2],// 原始文件路径
            previewUrl:this.datasource[2],//预览图文件地址
            fType:0,//文件类型
            describe:'女孩',//文件描述
            epMiId:0,//媒体文件id
            percent:null // 是否加载
        }

    ]


    state={
            // 显示管理文件对话框
            showFileOps:false,
            // 操作

            infoBoxDatasource:this.ds,
            opDataSource:this.ds,
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

    onUploadChange=({file,fileList,event})=>{
            console.debug(file,fileList,event);
            const {opDataSource} = this.state;
            if(file.status==='done'){
                let t = opDataSource.find(item=>item.fid==file.uid);
                if(t!=null){
                    t.percent=null;
                    t.rowUrl=file.response.url
                    t.previewUrl=file.response.url
                }
            }else if(file.status==='uploading'){
                let t = opDataSource.find(item=>item.fid==file.uid);
                if(t!=null){
                    t.percent=file.percent.toFixed(0);
                }else{
                    opDataSource.unshift({
                        fid:file.uid,
                        rowUrl:'',// 原始文件路径
                        previewUrl:'',//预览图文件地址
                        fType:0,//文件类型
                        describe:'花ssss',//文件描述
                        epMiId:0,//媒体文件id
                        percent:0 // 是否加载
                    });
                }
            }else{
                console.error(file,fileList,event);
            }
        this.setState({opDataSource:opDataSource})
    }


    // 点击下载
    onModalItemDownloading=fileItem=>{
        console.debug('onModalItemDownloading',fileItem)
    }

    // 点击删除
    onModalItemDeleting=fileItem=>{
        console.debug('onModalItemDeleting',fileItem)
    }

    // 点击预览
    onModalItemPreviewing=fileItem=>{
        console.debug('onModalItemPreviewing',fileItem)
    }



    listInfoBoxItem =item=> (
        <List.Item>
                <Row type="flex" align="middle" justify="center">
                    <Col>
                        <Card
                            hoverable
                            style={{ width: 250,minHeight:100}}
                            cover={<img alt={item.describe} src={item.previewUrl} />}>
                            <Card.Meta description={item.describe} />
                        </Card>
                    </Col>
                </Row>
        </List.Item>
    )

    modalListItem =item=>(
        <List.Item>
            <PictureContainer
                onPreviewing={this.onModalItemPreviewing}
                onDeleting={this.onModalItemDeleting}
                onDownloading={this.onModalItemDownloading}
                data={item}/>
        </List.Item>
    );

    render() {
        const {infoBoxDatasource,opDataSource} = this.state;

        const mList= (
            <div className={'info-box-list-container'}>
                <List
                    itemLayout={"vertical"}
                    dataSource={infoBoxDatasource}
                    renderItem={this.listInfoBoxItem}>
                </List>
            </div>
        );
        const uploadBtn=(
            <Upload
                multiple={true}
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                showUploadList={false}
                onChange={this.onUploadChange}>
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
                            bordered={false}
                            grid={{gutter:[0,0], column: 3,}}
                            // itemLayout="horizontal"
                            dataSource={opDataSource}
                            renderItem={this.modalListItem}
                            style={{height:'100%'}}
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



class PictureContainer extends React.Component{

    state={
        showMask:'none',
    }

    render() {
        const {data,onPreviewing,onDownloading,onDeleting} = this.props;
        const {showMask} = this.state;
        const percent =data==null?null:data.percent;
        return (
            <div className={'file-item-container'}
                 onMouseEnter={event => {
                     if(percent==null)
                         this.setState({showMask:'block'})
                 }}
                 onMouseLeave={event => {
                     if(percent==null)
                         this.setState({showMask:'none'})
                 }}>
                <div className={'file-item-pic-mask'} style={{display:showMask}}>
                    <Row type={'flex'}
                         justify="center"
                         align="middle"
                        gutter={[20,0]}>
                        <Col>
                                <Icon type={'eye'} className={'icon-in-pc'}
                                      onClick={e=>onPreviewing(data)}/>
                        </Col>
                        <Col>
                            <Icon type={'cloud-download'} className={'icon-in-pc'}
                                  onClick={e=>onDownloading(data)}/>
                        </Col>
                        <Col>
                            <Icon type={'delete'} className={'icon-in-pc'}
                                  style={{color:'red'}}
                                  onClick={e=>onDeleting(data)}
                            />
                        </Col>
                    </Row>
                </div>
                <div className={'file-item-pic-mask'}
                     style={{display:percent==null?'none':'block'}}>
                    <Row type={'flex'}
                         justify="center"
                         align="middle"
                         gutter={[20,0]}>
                        <Col>
                            <div style={{top:'15px',position:'relative'}}>
                                <Progress type="circle" width={80} style={{top:'10px'}}
                                          percent={percent==null?0:Number(percent)}
                                />
                            </div>
                        </Col>
                    </Row>

                </div>
                <div id={'file-mask'} className={'file-item-pic-container'}>
                    <img style={{height:'100%',width:'100%',objectFit:'contain'}}
                         src={data.previewUrl}/>
                </div>
            </div>
        );
    }


}


export default MediaInfoBoxComponent;

