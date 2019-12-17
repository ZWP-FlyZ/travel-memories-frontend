import React from 'react'
import {
    Button, Col, Input, message, Avatar, Progress,
    Row, Spin, List, Card, Modal, Upload, Icon, Popconfirm, Divider
} from "antd";
import './MediaInfoBoxComponent.css'
import Axios from "axios";

function toDownloadPath(url){
    if(url==null||url==='')
        return '';
    else return '/api/epoint/files/'+url;
}


class MediaInfoBoxComponent extends React.Component{


    // 文件项定义
    // fileItem = {
    //         fId:0,
    //         fName:'',
    //         fUrl:'',// 原始文件路径
    //         fPreviewUrl:'',//预览图文件地址
    //         fType:0,//文件类型
    //         fDescription:'',//文件描述
    //         epMiId:0,//媒体文件id
    //         fStatusPercent:null | 0-100 // 是否加载
    //         fStatusUploadError:false | true
    //      }

    state={
        // 显示管理文件对话框
        showFileOps:false,
        infoBoxSpinning:false,
        showPreviewModal:false,
        // 操作

        infoBoxDatasource:[],
        opDataSource:[],
    }
    curPreviewFileItem = {};

    // 父组件关闭时
    closeInfoBox =()=>{
        console.debug('infobox closed')
    }

    updateInfoBox =()=>{
        const {data} = this.props;
        if(data.epMiInfo==null)
            this.getMediaInfoFromService(data);
        else{
            //  重要！！！！！
            //  infoBoxDatasource和opDataSource 可能共用，
            let ls = this.formatMediaInfo(data.epMiInfo);
            this.setState({
                infoBoxDatasource:ls,
                opDataSource:[...ls]
            });
        }
    }

    getMediaInfoFromService=(epoint)=>{
        this.setState({infoBoxSpinning:true});
        Axios({
            url:'/api/epoint/get_mediainfo',
            method:'get',
            params:{
                "epId":epoint.epId,
            },
        }).then(respone=>{
            this.setState({infoBoxSpinning:false});
            console.debug('getMediaInfoFromService',respone);
            // 成功回调
            const res = respone.data;
            if(res.code === 1000){
                // 深复制注意
                let ls = this.formatMediaInfo(res.data);
                this.setState({
                    infoBoxDatasource:ls,
                    opDataSource:[...ls]});
                epoint.epMiInfo = res.data;
            }else{
                message.error("获取媒体文件失败！");
            }
        }).catch(e=>{
            this.setState({infoBoxSpinning:false});
            if(Axios.isCancel(e)){
                console.log("获取媒体信息取消");
            }else{
                message.error("未知错误！");
                console.log(e);
            }
        })
    }

    formatMediaInfo(infoList){
        let ret=[];
        infoList.forEach((item,_,__)=>{
            ret.unshift({
                fId:item.epMiId,
                fName:item.epMiPath,
                fUrl:item.epMiPath,// 原始文件路径
                fPreviewUrl:'p-'+item.epMiPath,//预览图文件地址
                fType:item.epMiType,//文件类型
                fDescription:item.epMiDesc,//文件描述
                epMiId:item.epMiId,//媒体文件id
                fStatusPercent:null  // 是否加载
            });
        })
        return ret;
    }

    // 父组件调用，显示文件管理对话框
    showFilesModal=()=>{
            if(!this.state.showFileOps)
                this.setState({showFileOps:true,
                    opDataSource:[...this.state.infoBoxDatasource]})
    }


    componentDidMount() {
        this.props.child(this);
    }

    // 当上传成功时调用
    onUploadSuccess = fileType=>{
        const {data} = this.props
        const mi={
            "epMiId": fileType.epMiId,
            "epMiType": fileType.fType,
            "epId": data.epId,
            "epMiDesc": fileType.fDescription,
            "epMiPath": fileType.fUrl,
            "uid": data.uid
        }
        this.props.data.epMiInfo.unshift(mi);
    }


    // 上传组件状态变更回调
    onUploadChange=({file,_,__})=>{
        console.debug(file);
        const {opDataSource} = this.state;
        const response = file.response;
        // 查找是否之前创建过上传中的图
        let t = opDataSource.find(item=>item.fId===file.uid);
        if(t==null){
            // 还未创建
            let newt = {
                fId:file.uid,
                fName:file.name,
                fUrl:'',// 原始文件路径
                fPreviewUrl:'',//预览图文件地址
                fType:0,//文件类型
                fDescription:'',//文件描述
                epMiId:-1,//媒体文件id
                fStatusPercent:0, // 是否加载
                fStatusUploadError:false
            }
            if(response!=null&&response.code!==1000){
                newt.fStatusUploadError=true;
            }
            opDataSource.unshift(newt);
        }else if(!t.fStatusUploadError){

            if(response!=null&&response.code!==1000){
                t.fStatusUploadError=true;
            }else if(file.status==='error'){
                t.fStatusUploadError=true;
            }else if(file.status==='uploading'){
                t.fStatusPercent=file.percent.toFixed(0);
            }else if(file.status==='done'){
                if(response==null)
                    t.fStatusUploadError=true;
                else{
                    //传输正确完成
                    const info = file.response.data;
                    t.fId = info.epMiId;
                    t.fName=info.epMiPath;
                    t.epMiId = info.epMiId;
                    t.fStatusPercent=null;
                    t.fUrl=info.epMiPath;
                    t.fPreviewUrl='p-'+info.epMiPath;
                    t.fType = info.epMiType;
                    this.onUploadSuccess(t);
                }
            }
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
        Axios({
            url:'/api/epoint/delete_mediainfo',
            method:'get',
            params:{
                "epMiId":fileItem.epMiId,
                "epMiPath":fileItem.fUrl
            },
        }).then(respone=>{
            console.debug('onModalItemDeleting',respone);
            // 成功回调
            const res = respone.data;
            if(res.code === 1000){
                let opDataSource = this.state.opDataSource.filter((item,_)=>{
                    return item.fId !== fileItem.fId
                })
                this.setState({opDataSource:opDataSource})
                let tmp = this.props.data.epMiInfo.filter((item,_)=>{
                    return item.epMiId !== fileItem.epMiId
                })
                this.props.data.epMiInfo=tmp;
            }else{
                message.error("删除文件失败！");
            }
        }).catch(e=>{
            this.setState({infoBoxSpinning:false});
            if(Axios.isCancel(e)){
                console.log("删除文件取消");
            }else{
                message.error("未知错误！");
                console.log(e);
            }
        })
    }
    onUploadingErrorDeleting=fileItem=>{
        console.debug('onUploadingErrorDeleting',fileItem)

        let opDataSource = this.state.opDataSource.filter((item,_)=>{
            return item.fId !== fileItem.fId
        })
        this.setState({opDataSource:opDataSource})
    }
    // 点击预览
    onModalItemPreviewing=fileItem=>{
        console.debug('onModalItemPreviewing',fileItem)
    }

    beforeUpload=(file,fileList)=>{
        console.debug('beforeUpload',file,fileList)
        return true;
    }

    // 当关闭管理文件对话框
    onModalCancel=()=>{
        let ret = [];
        this.state.opDataSource.forEach((item,_,__)=>{
            if(!item.fStatusUploadError)
                ret.push(item);
        })

        this.setState({
            showFileOps:false,
            infoBoxDatasource:ret,
        })
    }


    previewModal=item=>{
        this.curPreviewFileItem = item;
        this.setState({showPreviewModal:true})
    }

    listInfoBoxItem =item=> (
        <List.Item>
                <Row type="flex" align="middle" justify="center">
                    <Col>
                        <Card
                            hoverable
                            style={{ width: 250,minHeight:100}}
                            onClick={event => this.previewModal(item)}
                            cover={<img alt={item.fName} src={toDownloadPath(item.fPreviewUrl)} />}>
                            <Card.Meta description={item.fDescription} />
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
                onUploadingErrorDeleting={this.onUploadingErrorDeleting}
                data={item}/>
        </List.Item>
    );

    render() {
        const {infoBoxDatasource,opDataSource,infoBoxSpinning} = this.state;
        const {data} = this.props;
        const uploadBtn=(
            <Upload
                accept={'image/*'}
                multiple={true}
                // action={"/api/epoint/upload_mediainfo"}
                action={"/api/epoint/upload_mediainfo?epId="+data.epId}
                headers={{'c-version':'1.0'}}
                showUploadList={false}
                onChange={this.onUploadChange}
                beforeUpload={this.beforeUpload}
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
                   onCancel={this.onModalCancel}
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
                <Modal
                    title={"预览"}
                    footer={null}
                    visible={this.state.showPreviewModal}
                    destroyOnClose={true}
                    onCancel={e=>this.setState({showPreviewModal:false})}
                    width={"75vw"}
                    >
                    <Row type={"flex"}
                         justify="center"
                         align="middle"
                         gutter={[20,20]}
                    >
                        <Col>
                            <div style={{width:'100%',maxHeight:'68vh'}}>
                                <img alt={this.curPreviewFileItem.fName}
                                     src={toDownloadPath(this.curPreviewFileItem.fUrl)}
                                     style={{maxHeight:'65vh',
                                     }}
                                />
                            </div>
                        </Col>
                    </Row>
                    <Divider />
                    <Row type={"flex"}
                         justify="center"
                         align="middle"
                         gutter={[20,20]}
                    >
                        <Col>
                            <div style={{width:'66vw',
                                        maxHeight:'10vh'}}>
                                <Input.Group style={{width:'100%'}}>
                                    <Input
                                        placeholder={"请输入文件描述"}
                                        style={{width:'90%',height:'50px'}}
                                        maxLength={50}
                                    />
                                    <Button type={"primary"}
                                            style={{width:'10%',height:'50px'}}>保存</Button>
                                </Input.Group>

                            </div>
                        </Col>
                    </Row>

                </Modal>

                <div className={'info-box'}>
                    <div className={'info-box-list-container'}>
                        <Spin tip={"加载文件列表中..."}
                              delay={500}
                              spinning={infoBoxSpinning}>
                            <List
                                bordered={false}
                                itemLayout={"vertical"}
                                dataSource={infoBoxDatasource}
                                renderItem={this.listInfoBoxItem}>
                            </List>
                        </Spin>
                    </div>
                </div>
            </div>
        );
    }
}


function displayBlock(flag){return flag?'block':'none';}

class PictureContainer extends React.Component{

    state={
        showPreviewLoading:true,
        showMask:false,
    }

    checkHasError(){
        const data = this.props.data;
        if(data==null||
            data.fStatusUploadError==null) return false;
        else if(data.fStatusUploadError) return true;
        else return false;
    }

    render() {
        const {data,onPreviewing,onDownloading,onDeleting,onUploadingErrorDeleting} = this.props;
        const {showMask,showPreviewLoading} = this.state;
        const percent = data==null?null:data.fStatusPercent;
        const hasError = this.checkHasError();
        return (
            <div className={hasError?'file-item-container-error': 'file-item-container'}
                 onMouseEnter={event => {
                     if(!hasError&&!showPreviewLoading
                         &&percent==null)
                         this.setState({showMask:true})
                 }}
                 onMouseLeave={event => {
                     if(!hasError&&!showPreviewLoading
                         &&percent==null)
                         this.setState({showMask:false})
                 }}>
                <div className={'file-item-pic-mask'} style={{display:displayBlock(showMask)}}>
                    <Row type={'flex'}
                         justify="center"
                         align="middle"
                        gutter={[20,0]}>
                        <Col>
                                <Icon type={'eye'} className={'icon-in-pc'}
                                      onClick={e=>onPreviewing(data)}/>
                        </Col>
                        <Col>
                            <a href={toDownloadPath(data.fUrl)}>
                                <Icon type={'cloud-download'} className={'icon-in-pc'}
                                      onClick={e=>onDownloading(data)}>
                                </Icon>
                            </a>
                        </Col>
                        <Col>
                            <Popconfirm title={'确认删除？'}
                                        okText="确认" cancelText="取消"
                                        okType={'danger'}
                                        onConfirm={e => onDeleting(data)}>
                                <Icon type={'delete'} className={'icon-in-pc'}
                                      style={{color:'red'}}
                                />
                            </Popconfirm>
                        </Col>
                    </Row>
                </div>
                <div className={'file-item-uploading'}
                     style={{display:displayBlock(!hasError&&percent!=null)}}>
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
                <div className={'file-item-has-error'}
                     style={{display:displayBlock(hasError)}}>
                    <Row
                        type={'flex'}
                        justify="center"
                        align="middle">
                        <Col >
                            <Icon type={'delete'}
                                  style={{color:'red',fontSize:40}}
                                  onClick={e=>onUploadingErrorDeleting(data)}
                            />
                        </Col>
                        <Col >
                            <div style={{color:'red',fontSize:18}}>上传失败，点击移除</div>
                        </Col>
                    </Row>
                </div>
                <div id={'file-mask'}
                     className={'file-item-pic-container'}
                     style={{display:displayBlock(!hasError&&!showPreviewLoading)}}>
                    <img style={{height:'100%',width:'100%',objectFit:'contain'}}
                         src={toDownloadPath(data.fPreviewUrl)}
                         alt={data.fName}
                         onLoad={() => this.setState({showPreviewLoading:false}) }
                    />
                </div>
            </div>
        );
    }


}


export default MediaInfoBoxComponent;

